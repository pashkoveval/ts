import { renderBlock, renderToast, clearBlockOreClouseToasts } from './lib.js';
import bucingElement from './bucing-element.js'
import { formatDate, getLastDayOfNextMonth, shiftDate } from './date-utils.js';
import { renderSearchResultsBlock, renderSerchResults, renderEmptyOrErrorSearchBlock } from './search-results.js';
import { FlatRentSdk } from './flat-rent-sdk.js'

export function renderSearchFormBlock(dateArrival?: Date,): void {
  const sdk = new FlatRentSdk()
  const STATE: state = {
    response: [],
    renderFilter: null,
    emptyList: null
  }

  dateArrival = dateArrival || shiftDate(new Date(), 1)
  const arrival = formatDate(dateArrival);
  const now = formatDate(new Date());
  const lastDayOfNextMonth = formatDate(getLastDayOfNextMonth(new Date()));

  interface serchData {
    checkin: string;
    checkout: string;
    city: string;
    price: number;
    provider1: string;
    provider2: string;
    provider3: string;
  }
  interface state {
    response: Array<responsElement>
    renderFilter: boolean
    emptyList: boolean
  }

  interface responsElement {
    bookedDates: Array<string>;
    coordinates: number;
    dateIn: string;
    dateOut: string;
    details: string;
    id: string;
    img: string;
    price: number;
    title: string;
  }

  clearBlockOreClouseToasts('search-form-block');
  renderBlock(
    'search-form-block',
    `
    <form id="form">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" name="city" type="text" value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <div class="providers">
            <label><input type="checkbox" name="provider1" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider2" value="MockAPI" checked /> MockAPI</label>
            <label><input type="checkbox" name="provider3" value="flatrent" checked /> FlatRent</label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input type="date" min="${now}" max="${lastDayOfNextMonth}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input type="date" min="${arrival}" max="${lastDayOfNextMonth}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input type="number" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button type="submit">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  const form = document.querySelector('form');

  function onFormSubmit(cb) {
    const listener = (event: Event) => {
      event.preventDefault();
      const formData = new FormData(form);
      cb({
        city: formData.get('city'),
        provider1: formData.get('provider1'),
        provider2: formData.get('provider2'),
        provider3: formData.get('provider3'),
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        price: formData.get('price'),
      })
    }
    form.addEventListener('submit', listener)
    return () => form.removeEventListener('submit', listener)
  }


  onFormSubmit(search)

  async function fetchToStore(path: string) {
    await fetch(path)
      .then(response => response.json())
      .then(r => {
        if (r) {
          for (const el in r) {
            if (Object.prototype.hasOwnProperty.call(r, el)) {
              const element: responsElement = r[el];
              STATE.response.unshift(element);
            }
          }
        }
      })
  }

  function renderResult() {
    renderSearchResultsBlock()

    const sort: HTMLInputElement = document.querySelector('#sort');
    sortBy(sort.value)

    sort.addEventListener('change', () => {
      sortBy(sort.value)
    })


    if (STATE.response && STATE.response.length) {
      clearBlockOreClouseToasts('results-list')
      if (STATE.emptyList) {
        clearBlockOreClouseToasts('results-list')
      }
      STATE.response.forEach(el => {
        renderSerchResults(el)
      })
      STATE.emptyList = false;
      bucingElement()
    }
    if (!STATE.response || !STATE.response.length) {
      STATE.emptyList = true;
      clearBlockOreClouseToasts('results-list')
      renderEmptyOrErrorSearchBlock('Ничего не найдено')
    }

  }

  function sortBy(sort: string): void {
    if (sort === 'chep') {
      STATE.response.sort((a, b) => {
        if (a.price > b.price) return -1;
      })
      clearBlockOreClouseToasts('results-list')
      STATE.response.forEach(el => {
        renderSerchResults(el)
      })
    }
    if (sort === 'reach') {
      STATE.response.sort((a, b) => {
        if (b.price > a.price) return -1;
      })
      clearBlockOreClouseToasts('results-list')
      STATE.response.forEach(el => {
        renderSerchResults(el)
      })
    }
    if (sort === 'close') {
      STATE.response.sort((a, b) => {
        if (a.coordinates > b.coordinates) return -1;
      })
      clearBlockOreClouseToasts('results-list')
      STATE.response.forEach(el => {
        renderSerchResults(el)
      })
    }
  }

  async function search(serchData: serchData) {
    STATE.response = []
    const { provider1, provider2, provider3 } = serchData;

    if (provider1 !== null) {
      const path = 'http://localhost:3000/places'
      await fetchToStore(path);
    }
    if (provider2 !== null) {
      const path = 'https://602c2a0730ba720017222bc0.mockapi.io/p'
      await fetchToStore(path);
    }
    if (provider3 !== null) {
      await sdk.search(serchData)
        .then((result) => {
          result.forEach((element) => {
            STATE.response.unshift(element);

          })
        })

    } else {
      STATE.emptyList = true;
      clearBlockOreClouseToasts('results-list')
      renderEmptyOrErrorSearchBlock('Ничего не найдено')
    }

    renderResult();
    onReserve(onReservAdding)
  }


  function onReserve(cb) {
    const btns = document.querySelectorAll('.reserve')
    const listener = (event: Event) => {
      event.preventDefault();
      cb(event)
    }
    btns.forEach(btn => {
      btn.addEventListener('click', listener)
    })
  }

  function onReservAdding(btn: Event) {
    const id = (<HTMLElement>btn.target).id
    let reserveArray = JSON.parse(localStorage.getItem('reserveArray'))
    if (!reserveArray) {
      reserveArray = []
    }
    const findedEl = reserveArray.find(ell => ell.id === id);

    STATE.response.forEach((el) => {
      if (el.id === id && !findedEl) {
        reserveArray.push(el)
        renderToast(
          {
            text: 'Номер забронирован',
            type: 'success'
          },
          {
            name: 'Ура!!!',
            handler: () => {
              clearBlockOreClouseToasts('toast-block')
            }
          }
        )
      }
    })
    // reserveArray = [] //Что бы подчистить потом этот массив
    localStorage.setItem('reserveArray', JSON.stringify(reserveArray));
  }
}

import { renderBlock, renderToast, clearBlockOreClouseToasts } from './lib.js';
import bucingElement from './bucing-element.js'
import { formatDate, getLastDayOfNextMonth, shiftDate } from './date-utils.js';
import { renderSearchResultsBlock, renderSerchResults, renderEmptyOrErrorSearchBlock } from './search-results.js';


export function renderSearchFormBlock(dateArrival?: Date,): void {
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
    id: number;
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
            <label><input type="checkbox" name="provider2" value="flat-rent" checked /> FlatRent</label>
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
              element.id = +element.id
              STATE.response.unshift(element);
            }
          }
        }
      })
  }

  function renderResult() {
    renderSearchResultsBlock()

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

  async function search(serchData: serchData) {
    STATE.response = []
    const { provider1, provider2 } = serchData;

    if (provider1 !== null) {
      const path = 'http://localhost:3000/places'
      await fetchToStore(path);
    }
    if (provider2 !== null) {
      const path = 'https://602c2a0730ba720017222bc0.mockapi.io/p'
      await fetchToStore(path);
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
    const id = +(<HTMLElement>btn.target).id
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

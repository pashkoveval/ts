import { renderBlock } from './lib.js';
import { formatDate, getLastDayOfNextMonth, shiftDate } from './date-utils.js';

export function renderSearchFormBlock(dateArrival?: Date, dateDeparture?: Date): void {

  dateArrival = dateArrival || shiftDate(new Date(), 1)
  const arrival = formatDate(dateArrival);
  const departure = formatDate(dateDeparture || shiftDate(dateArrival, 2));
  const now = formatDate(new Date());
  const lastDayOfNextMonth = formatDate(getLastDayOfNextMonth(new Date()));

  interface serchData {
    price: number
    dateIn: string
    dateOut: string
    city: string
  }
  interface staticSrechData {
    staticprice: number
    staticformDateArrival: string
    staticformDateDeparture: string
    staticcity: string
  }

  renderBlock(
    'search-form-block',
    `
    <form>
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <!-- <div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div> -->
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${arrival}" min="${now}" max="${lastDayOfNextMonth}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${departure}" min="${arrival}" max="${lastDayOfNextMonth}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="number" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button id="serchBTN">Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )

  let cityValue: string;
  let formDateArrivalValue: string;
  let formDateDepartureValue: string;
  let priceValue: number;

  const staticcity = (<HTMLInputElement>document.getElementById('city')).value
  const staticformDateArrival = (<HTMLInputElement>document.getElementById('check-in-date')).value
  const staticformDateDeparture = (<HTMLInputElement>document.getElementById('check-out-date')).value
  const staticprice = Number((<HTMLInputElement>document.getElementById('max-price')).value)

  const city = (<HTMLInputElement>document.getElementById('city'))
  const formDateArrival = (<HTMLInputElement>document.getElementById('check-in-date'))
  const formDateDeparture = (<HTMLInputElement>document.getElementById('check-out-date'))
  const price = (<HTMLInputElement>document.getElementById('max-price'))
  const serchBTN = document.getElementById('serchBTN')

  const staticSrechData: staticSrechData = {
    staticprice,
    staticformDateArrival,
    staticformDateDeparture,
    staticcity,
  }

  if (serchBTN != null) {
    serchBTN.onclick = function (event) {
      event.preventDefault();
      search(searchFormData(staticSrechData))
    }
  }


  function searchFormData(staticDataSerch: staticSrechData) {
    const { staticcity, staticformDateArrival, staticformDateDeparture, staticprice } = staticDataSerch

    price.onchange = () => {
      priceValue = Number(price.value)
    }
    formDateDeparture.onchange = () => {
      formDateDepartureValue = formDateDeparture.value
    }
    formDateArrival.onchange = () => {
      formDateArrivalValue = formDateArrival.value
    }
    city.onchange = () => {
      cityValue = city.value
    }

    const serchData: serchData = {
      price: priceValue || staticprice,
      dateIn: formDateArrivalValue || staticformDateArrival,
      dateOut: formDateDepartureValue || staticformDateDeparture,
      city: cityValue || staticcity,
    }

    return serchData;
  }

  function search(serchData: serchData): never {
    const { price, dateIn, dateOut, city } = serchData
    console.log('serch', price, dateIn, dateOut, city);
    throw 0
  }

}

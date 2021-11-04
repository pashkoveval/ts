import { renderSearchFormBlock } from './search-form.js'
import { renderSearchStubBlock } from './search-results.js'
import { renderUserBlock } from './user.js'
import { renderToast, clearBlockOreClouseToasts } from './lib.js'
import localdata from './getDataLocalstorage.js'


export function render() {
  const userData = localdata();

  if (userData) {
    const { userName, userAvatar, userFavoriteItemsAmount } = userData;
    renderUserBlock(userName, userAvatar, userFavoriteItemsAmount)
  } else {
    renderUserBlock('Wade Warren', '/img/avatar.png', [])
  }
  renderSearchFormBlock()
  renderSearchStubBlock()
  renderToast(
    {
      text: 'Это пример уведомления. Используйте его при необходимости',
      type: 'success'
    },
    {
      name: 'Понял',
      handler: () => {
        clearBlockOreClouseToasts('toast-block')
      }
    }
  )
}
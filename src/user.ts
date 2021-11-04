import { renderBlock, clearBlockOreClouseToasts } from './lib.js'

export function renderUserBlock(userName: string, avatarSrc: string, favoriteItemsAmount: Array<number>): void {
  clearBlockOreClouseToasts('user-block');
  const favoritesCaption = favoriteItemsAmount
    ? `Избранных: ${favoriteItemsAmount.length}`
    : 'ничего нет';

  const heartIcon = favoriteItemsAmount
    ? 'heart'
    : 'heart2';

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${avatarSrc}" alt="${userName}" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <span id="fav-val">${favoritesCaption}</span>
            <span class="${heartIcon}"></span>
          </p>
      </div>
    </div>
    `
  )
}

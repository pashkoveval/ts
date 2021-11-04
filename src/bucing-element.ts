import localdata from './getDataLocalstorage.js'
import { renderUserBlock } from './user.js'

export default () => {
  const like: NodeListOf<Element> = document.querySelectorAll('.favorites');
  const favorites = localdata().userFavoriteItemsAmount;
  const favoritesItems: Array<number> = favorites;

  like.forEach((likeBTN) => {
    const idlikeBTN: number = +likeBTN.id;

    function addToStorage(favoritesItems: Array<number>, favorites: Array<number>, idlikeBTN: number): void {
      favoritesItems.push(idlikeBTN)
      localStorage.setItem('userFavoriteItemsAmount', JSON.stringify(favoritesItems));
      const localStorageUpdate = localdata();
      renderUserBlock(localStorageUpdate.userName, localStorageUpdate.userAvatar, localStorageUpdate.userFavoriteItemsAmount)
    }

    function removeToStorage(favoritesItems: Array<number>, idlikeBTN: number): void {
      favoritesItems.forEach((fi, idx) => {
        if (fi === idlikeBTN) {
          favoritesItems.splice(idx, 1);
        }
      })
      localStorage.setItem('userFavoriteItemsAmount', JSON.stringify(favoritesItems));
      const localStorageUpdate = localdata();
      renderUserBlock(localStorageUpdate.userName, localStorageUpdate.userAvatar, localStorageUpdate.userFavoriteItemsAmount)
    }


    if (favorites) {
      favorites.forEach(element => {
        if (idlikeBTN === element) {
          likeBTN.classList.add('active')
        }
      })

    }

    likeBTN.addEventListener('click', () => {
      likeBTN.classList.toggle('active')

      if (likeBTN.classList[1] === 'active') {
        addToStorage(favoritesItems, favorites, idlikeBTN)
      } else {
        removeToStorage(favoritesItems, idlikeBTN);
      }
    })

  })

}
import localdata from './getDataLocalstorage.js'
import { renderUserBlock } from './user.js'

export default () => {
  const like: NodeListOf<Element> = document.querySelectorAll('.favorites');
  const favorites = localdata().userFavoriteItemsAmount;
  const favoritesItems: Array<string> = favorites;

  like.forEach((likeBTN) => {
    const idlikeBTN: string = likeBTN.id;

    function addToStorage(favoritesItems: Array<string>, favorites: Array<string>, idlikeBTN: string): void {
      favoritesItems.push(idlikeBTN)
      localStorage.setItem('userFavoriteItemsAmount', JSON.stringify(favoritesItems));
      const localStorageUpdate = localdata();
      renderUserBlock(localStorageUpdate.userName, localStorageUpdate.userAvatar, localStorageUpdate.userFavoriteItemsAmount)
    }

    function removeToStorage(favoritesItems: Array<string>, idlikeBTN: string): void {
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
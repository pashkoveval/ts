export default () => {
  interface localStorage {
    userName: string;
    userAvatar: string;
    userFavoriteItemsAmount: Array<number>;
  }

  const name: string = localStorage.getItem('userName')
  const avatar: string = localStorage.getItem('userAvatar')
  const item: Array<number> = JSON.parse(localStorage.getItem('userFavoriteItemsAmount'))

  const readeData: localStorage = {
    userName: name,
    userAvatar: avatar,
    userFavoriteItemsAmount: item,
  }

  return readeData
}
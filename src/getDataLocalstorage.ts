export default () => {
  interface localStorage {
    userName: string;
    userAvatar: string;
    userFavoriteItemsAmount: Array<string>;
  }

  const name: string = localStorage.getItem('userName')
  const avatar: string = localStorage.getItem('userAvatar')
  let item: Array<string> = JSON.parse(localStorage.getItem('userFavoriteItemsAmount'))
  if (!item || item.length === 0) {
    item = [];
  }

  const readeData: localStorage = {
    userName: name,
    userAvatar: avatar,
    userFavoriteItemsAmount: item,
  }

  return readeData
}
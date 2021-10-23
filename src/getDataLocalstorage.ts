export default () => {
  interface Obj {
    userName: string;
    userAvatar: string;
    userFavoriteItemsAmount: number;
  }

  const name: string = localStorage.getItem('userName')
  const avatar: string = localStorage.getItem('userAvatar')
  const item: string = localStorage.getItem('userFavoriteItemsAmount')

  const readeData: Obj = {
    userName: name,
    userAvatar: avatar,
    userFavoriteItemsAmount: item ? Number(item) : 0,
  }

  return readeData
}
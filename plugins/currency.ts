import Vue from 'vue'

export const currencyFormat = (
  price: number,
  currency: string,
  isShowPrice: boolean
) => {
  const priceFixed = Number(price).toFixed(2)
  const priceNumber = Number(priceFixed)

  let moneyFormat = ''

  let abs = price < 0 ? '-' : ''

  if (currency) {
    switch (currency) {
      case 'USD':
        moneyFormat = `${abs}$${new Intl.NumberFormat().format(
          Math.abs(priceNumber)
        )}`
        break
      case '$':
        moneyFormat = `${abs}$${new Intl.NumberFormat().format(
          Math.abs(priceNumber)
        )}`
        break
      case 'YEN':
        moneyFormat = `${abs}¥${new Intl.NumberFormat().format(
          Math.abs(priceNumber)
        )}`
        break
      case '¥':
        moneyFormat = `${abs}¥${new Intl.NumberFormat().format(
          Math.abs(priceNumber)
        )}`
        break
      default:
        break
    }
  } else {
    moneyFormat = new Intl.NumberFormat().format(Math.abs(priceNumber))
  }

  if (priceNumber) {
    return moneyFormat
  } else if (currency === undefined) {
    return '0'
  } else if (!isShowPrice) {
    return '¥0'
  } else {
    return ''
  }
}
Vue.filter('currency', currencyFormat)

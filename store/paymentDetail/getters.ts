import { IState } from './types'

interface IMethod {
  name: string
  code: string
}

export default {
  paymentMethodSelected: (state: IState) => state.paymentMethodSelected,
  isPaymentTriggered: (state: IState) => state.isPaymentTriggered,
  isBillingInformationValidated: (state: IState) =>
    state.isFormValidated && state.isMonthYearSelected,
  isMonthYearSelected: (state: IState) => state.isMonthYearSelected,
  paymentMethodList(_state: any, _getters: any, rootState: any) {
    const { roomSelectedFromAPI } = rootState.hotelDetail

    return roomSelectedFromAPI.payment_method
  },
  paymentMethod(state: any, getters: any) {
    return state.paymentMethodSelected
  },

  paymentMethodItem(state: any, getters: any) {
    const selectedItem = getters.paymentMethodList.find(
      (item: any) => item.code === state.paymentMethodSelected
    )
    return selectedItem || null
  }
}

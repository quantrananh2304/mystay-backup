export default () => ({
  paymentMethodSelected: '',
  isFormValidated: false,
  isMonthYearSelected: false,
  isPaymentTriggered: false,
  isLoading: false,
  paymentState: {
    data: {},
    error: {},
    token: ''
  }
})

import createLogger from 'vuex/dist/logger'
export const strict = false
const debug = process.env.NODE_ENV !== 'production'
export const plugins = debug ? [createLogger({})] : []
export const namespaced = true

export default (): any => ({
  isFormInvalid: true,
  isMakingForSomeoneFormInvalid: true,
  isSubmitted: false,
  additionalList: [],
  extrasList: [],
  guest: [],
  extrasParams: [
    {
      extra_id: '',
      quantity: 0,
      delivery_times: [
        {
          delivered_at: '',
          quantity: 0
        }
      ],
      answer: ''
    }
  ],
  additionalParams: [],
  someoneElseData: {},
  isBookingForSomeoneElse: false,
  isReceiveSubscription: false
})

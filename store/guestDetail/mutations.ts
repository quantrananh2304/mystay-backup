import * as fromTypes from './types'
import { MutationTree } from 'vuex'
import state from './state'

export type RootState = ReturnType<typeof state>

const mutations: MutationTree<RootState> = {
  [fromTypes.TRIGGER_IS_FORM_INVALID](state, payload: boolean) {
    state.isFormInvalid = payload
  },
  [fromTypes.TRIGGER_SUBMIT_BUTTON](state) {
    state.isSubmitted = !state.isSubmitted
  },

  [fromTypes.GET_EXTRAS_SUCCESS](state, payload) {
    state.extrasList = payload
  },

  [fromTypes.GET_EXTRAS_FAIL](_state, _payload) {},

  [fromTypes.GET_GUEST_DETAIL_ADDITIONAL](state) {
    state.additionalList = []
  },

  [fromTypes.GET_GUEST_DETAIL_ADDITIONAL_SUCCESS](state, payload) {
    state.additionalList = payload
  },

  [fromTypes.GET_GUEST_DETAIL_ADDITIONAL_FAIL](_state, _payload) {},
  [fromTypes.GET_GUEST_DETAIL_DATA](state, payload) {
    const { guestData, lang } = payload
    const guestArr = guestData.map((item: any) => {
      const guestInJapan = {
        email: `${item.guestInfoInput.email.value?.trim()}`,
        name: `${item.guestInfoInput.firstNameInput.value?.trim()} ${item.guestInfoInput.lastNameInput.value?.trim()}`,
        first_name: `${item.guestInfoInput?.kanjiFirstName?.value?.trim()}`,
        last_name: `${item.guestInfoInput?.kanjiLastName?.value?.trim()}`,
        first_name_kana:
          `${item.guestInfoInput?.firstNameInput.value?.trim()}` || '',
        last_name_kana:
          `${item.guestInfoInput?.lastNameInput.value?.trim()}` || '',
        phone: `${item.guestInfoInput.phone.value?.trim()}`,
        additional: item.additional
      }

      const guestNotInJapan = {
        email: `${item.guestInfoInput.email.value?.trim()}`,
        name:
          `${item.guestInfoInput.firstNameInput.value?.trim()} ${item.guestInfoInput.lastNameInput.value?.trim()}` ||
          '',
        first_name:
          `${item.guestInfoInput?.firstNameInput?.value?.trim()}` || '',
        last_name: `${item.guestInfoInput?.lastNameInput?.value?.trim()}` || '',
        first_name_kana: '',
        last_name_kana: '',
        phone: `${item.guestInfoInput.phone.value?.trim()}`,
        additional: item.additional
      }
      return lang === 'ja' ? guestInJapan : guestNotInJapan
    })
    state.guest = guestArr
  },

  [fromTypes.SAVE_GUEST_DATA_FROM_API](state, payload) {
    state.guest = payload
  },

  [fromTypes.SAVE_EXTRAS_PARAMS](state, payload) {
    state.extrasParams = payload
  },

  [fromTypes.SAVE_ADDITIONNAL_PARAMS](state, payload) {
    state.additionalParams = payload
  },

  [fromTypes.SAVE_ADDITIONAL_DATA](_state, _payload) {},

  [fromTypes.SAVE_BOOKING_FOR_SOMEONE_ELSE](state, payload) {
    state.someoneElseData = {
      first_name: payload.firstNameInput.value,
      first_name_kana: payload.kanjiFirstName.value,
      last_name: payload.lastNameInput.value,
      last_name_kana: payload.kanjiLastName.value
    }
  },

  [fromTypes.SAVE_IS_BOOKING_FOR_SOMEONE_ELSE](state, payload) {
    state.isBookingForSomeoneElse = payload
  },

  [fromTypes.TRIGGER_IS_MAKING_FOR_SOMEONE_FORM_INVALID](state, payload) {
    state.isMakingForSomeoneFormInvalid = payload
  },

  [fromTypes.SAVE_RECEIVE_SUBSCRIPTION](state, isReceive) {
    state.isReceiveSubscription = isReceive
  },

  [fromTypes.RESET_GUEST_DATA](state) {
    state.someoneElseData = {}
    state.guest = []
    state.isBookingForSomeoneElse = false
    state.extrasParams = [
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
    ]
  }
}

export default mutations

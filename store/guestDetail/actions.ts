import * as types from './types'

import { ActionTree } from 'vuex'
import state from './state'
export type RootState = ReturnType<typeof state>

const actions: ActionTree<RootState, RootState> = {
  triggerIsFormInvalid({ commit }, payload) {
    commit(types.TRIGGER_IS_FORM_INVALID, payload)
  },
  triggerSubmitButton({ commit }) {
    commit(types.TRIGGER_SUBMIT_BUTTON)
  },

  getExtras({ commit }, payload) {
    this.$triplaRepo.guest
      .getExtras(payload)
      .then(resp => {
        commit(types.GET_EXTRAS_SUCCESS, resp.data)
      })
      .catch(error => {
        commit(types.GET_EXTRAS_FAIL, { error })
      })
  },

  getAdditionalQuestion({ commit }, payload) {
    commit(types.GET_GUEST_DETAIL_ADDITIONAL_SUCCESS)
    this.$triplaRepo.guest
      .getAdditionalQuestion(payload)
      .then(resp => {
        commit(types.GET_GUEST_DETAIL_ADDITIONAL_SUCCESS, resp.data)
      })
      .catch(error => {
        commit(types.GET_GUEST_DETAIL_ADDITIONAL_FAIL, { error })
      })
  },

  getDataGuestDetail({ commit }, payload) {
    commit(types.GET_GUEST_DETAIL_DATA, payload)
  },

  saveGuestDataFromAPI({ commit }, payload) {
    commit(types.SAVE_GUEST_DATA_FROM_API, payload)
  },

  saveExtrasParams({ commit }, payload) {
    commit(types.SAVE_EXTRAS_PARAMS, payload)
  },

  saveAdditionalParams({ commit }, payload) {
    commit(types.SAVE_ADDITIONNAL_PARAMS, payload)
  },

  saveExtrasAnswer({ commit }, payload) {
    commit(types.SAVE_EXTRAS_ANSWER, payload)
  },

  saveAdditionallData({ commit }, payload) {
    commit(types.SAVE_ADDITIONAL_DATA, payload)
  },

  saveBookingForSomeoneElseData({ commit }, payload) {
    commit(types.SAVE_BOOKING_FOR_SOMEONE_ELSE, payload)
  },

  saveiSBookingForSomeoneElseData({ commit }, payload) {
    commit(types.SAVE_IS_BOOKING_FOR_SOMEONE_ELSE, payload)
  },

  triggerIsMakingForSomeoneFormInvalid({ commit }, payload) {
    commit(types.TRIGGER_IS_MAKING_FOR_SOMEONE_FORM_INVALID, payload)
  },

  saveReceiveSubscription({ commit }, isReceive) {
    commit(types.SAVE_RECEIVE_SUBSCRIPTION, isReceive)
  },

  resetGuestData({ commit }) {
    commit('RESET_GUEST_DATA')
  }
}

export default actions

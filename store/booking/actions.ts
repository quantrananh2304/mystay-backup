/* eslint-disable import/no-duplicates */
import CheckPromoCodeUseCase from '../../domain/usecases/customer/hotel/CheckPromoCodeUseCase'
import SetInitialBookingUseCase from '../../domain/usecases/hotel/SetInitialBookingUseCase'
import GetInitialBookingUseCase from '../../domain/usecases/hotel/GetInitialBookingUseCase'
import {
  getCancelBookingGtmPayload,
  bookingIsConfirmedGtm
} from '../../plugins/gtm'
import { BookingActionTypes } from './types'

import { ActionTree } from 'vuex'
import state, { IBookingState } from './state'

const actions: ActionTree<IBookingState, IBookingState> = {
  showLocation({ commit }) {
    commit(BookingActionTypes.SHOW_LOCATION)
  },

  showChecking({ commit }) {
    commit(BookingActionTypes.SHOW_CHECKING)
  },

  showRoomSelect({ commit }) {
    commit(BookingActionTypes.SHOW_ROOM_SELECT)
  },

  showNightSelect({ commit }) {
    commit(BookingActionTypes.SHOW_NIGHT_SELECT)
  },

  showPromoCode({ commit }) {
    commit(BookingActionTypes.SHOW_PROMO_CODE)
  },

  showTotalGuest({ commit }) {
    commit(BookingActionTypes.SHOW_TOTAL_GUEST)
  },

  closeAll({ commit }) {
    commit(BookingActionTypes.CLOSE_ALL)
  },

  getLocation({ commit }, payload) {
    commit(BookingActionTypes.GET_LOCATION, { payload })
  },

  getBookingId({ commit }, payload) {
    commit(BookingActionTypes.GET_BOOKING_ID, { payload })
  },

  getCheckin({ commit }, payload) {
    commit(BookingActionTypes.GET_CHECKIN, { payload })
  },

  getCheckout({ commit }, payload) {
    commit(BookingActionTypes.GET_CHECKOUT, { payload })
  },

  getPromoCode({ commit }, payload) {
    commit(BookingActionTypes.GET_PROMO_CODE, { payload })
  },

  getDataFromUrl({ commit }, payload) {
    commit(BookingActionTypes.GET_DATA_FROM_URL, payload)
  },

  setSearchKeyword({ commit }, keyword) {
    commit(BookingActionTypes.SET_SEARCH_KEYWORD, keyword)
  },

  getError({ commit }, payload) {
    commit(BookingActionTypes.GET_ERROR, { payload })
  },

  resetHotelId({ commit }) {
    commit(BookingActionTypes.RESET_HOTEL_ID)
  },

  checkPromoCodeExistance({ commit }, payload) {
    const usecase = new CheckPromoCodeUseCase(payload)
    usecase
      .execute()
      .then(res => {
        commit(BookingActionTypes.CHECK_PROMO_CODE_SUCCESS, { payload: res })
      })
      .catch(error => {
        commit(BookingActionTypes.CHECK_PROMO_CODE_FAIL, { error })
      })
  },

  setInitialBooking({ commit }, payload) {
    const useCase = new SetInitialBookingUseCase(payload)
    useCase.execute().then(_res => {
      commit(BookingActionTypes.SET_INITIAL_BOOKING, {
        payload
      })
    })
  },

  getInitialBooking({ commit }) {
    const useCase = new GetInitialBookingUseCase()
    useCase.execute().then(res => {
      commit(BookingActionTypes.GET_INITIAL_BOOKING, {
        payload: res
      })
    })
  },
  // RoomSelect
  a_saveRoomList({ commit }, payload) {
    commit(BookingActionTypes.SAVE_ROOM_LIST, payload)
  },

  a_addRoom({ commit }) {
    commit(BookingActionTypes.ADD_ROOM)
  },

  a_deleteRoom({ commit }, roomID) {
    commit(BookingActionTypes.DELETE_ROOM, roomID)
  },

  a_onChildChange({ commit }, payload) {
    commit(BookingActionTypes.ON_CHANGE_CHILD, payload)
  },

  a_onPersonChange({ commit }, payload) {
    commit(BookingActionTypes.ON_CHANGE_PERSON, payload)
  },

  a_onChildChangeAge({ commit }, payload) {
    commit(BookingActionTypes.ON_CHANGE_CHILD_AGE, payload)
  },

  a_onChangeBedSelect({ commit }, payload) {
    commit(BookingActionTypes.ON_CHANGE_BED_SELECT, payload)
  },

  searchType({ commit }, payload) {
    commit(BookingActionTypes.SET_SEARCH_TYPE, payload)
  },

  setSearchType({ commit }, payload: string) {
    commit(BookingActionTypes.SET_QUERY_SEARCH_TYPE, payload)
  },

  saveSearchData({ commit }, payload) {
    commit(BookingActionTypes.SAVE_SEARCH_DATA, payload)
  },

  saveHotelID({ commit }, payload) {
    commit(BookingActionTypes.SAVE_HOTEL_ID, payload)
  },

  deleteRoomTypeCodes({ commit }, payload) {
    commit(BookingActionTypes.DELETE_ROOM_TYPE_CODE, payload)
  },

  createReservations({ commit }, payload) {
    commit(BookingActionTypes.CREATE_RESERVATIONS)
    return new Promise((resolve, reject) => {
      this.$triplaRepo.reservations
        .createReservations(payload)
        .then(res => {
          commit(BookingActionTypes.CREATE_RESERVATIONS_SUCCESS, {
            payload: res.data
          })

          const gtmData = { ...payload, ...res.data }
          this.$gtm.push(bookingIsConfirmedGtm(gtmData))
          resolve(res)
        })
        .catch(error => {
          reject(error)
          commit(BookingActionTypes.CREATE_RESERVATIONS_FAIL, {
            error: error?.message[0]?.title
          })
        })
    })
  },

  getReservations({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(BookingActionTypes.GET_RESERVATIONS)
      this.$triplaRepo.reservations
        .getReservations(payload)
        .then(res => {
          commit(BookingActionTypes.GET_RESERVATIONS_SUCCESS, {
            payload: res.data
          })

          resolve(res)
        })
        .catch(error => {
          commit(BookingActionTypes.GET_RESERVATIONS_FAIL, { error })
          reject(error.message?.[0]?.title || '')
        })
    })
  },

  cancelReservations({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(BookingActionTypes.CANCEL_RESERVATIONS)
      this.$triplaRepo.reservations
        .cancelReservations(payload)
        .then(res => {
          commit(BookingActionTypes.CANCEL_RESERVATIONS_SUCCESS, {
            payload: res.data
          })

          resolve(res)

          const gtmData = { ...res.data, ...payload }
          this.$gtm.push(getCancelBookingGtmPayload(gtmData))
        })
        .catch(error => {
          reject(error)
          commit(BookingActionTypes.CANCEL_RESERVATIONS_FAIL, { error })
        })
    })
  },

  updateReservations({ commit }, payload) {
    commit(BookingActionTypes.UPDATE_RESERVATIONS)
    this.$triplaRepo.reservations
      .updateReservations(payload)
      .then(res => {
        commit(BookingActionTypes.UPDATE_RESERVATIONS_SUCCESS, {
          payload: res.data
        })
      })
      .catch(error => {
        commit(BookingActionTypes.UPDATE_RESERVATIONS_FAIL, { error })
      })
  },

  updateGuestDetail({ commit }, payload) {
    commit(BookingActionTypes.UPDATE_GUEST_DETAIL)
    this.$triplaRepo.reservations
      .updateGuestDetail(payload)
      .then(res => {
        commit(BookingActionTypes.UPDATE_GUEST_DETAIL_SUCCESS, {
          payload: res.data
        })
      })
      .catch(error => {
        commit(BookingActionTypes.UPDATE_GUEST_DETAIL_FAIL, { error })
      })
  },

  getSettingReservations({ commit }, payload) {
    this.$triplaRepo.reservations
      .getSettingReservations(payload)
      .then(res => {
        commit(BookingActionTypes.GET_SETTING_RESERVATIONS_SUCCESS, {
          payload: res.data
        })
      })
      .catch(error => {
        commit(BookingActionTypes.GET_SETTING_RESERVATIONS_FAIL, { error })
      })
  },

  saveUrlParamsReservations({ commit }, payload) {
    commit(BookingActionTypes.SAVE_URL_PARAMS_RESERVATIONS, payload)
  },

  setBookingFromAPI({ commit }, payload) {
    commit(BookingActionTypes.SET_BOOKING_FROM_API, payload)
  },

  setCalendar({ commit }, payload) {
    commit(BookingActionTypes.SET_CALENDAR, payload)
  },

  saveRoomParamsForGetRoomSelected({ commit }) {
    commit(BookingActionTypes.SAVE_ROOM_PARAMS_FOR_GET_ROOM_SELECTED)
  },

  delRoomParamsForGetRoomSelected({ commit }, roomIdx) {
    commit(BookingActionTypes.DEL_ROOM_PARAMS_FOR_GET_ROOM_SELECTED, roomIdx)
  },

  saveUseDayParamsFromBooking({ commit }, payload) {
    commit(BookingActionTypes.SAVE_USE_DAY_PARAMS_FROM_BOOKING, payload)
  },

  saveIsRoomAvailable({ commit }, payload) {
    commit(BookingActionTypes.SAVE_IS_ROOM_AVAILABLE, payload)
  },

  saveIsUndated({ commit }, payload) {
    commit(BookingActionTypes.SAVE_IS_UNDATED, payload)
  },

  saveCurrentTab({ commit }, payload) {
    commit(BookingActionTypes.SAVE_CURRENT_TAB, payload)
  },

  resetRoomTypeCode({ commit }) {
    commit(BookingActionTypes.RESET_ROOM_TYPE_CODE)
  },

  setTotalNight({ commit }, payload) {
    commit(BookingActionTypes.SET_TOTAL_NIGHT, payload)
  }
}

export default actions

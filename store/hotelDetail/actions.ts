import * as types from './types'
import { ActionTree } from 'vuex'
import { HotelDetailState } from './state'
export type RootState = HotelDetailState

const actions: ActionTree<RootState, RootState> = {
  a_toggleSidebar({ commit }, payload) {
    commit(types.toggleSidebar, payload)
  },

  a_zoomSlideFullScreen({ commit }) {
    commit(types.zoomSlideFullScreen)
  },

  a_saveRoomInfo({ commit }, payload) {
    commit(types.saveRoomInfo, payload)
  },

  a_deleteRoomDetailsSummary({ commit }, payload) {
    commit(types.deleteRoomDeatailsSummary, payload)
  },

  getDataFromUrl({ commit }, payload) {
    commit(types.GET_DATA_FROM_URL, payload)
  },

  searchRoom({ commit }, payload) {
    commit(types.SEARCH_ROOM)
    return new Promise((resolve, reject) => {
      if (payload.queryString.type === 'rooms') {
        this.$triplaRepo.hotelDetail
          .getRooms(payload)
          .then(resp => {
            resolve(resp.data.rooms)
            commit(types.SEARCH_ROOM_SUCCESS, { payload: resp.data })
          })
          .catch(error => {
            reject(error)
            commit(types.SEARCH_ROOM_FAIL, { error })
          })
      } else {
        this.$triplaRepo.hotelDetail
          .getPlans(payload)
          .then(resp => {
            resolve(resp.data.plans)
            commit(types.SEARCH_PLAN_SUCCESS, { payload: resp.data })
          })
          .catch(error => {
            reject(error)
            commit(types.SEARCH_ROOM_FAIL, { error })
          })
      }
    })
  },

  async getHotelDetail({ commit }, payload) {
    commit(types.GET_HOTEL_DETAIL)
    return new Promise((resolve, reject) => {
      this.$triplaRepo.hotelDetail
        .getHotelDetail(payload)
        .then(resp => {
          resolve(resp.data)
          commit(types.GET_HOTEL_DETAIL_SUCCESS, resp)
        })
        .catch(error => {
          reject(error)
          commit(types.GET_HOTEL_DETAIL_FAIL, error)
        })
    })
  },

  getHotelDetailV2({ commit }, payload) {
    commit(types.GET_HOTEL_DETAIL_V2)
    this.$mystaysRepo
      .getHotelDetailV2(payload)
      .then(resp => {
        commit(types.GET_HOTEL_DETAIL_V2_SUCCESS, { payload: resp.data })
      })
      .catch(error => {
        commit(types.GET_HOTEL_DETAIL_V2_FAIL, { error })
      })
  },

  getHotelSettings({ commit }, hotel_code: string | number) {
    commit(types.GET_HOTEL_SETTINGS)
    this.$triplaRepo.hotelDetail
      .getHotelSettings(hotel_code)
      .then(res => {
        commit(types.GET_HOTEL_SETTINGS_SUCCESS, res.data)
      })
      .catch(error => {
        commit(types.GET_HOTEL_SETTINGS_FAIL, error)
      })
  },

  changeTab({ commit }, payload) {
    commit(types.CHANGE_TAB, payload)
  },

  saveRoomFilter({ commit }, payload) {
    commit(types.SAVE_ROOM_FILTER, payload)
  },

  clearRoomSelected({ commit }) {
    commit(types.CLEAR_ROOM_SELECTED)
  },

  saveSortRoomBy({ commit }, payload) {
    commit(types.SAVE_FILTER_ROOM_BY, payload)
  },

  saveRoomPlanCode({ commit }, payload) {
    commit(types.SAVE_ROOM_PLAN_CODE, payload)
  },

  getCancellationPolicies({ commit }, payload) {
    commit(types.GET_CANCELLATION_POLICIES)
    this.$triplaRepo.hotelDetail
      .getCancellationPolicies(payload)
      .then(resp => {
        commit(types.GET_CANCELLATION_POLICIES_SUCCESS, { payload: resp })
      })
      .catch(error => {
        commit(types.GET_CANCELLATION_POLICIES_FAIL, { error })
      })
  },

  getHotelReviews({ commit }, payload) {
    this.$mystaysRepo
      .getHotelReviews(payload)
      .then(resp => {
        commit(types.GET_HOTEL_REVIEWS_SUCCESS, { payload: resp.data })
      })
      .catch(error => {
        commit(types.GET_HOTEL_REVIEWS_FAIL, { error })
      })
  },

  getRoomSelected({ commit }, payload) {
    commit(types.GET_ROOM_SELECTED)

    return new Promise((resolve, reject) => {
      this.$triplaRepo.hotelDetail
        .getRoomSelected(payload)
        .then(resp => {
          resolve(resp)
          commit(types.GET_ROOM_SELECTED_SUCCESS, { payload: resp.data })
        })
        .catch(error => {
          reject(error?.message?.[0])
          commit(types.GET_ROOM_SELECTED_FAIL, { error })
        })
    })
  },

  getSearchBarSettings() {},

  clearHotelDetail({ commit }) {
    commit(types.CLEAR_HOTEL_DETAIL)
  },

  updateBookingStatus({ commit }, payload) {
    commit(types.UPDATE_BOOKING_STATUS, payload)
  },

  saveRoomWhenHaveNoData({ commit }, payload) {
    commit(types.SAVE_ROOM_WHEN_HAVE_NO_DATA, payload)
  }
}

export default actions

import CustomerUserCase from '../../domain/usecases/customer'
import { HotelActionTypes } from './types'
import { ActionTree } from 'vuex'
import state from './state'
import { IHotelPriceData } from '~/interfaces/hotelListPage'
export type RootState = ReturnType<typeof state>

const actions: ActionTree<RootState, RootState> = {
  getHotelList({ commit }, payload) {
    commit(HotelActionTypes.GET_HOTELS)
    const params = {
      TargetLanguage: payload?.lang,
      KeyWord: '',
      IsClearCache: false,
      Latitude: payload?.lat,
      Longitude: payload?.long
    }

    return new Promise((resolve, reject) => {
      this.$mystaysRepo
        .getHotelsList(params)
        .then(resp => {
          resolve(resp.data?.areas)
          commit(HotelActionTypes.GET_HOTELS_SUCCESS, {
            payload: resp.data?.areas
          })
        })
        .catch(error => {
          reject(error)
          commit(HotelActionTypes.GET_HOTELS_FAIL, {
            error
          })
        })
    })
  },

  filterHotelList({ commit }, payload) {
    commit(HotelActionTypes.FILTER_HOTELS, { payload: payload.searchParam })
  },

  filterHotelListForSearchBox({ commit }, keyword) {
    commit(HotelActionTypes.FILTER_HOTELS_SEARCH_BOX, keyword)
  },

  selectHotel({ commit }, hotel) {
    commit(HotelActionTypes.SELECT_HOTEL, {
      payload: hotel
    })
  },

  selectAllHotels({ commit }, hotels) {
    commit(HotelActionTypes.SELECT_ALL_HOTELS, {
      payload: hotels
    })
  },

  getTiersList({ commit }, hotelId) {
    this.$triplaRepo.hotel
      .getTiersList(hotelId)
      .then(resp => {
        commit(HotelActionTypes.GET_TIERS_LIST_SUCCESS, { payload: resp.data })
      })
      .catch(error => {
        commit(HotelActionTypes.GET_TIERS_LIST_FAIL, { error })
      })
  },
  saveRecentSearch({ commit }, payload) {
    commit(HotelActionTypes.SAVE_RECENT_SEARCH, payload)
  },

  saveModelFilter({ commit }, payload) {
    commit(HotelActionTypes.SAVE_MODEL_FILTER, payload)
  },

  getHotelPrice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(HotelActionTypes.GET_HOTEL_PRICE)
      this.$triplaRepo.hotel
        .getHotelPrices(payload)
        .then(resp => {
          let results: Array<IHotelPriceData> = []

          resp.forEach(pricesList => {
            pricesList.data.forEach((hotel: IHotelPriceData) => {
              results.push(hotel)
            })
          })

          const data = results.map((item, itemIdx: number) => {
            return {
              price: item.lowest_price || 0,
              hotelID: `${item.id}`,
              ...item
            }
          })
          resolve(resp)
          commit(HotelActionTypes.GET_HOTEL_PRICE_SUCCESS, { payload: data })
        })
        .catch(err => {
          reject(err)
          commit(HotelActionTypes.GET_HOTEL_PRICE_FAIL, { payload: err })
        })
    })
  },

  saveSortByValue({ commit }, payload) {
    commit(HotelActionTypes.SAVE_SORT_BY_VALUE, payload)
  },

  savePrefectureValue({ commit }, payload) {
    commit(HotelActionTypes.SAVE_PREFECTURE_VALUE, payload)
  },

  resetFilterModel({ commit }) {
    commit(HotelActionTypes.RESET_FILTER_MODEL)
  },

  saveFullPath({ commit }, payload) {
    commit(HotelActionTypes.SAVE_FULL_PATH, payload)
  },

  saveFullPathHotelDetail({ commit }, payload) {
    commit(HotelActionTypes.SAVE_FULL_PATH_HOTEL_DETAIL, payload)
  },

  clearTiersList({ commit }) {
    commit(HotelActionTypes.CLEAR_TIERS_LIST)
  },

  saveHotelID({ commit }, payload) {
    commit(HotelActionTypes.SAVE_HOTEL_ID, payload)
  },

  saveHotelList({ commit }, payload) {
    commit(HotelActionTypes.SAVE_HOTEL_LIST, payload)
  },

  saveRatingCount({ commit }, payload) {
    commit(HotelActionTypes.SAVE_RATING_COUNT, payload)
  }
}

export default actions

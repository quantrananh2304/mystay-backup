import { MutationTree } from 'vuex'
import { HotelHelper } from './helper'
import { IHotelState } from './state'
import { HotelActionTypes } from './types'

const mutations: MutationTree<IHotelState> = {
  [HotelActionTypes.GET_HOTELS](state) {
    state.isHotelLoading = true
    state.isGetAllHotelLoading = true
  },

  [HotelActionTypes.GET_HOTELS_SUCCESS](state, action) {
    let hotelList = []
    let hotelNearMe = []
    let prefectures = []
    let cityList = []

    const hotelHelper = new HotelHelper(action.payload)

    hotelList = hotelHelper.getHotelList()
    prefectures = hotelHelper.getPrefectures()
    hotelNearMe = hotelHelper.getHotelNearMe()
    cityList = hotelHelper.cityList

    state.data.cityList = cityList
    state.data.districtList = prefectures
    state.data.hotelList = hotelList
    state.data.allHotels = hotelList
    state.data.hotelFilter = hotelList
    state.success = true
    state.data.hotel_nearme = hotelNearMe
    state.actionType = 'LOAD_HOTELS_SUCCESS'

    state.isHotelLoading = false
    state.isGetAllHotelLoading = false
  },

  [HotelActionTypes.GET_HOTELS_FAIL](state, action) {
    state.isHotelLoading = false
    state.isGetAllHotelLoading = false
    state.success = action.payload
  },

  [HotelActionTypes.FILTER_HOTELS](state, action) {
    state.data.filterModel.prefecture = ''

    let filterCityList = []
    let filterPrefectureList = []
    let filterHotelList = []
    state.data.cheapestPrice = 0
    state.data.expensivePrice = 1

    const hotelHelper = new HotelHelper(state.data.cityList)

    const keyword = action.payload?.keyword?.trim() || ''
    filterCityList = hotelHelper.filterCity(keyword)
    filterHotelList = hotelHelper.filterHotel(keyword)
    filterPrefectureList = hotelHelper.filterPrefecture(keyword)

    state.data.citySearch = filterCityList
    state.data.hotelList = filterHotelList
    state.data.districtListFilter = filterPrefectureList

    if (action.payload.isFilter) {
      const hotelPrice = state.data.hotel_price
      const hotelHelper = new HotelHelper([])

      if (hotelPrice.length) {
        state.data.hotelFilterByMapView = hotelHelper.hotelMappingPrice(
          JSON.parse(JSON.stringify(filterHotelList)),
          JSON.parse(JSON.stringify(hotelPrice))
        )

        state.data.hotelFilter = hotelHelper.hotelMappingPrice(
          JSON.parse(JSON.stringify(state.data.hotelFilter)),
          JSON.parse(JSON.stringify(hotelPrice))
        )

        state.data.cheapestPrice = hotelHelper.getMinPrice(
          state.data.hotelFilterByMapView
        )

        state.data.expensivePrice = hotelHelper.getMaxPrice(
          state.data.hotelFilterByMapView
        )
      } else {
        state.data.hotelFilterByMapView = state.data.hotelList
      }
    }

    state.isFetching = true
  },

  [HotelActionTypes.FILTER_HOTELS_SEARCH_BOX](state, action) {
    state.data.filterModel.prefecture = ''

    let filterCityList = []
    let filterPrefectureList = []
    let filterHotelList = []
    state.data.cheapestPrice = 0
    state.data.expensivePrice = 1

    const hotelHelper = new HotelHelper(state.data.cityList)

    const keyword = action.trim() || ''
    filterCityList = hotelHelper.filterCity(keyword)
    filterHotelList = hotelHelper.filterHotel(keyword)
    filterPrefectureList = hotelHelper.filterPrefecture(keyword)

    state.data.citySearch = filterCityList
    state.data.hotelListForSearchBox = filterHotelList
    state.data.districtListFilter = filterPrefectureList
  },

  [HotelActionTypes.SELECT_HOTEL](state) {
    state.isFetching = true
  },
  [HotelActionTypes.SELECT_ALL_HOTELS](state) {
    state.isFetching = true
  },
  [HotelActionTypes.GET_HOTEL_PLANS_SUCCESS](state, action) {
    state.data = action.payload
    state.isFetching = true
    state.success = true
  },
  [HotelActionTypes.GET_HOTEL_PLANS_FAIL](state, action) {
    state.errorMessage = action.payload
    state.isFetching = true
    state.success = false
  },

  [HotelActionTypes.GET_ROOM_TYPES_SUCCESS](state, action) {
    state.data.roomType = action.payload
    state.isFetching = true
    state.success = true
  },
  [HotelActionTypes.GET_ROOM_TYPES_FAIL](state, action) {
    state.errorMessage = action.payload
    state.isFetching = true
    state.success = false
  },

  [HotelActionTypes.SAVE_MODEL_FILTER](state, payload) {
    state.data.filterModel = payload
    state.isHotelLoading = true

    setTimeout(() => {
      state.isHotelLoading = false
    }, 200)
  },

  [HotelActionTypes.SAVE_PREFECTURE_VALUE](state, payload) {
    state.data.filterModel.prefecture = payload
  },

  [HotelActionTypes.SAVE_RECENT_SEARCH](state, recentSearch) {
    state.isFetching = true
    state.success = false
    state.data.recentSearch.push(recentSearch)
  },

  [HotelActionTypes.GET_HOTEL_PRICE](state) {
    state.isPriceLoading = true
    state.data.hotel_price = []
  },

  [HotelActionTypes.GET_HOTEL_PRICE_SUCCESS](state, action) {
    state.data.hotel_price = action.payload || []
    state.isPriceLoading = false
    const hotelFilterByMapView = [...state.data.hotelFilterByMapView]
    const hotelFilter = [...state.data.hotelFilter]
    state.data.cheapestPrice = 0
    state.data.expensivePrice = 1
    const hotelHelper = new HotelHelper([])

    state.data.hotelFilterByMapView = hotelHelper.hotelMappingPrice(
      JSON.parse(JSON.stringify(hotelFilterByMapView)),
      JSON.parse(JSON.stringify(action.payload))
    )

    state.data.hotelFilter = hotelHelper.hotelMappingPrice(
      JSON.parse(JSON.stringify(hotelFilter)),
      JSON.parse(JSON.stringify(action.payload))
    )

    state.data.cheapestPrice = hotelHelper.getMinPrice(
      state.data.hotelFilterByMapView
    )

    state.data.expensivePrice = hotelHelper.getMaxPrice(
      state.data.hotelFilterByMapView
    )
  },

  [HotelActionTypes.GET_HOTEL_PRICE_FAIL](state, action) {
    state.errorMessage = action.payload
    state.isPriceLoading = false
  },

  [HotelActionTypes.SAVE_SORT_BY_VALUE](state, payload) {
    state.data.filterModel.sortBy = payload
    state.isHotelLoading = true

    setTimeout(() => {
      state.isHotelLoading = false
    }, 300)
  },

  [HotelActionTypes.RESET_FILTER_MODEL](state) {
    state.data.filterModel = {
      sortBy: 'lowestToHighest',
      tripTypeList: [],
      popularFilterList: [],
      price: {}
    }
  },

  [HotelActionTypes.SAVE_FULL_PATH](state, payload) {
    state.data.fullPath = payload
  },

  [HotelActionTypes.SAVE_FULL_PATH_HOTEL_DETAIL](state, payload) {
    state.data.fullPathHotelDetail = payload.fullPath
    state.data.hotelID = payload.hotelID
  },

  [HotelActionTypes.GET_TIERS_LIST_SUCCESS](state, action) {
    state.data.tiers = action.payload
    state.data.tiersSettings = action.payload
  },

  [HotelActionTypes.GET_TIERS_LIST_FAIL](state, action) {
    state.data.tiers = action.payload
    state.data.tiersSettings = action.payload
  },

  [HotelActionTypes.CLEAR_TIERS_LIST](state) {
    state.data.tiers = {}
  },

  [HotelActionTypes.SAVE_HOTEL_ID](state, hotelID) {
    state.data.hotelID = hotelID
  },

  [HotelActionTypes.SAVE_HOTEL_LIST](state, payload) {
    const hotelPrice = state.data.hotel_price
    const hotelHelper = new HotelHelper([])
    state.data.cheapestPrice = 0
    state.data.expensivePrice = 1
    state.data.hotelFilterByMapView = hotelHelper.hotelMappingPrice(
      JSON.parse(JSON.stringify(payload)),
      JSON.parse(JSON.stringify(hotelPrice))
    )

    state.data.cheapestPrice = hotelHelper.getMinPrice(
      state.data.hotelFilterByMapView
    )

    state.data.expensivePrice = hotelHelper.getMaxPrice(
      state.data.hotelFilterByMapView
    )
  }
}

export default mutations

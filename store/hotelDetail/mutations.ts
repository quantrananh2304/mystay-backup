import { MutationTree } from 'vuex'
import { HotelDetailState } from './state'
import * as fromTypes from './types'
import { IHotelDetail } from '@/interfaces/hotelDetail'
import {
  HotelDetailDefaultValue,
  HotelDetailV2DefaultValue
} from './default-value'

const mutations: MutationTree<HotelDetailState> = {
  [fromTypes.CHANGE_TAB](state, payload) {
    state.currentTab = payload.currentTab
    state.currentId = payload.currentId
  },

  [fromTypes.toggleSidebar](state, payload) {
    state.isOpen = payload
  },

  [fromTypes.zoomSlideFullScreen](state) {
    state.isZoomSlide = !state.isZoomSlide
  },

  [fromTypes.saveRoomInfo](state, payload) {
    state.selectedRoom = payload
  },

  [fromTypes.deleteRoomDeatailsSummary](state) {
    state.selectedRoom.pop()
  },

  [fromTypes.GET_DATA_FROM_URL](state) {
    // state.planList = {}
    // state.roomList = {}
  },
  [fromTypes.SEARCH_ROOM](state, _action) {
    state.isRoomLoading = true
    state.isPlanLoading = true
    state.roomList = {
      rooms: [],
      search_params: {
        checkin_date: '',
        checkout_date: '',
        hotel_plans: [],
        room_types: ''
      }
    }
    state.planList = {
      plans: [],
      search_params: {
        checkin_date: '',
        checkout_date: '',
        hotel_plans: [],
        room_types: ''
      }
    }
  },
  [fromTypes.SEARCH_ROOM_SUCCESS](state, action) {
    state.roomList = action.payload
    state.isRoomLoading = false
    state.roomFilterModel = {
      status: false,
      priceRange: [0, 100],
      planType: [],
      mealType: [],
      roomType: [],
      tripType: []
    }
  },
  [fromTypes.SEARCH_PLAN_SUCCESS](state, action) {
    state.planList = action.payload
    state.isFetching = false
    state.isPlanLoading = false
    state.roomFilterModel = {
      status: false,
      priceRange: [0, 100],
      planType: [],
      mealType: [],
      roomType: [],
      tripType: []
    }
  },
  [fromTypes.SEARCH_ROOM_FAIL](state, action) {
    state.isFetching = false
    state.isRoomLoading = false
    state.isPlanLoading = false
  },

  [fromTypes.GET_HOTEL_SETTINGS](state, action) {},

  [fromTypes.GET_HOTEL_SETTINGS_SUCCESS](state, hotelSettings) {
    state.hotelSettings = hotelSettings
  },

  [fromTypes.GET_HOTEL_SETTINGS_FAIL](state, action) {
    state.hotelSettings = {}
  },

  [fromTypes.GET_HOTEL_DETAIL](state) {
    state.isHotelDetailLoading = true
    state.isRoomLoading = true
    state.hotelDetail = HotelDetailDefaultValue
  },

  [fromTypes.GET_HOTEL_DETAIL_SUCCESS](state, payload: IHotelDetail) {
    state.hotelDetail = payload
    state.isHotelDetailLoading = false
  },

  [fromTypes.GET_HOTEL_DETAIL_FAIL](state, error) {
    state.hotelDetail = error
    state.isFetching = false
    state.isHotelDetailLoading = false
  },

  [fromTypes.GET_HOTEL_DETAIL_V2](state, action) {
    state.isHotelDetailV2Loading = true
    state.hotelDetailV2 = HotelDetailV2DefaultValue
  },

  [fromTypes.GET_HOTEL_DETAIL_V2_SUCCESS](state, action) {
    state.hotelDetailV2 = action.payload
    state.isHotelDetailV2Loading = false
  },

  [fromTypes.GET_HOTEL_DETAIL_V2_FAIL](state, action) {
    state.isHotelDetailV2Loading = false
  },

  [fromTypes.SAVE_ROOM_FILTER](state, payload) {
    state.roomFilterModel = payload
    // state.isPlanLoading = true
    // state.isRoomLoading = true

    // setTimeout(() => {
    //   state.isPlanLoading = false
    //   state.isRoomLoading = false
    // }, 300)
  },

  [fromTypes.SAVE_ROOM_INDEX](state, payload) {
    state.roomIndex = payload
  },

  [fromTypes.CLEAR_ROOM_SELECTED](state) {
    state.selectedRoom = []
    state.roomFilterModel = {
      status: false,
      priceRange: [0, 100],
      planType: [],
      mealType: [],
      roomType: [],
      tripType: []
    }
  },

  [fromTypes.SAVE_FILTER_ROOM_BY](state, payload) {
    state.sortBy = payload

    // state.isPlanLoading = true;
    // state.isRoomLoading = true;

    // setTimeout(() => {
    //   state.isPlanLoading = false;
    //   state.isRoomLoading = false;
    // }, 300);
  },

  [fromTypes.SAVE_ROOM_PLAN_CODE](state, payload) {
    state.roomPlanCode = payload
  },

  [fromTypes.GET_CANCELLATION_POLICIES](state) {
    state.isLoading = true
    state.cancellationPolicies = []
  },

  [fromTypes.GET_CANCELLATION_POLICIES_SUCCESS](state, action) {
    state.cancellationPolicies = []
    state.cancellationPolicies = action.payload.data
    state.isLoading = false
  },

  [fromTypes.GET_CANCELLATION_POLICIES_FAIL](state, action) {
    state.cancellationPolicies = action.payload
    state.isLoading = false
  },

  [fromTypes.GET_HOTEL_REVIEWS_SUCCESS](state, action) {
    state.hotelReviews = action.payload
  },

  [fromTypes.GET_HOTEL_REVIEWS_FAIL](state, action) {
    state.hotelReviews = action.payload
  },

  [fromTypes.GET_ROOM_SELECTED](state) {
    state.isRoomSelectedLoading = true
    state.alertModel = null
    // state.roomSelectedFromAPI = {}
  },

  [fromTypes.GET_ROOM_SELECTED_SUCCESS](state, action) {
    state.isRoomSelectedLoading = false
    state.roomSelectedFromAPI = action.payload
    state.alertModel = null
  },

  [fromTypes.GET_ROOM_SELECTED_FAIL](state, action) {
    state.isRoomSelectedLoading = false
    state.alertModel = {
      status: action.error.code,
      text: action.error?.message?.[0]?.title
    }
  },

  [fromTypes.CLEAR_HOTEL_DETAIL](state) {
    state.hotelDetail = HotelDetailDefaultValue
    state.planList = {
      plans: [],
      search_params: {
        checkin_date: '',
        checkout_date: '',
        hotel_plans: [],
        room_types: ''
      }
    }
    state.roomList = {
      rooms: [],
      search_params: {
        checkin_date: '',
        checkout_date: '',
        hotel_plans: [],
        room_types: ''
      }
    }
    state.hotelReviews = []
  },

  [fromTypes.UPDATE_BOOKING_STATUS](state, payload) {
    state.isUpdateBooking = payload
  },

  [fromTypes.SAVE_ROOM_WHEN_HAVE_NO_DATA](state, payload) {
    state.roomDataDefault = payload
  }
}

export default mutations

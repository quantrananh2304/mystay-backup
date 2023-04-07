import {
  IHotelReview,
  IPlansListWithParams,
  IRoomsListData
} from './../../interfaces/hotelDetail'
import createLogger from 'vuex/dist/logger'
import { IHotelDetail, IHotelDetailV2Data } from '~/interfaces/hotelDetail'
import {
  HotelDetailDefaultValue,
  HotelDetailV2DefaultValue
} from './default-value'

export const filterType = {
  filterByRoom: 'room',
  filterByPlan: 'plan'
}

export const strict = false
const debug = process.env.NODE_ENV !== 'production'
export const plugins = debug ? [createLogger({})] : []
export const namespaced = true

export interface HotelDetailState {
  isOpen: boolean
  isZoomSlide: boolean
  selectedRoom: Array<any>
  tax: Object
  checkInOverview: Object
  planList: IPlansListWithParams
  roomList: IRoomsListData
  isFetching: boolean
  hotelDetail: IHotelDetail
  hotelReviews: Array<IHotelReview>
  roomFilterModel: object
  roomIndex: number
  sortBy: string
  roomPlanCode: object
  cancellationPolicies: Array<string[]>
  isLoading: boolean
  isRoomLoading: boolean
  isPlanLoading: boolean
  isHotelDetailLoading: boolean
  isUpdateBooking: boolean
  roomSelectedFromAPI: object
  isRoomSelectedLoading: boolean
  isAvailable: boolean
  alertModel: object | null
  currentTab: string
  currentId: string
  hotelDetailV2: IHotelDetailV2Data
  isHotelDetailV2Loading: boolean
  roomDataDefault: object | null
  hotelSettings: object | null
}

const State: HotelDetailState = {
  currentTab: filterType.filterByRoom,
  currentId: '',
  isOpen: false,
  isZoomSlide: false,
  selectedRoom: [],
  tax: {
    title: '',
    totalPrice: '¥16,650',
    detail: [
      {
        time: 'Tax',
        price: '¥16,650'
      },
      {
        time: 'Hotel Fees',
        price: '¥16,650'
      },
      {
        time: 'Onsen Fees',
        price: '¥16,650'
      }
    ]
  },
  checkInOverview: [],
  planList: {
    plans: [],
    search_params: {
      checkin_date: '',
      checkout_date: '',
      hotel_plans: [],
      room_types: ''
    }
  },
  roomList: {
    rooms: [],
    search_params: {
      checkin_date: '',
      checkout_date: '',
      hotel_plans: [],
      room_types: ''
    }
  },
  isFetching: false,
  hotelDetail: HotelDetailDefaultValue,
  hotelDetailV2: HotelDetailV2DefaultValue,
  hotelReviews: [],
  roomFilterModel: {
    status: false,
    priceRange: [0, 100],
    planType: [],
    mealType: [],
    roomType: [],
    tripType: []
  },
  roomIndex: 0,
  sortBy: 'price_low_to_high',
  roomPlanCode: {
    roomCode: '',
    planCode: ''
  },
  cancellationPolicies: [],
  isLoading: false,
  isRoomLoading: false,
  isPlanLoading: false,
  isHotelDetailLoading: false,
  isUpdateBooking: false,
  roomSelectedFromAPI: {},
  isRoomSelectedLoading: false,
  isHotelDetailV2Loading: false,
  isAvailable: true,
  alertModel: {
    status: false,
    text: ''
  },
  roomDataDefault: null,
  hotelSettings: {}
}

export default State

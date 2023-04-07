export enum BookingActionTypes {
  SHOW_LOCATION = '[Booking] SHOW_LOCATION',

  SHOW_CHECKING = '[Booking] SHOW_CHECKING',

  SHOW_ROOM_SELECT = '[Booking] SHOW_ROOM_SELECT',

  SHOW_NIGHT_SELECT = '[Booking] SHOW_NIGHT_SELECT',

  SHOW_PROMO_CODE = '[Booking] SHOW_PROMO_CODE',

  SEARCH_ROOM = '[Booking] SEARCH_ROOM',

  SEARCH_ROOM_SUCCESS = '[Booking] SEARCH_ROOM_SUCCESS',

  SEARCH_ROOM_FAIL = '[Booking] SEARCH_ROOM_FAIL',

  SHOW_TOTAL_GUEST = '[Booking] SHOW_TOTAL_GUEST',

  CLOSE_ALL = '[Booking] CLOSE_ALL',

  GET_LOCATION = '[Booking] GET_LOCATION',

  GET_CHECKIN = '[Booking] GET_CHECKIN',

  GET_CHECKOUT = '[Booking] GET_CHECKOUT',

  GET_PROMO_CODE = '[Booking] GET_PROMO_CODE',

  GET_DATA_FROM_URL = '[Booking] GET_DATA_FROM_URL',

  SET_SEARCH_KEYWORD = '[Booking] SET_SEARCH_KEYWORD',

  GET_ERROR = '[Booking] GET_ERROR',

  GET_BOOKING_ID = '[Booking] GET_BOOKING_ID',

  CHECK_PROMO_CODE = '[Booking] CHECK_PROMO_CODE',
  CHECK_PROMO_CODE_SUCCESS = '[Booking] CHECK_PROMO_CODE_SUCCESS',
  CHECK_PROMO_CODE_FAIL = '[Booking] CHECK_PROMO_CODE_FAIL',

  SET_INITIAL_BOOKING = '[Booking] SET_INITIAL_BOOKING',
  GET_INITIAL_BOOKING = '[Booking] GET_INITIAL_BOOKING',

  SET_SEARCH_TYPE = '[Booking] SET_SEARCH_TYPE',

  SAVE_ROOM_INDEX = '[Booking] SAVE_ROOM_INDEX',

  CREATE_RESERVATIONS = '[Booking] CREATE_RESERVATIONS',
  CREATE_RESERVATIONS_SUCCESS = '[Booking] CREATE_RESERVATIONS_SUCCESS',
  CREATE_RESERVATIONS_FAIL = '[Booking] CREATE_RESERVATIONS_FAIL',

  SAVE_ROOM_LIST = '[Booking] SAVE_ROOM_LIST',

  ADD_ROOM = '[Booking] ADD_ROOM',

  DELETE_ROOM = '[Booking] DELETE_ROOM',

  ON_CHANGE_CHILD = '[Booking] ON_CHANGE_CHILD',

  ON_CHANGE_PERSON = '[Booking] ON_CHANGE_PERSON',

  ON_CHANGE_CHILD_AGE = '[Booking] ON_CHANGE_CHILD_AGE',

  ON_CHANGE_BED_SELECT = '[Booking] ON_CHANGE_BED_SELECT',

  CANCEL_RESERVATIONS = '[Booking] CANCEL_RESERVATIONS',
  CANCEL_RESERVATIONS_SUCCESS = '[Booking] CANCEL_RESERVATIONS_SUCCESS',
  CANCEL_RESERVATIONS_FAIL = '[Booking] CANCEL_RESERVATIONS_FAIL',

  UPDATE_RESERVATIONS = '[Booking] UPDATE_RESERVATIONS',
  UPDATE_RESERVATIONS_SUCCESS = '[Booking] UPDATE_RESERVATIONS_SUCCESS',
  UPDATE_RESERVATIONS_FAIL = '[Booking] UPDATE_RESERVATIONS_FAIL',

  GET_RESERVATIONS = '[Booking] GET_RESERVATIONS',
  GET_RESERVATIONS_SUCCESS = '[Booking] GET_RESERVATIONS_SUCCESS',
  GET_RESERVATIONS_FAIL = '[Booking] GET_RESERVATIONS_FAIL',

  UPDATE_GUEST_DETAIL = '[Booking] UPDATE_GUEST_DETAIL',
  UPDATE_GUEST_DETAIL_SUCCESS = '[Booking] UPDATE_GUEST_DETAIL_SUCCESS',
  UPDATE_GUEST_DETAIL_FAIL = '[Booking] UPDATE_GUEST_DETAIL_FAIL',

  GET_SETTING_RESERVATIONS = '[Booking] GET_SETTING_RESERVATIONS',
  GET_SETTING_RESERVATIONS_SUCCESS = '[Booking] GET_SETTING_RESERVATIONS_SUCCESS',
  GET_SETTING_RESERVATIONS_FAIL = '[Booking] GET_SETTING_RESERVATIONS_FAIL',

  SAVE_URL_PARAMS_RESERVATIONS = '[Booking] SAVE_URL_PARAMS_RESERVATIONS',
  SET_BOOKING_FROM_API = '[Booking] SET_BOOKING_FROM_API',
  SET_CALENDAR = '[Booking] SET_CALENDAR',

  UPDATE_BOOKING_GTM = '[Booking] UPDATE_BOOKING_GTM',
  SAVE_HOTEL_ID = '[Booking] SAVE_HOTEL_ID',

  SAVE_ROOM_PARAMS_FOR_GET_ROOM_SELECTED = '[Booking] SAVE_ROOM_PARAMS_FOR_GET_ROOM_SELECTED',
  DEL_ROOM_PARAMS_FOR_GET_ROOM_SELECTED = '[Booking] DEL_ROOM_PARAMS_FOR_GET_ROOM_SELECTED',

  SAVE_USE_DAY_PARAMS_FROM_BOOKING = '[Booking] SAVE_USE_DAY_PARAMS_FROM_BOOKING',
  SAVE_IS_ROOM_AVAILABLE = '[Booking] SAVE_IS_ROOM_AVAILABLE',
  SAVE_CURRENT_TAB = '[Booking] SAVE_CURRENT_TAB',
  SAVE_IS_UNDATED = '[Booking] SAVE_IS_UNDATED',

  APPLY_COUPON_CODE_GTM = '[Booking] APPLY_COUPON_CODE_GTM',

  SAVE_SEARCH_DATA = '[Booking] SAVE_SEARCH_DATA',

  CANCEL_BOOKING_GTM = '[Booking] CANCEL_BOOKING_GTM',

  DELETE_ROOM_TYPE_CODE = '[Booking] DELETE_ROOM_TYPE_CODE',

  RESET_ROOM_TYPE_CODE = '[Booking] RESET_ROOM_TYPE_CODE',

  RESET_HOTEL_ID = '[Booking] RESET_HOTEL_ID',

  SET_TOTAL_NIGHT = '[Booking] SET_TOTAL_NIGHT',

  SET_QUERY_SEARCH_TYPE = '[Booking] SET_QUERY_SEARCH_TYPE'
}

export interface IChildrenAge {
  value: string
  title: string
  age: number
}

export interface IChildren {
  title: string
  childrenList: IChildrenAge[]
}

export interface IAdults {
  title: string
  number: number
}

export interface IRoomModel {
  id: string
  adults: IAdults
  children: IChildren
}

export interface IPersonChange {
  person: IPersonChangeData
  roomIndx: number
}

export interface IPersonChangeData {
  isMinus: boolean
  data: IAdults
}

export interface IChangeChildAge {
  data: IChangeChildAgeData
  roomIdx: number
}

export interface IChangeChildAgeData {
  index: number
  age: number
}

export interface IChangeChild {
  child: IChangeChildData
  roomIndx: number
}

export interface IChangeChildData {
  data: IAdults
  isMinus: boolean
}

export interface IRoomState {
  id: string
  adults: {
    title: string
    number: number
  }
  children: {
    title: string
    childrenList: Array<any>
  }
}

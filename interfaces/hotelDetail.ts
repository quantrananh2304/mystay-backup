// Hotel detail v1

import { IHotelPhoto, IHotelSearchParams } from './hotelListPage'

export interface IHotelDetail {
  data: IHotelDetailData
}

interface IHotelDetailData {
  address: IHotelDetailAddress
  amenities: IHotelDetailAmenity[]
  area: IHotelDetailArea
  site_controller_config: IHotelDetailSiteConfig
  id: number
  is_booking_widget_active: boolean
  is_demo: boolean
  latitude: string
  longitude: string
  name: string
  triplabot_code: string
}

interface IHotelDetailAddress {
  full_address: string
  city: string
  state: string
  post_code: string
  country: string
  country_code: string
  address_line_1: string
  address_line_2: string
  address_line_3: string
}

export interface IHotelDetailAmenity {
  id: number
  name: string
  is_active: boolean
}

interface IHotelDetailArea {
  id: number
  name: string
}

interface IHotelDetailSiteConfig {
  released: boolean
}

// Hotel detail v2
export interface IHotelDetailV2 {
  data: IHotelDetailV2Data
}

export interface IHotelDetailV2Data {
  id: string
  images: string[]
  overview: string
  checkin: string
  checkout: string
  location: string
  email: string
  phone: string
  transportations: IHotelDetailV2Transportations[]
  amenityTags: Array<any>
  travelGoalTags: Array<any>
  undatedSearch: boolean
}

export interface IHotelDetailV2Transportations {
  type: string
  text: string
}

// Hotel review
export interface IHotelReview {
  data: Array<IHotelReviewItem>
}

export interface IHotelReviewItem {
  comment: string
  createdDate: string
  rating: number
  reviewId: string
  updatedDate: string
}

// Rooms list

export interface IRoomsList {
  data: IRoomsListData
}

export interface IRoomsListData {
  rooms: IRoomsListItem[]
  search_params: IRoomsListSearchParams
}

export interface IRoomsListItem {
  min_price: number
  room_count: number
  room_pictures: IRoomsListPhoto[]
  room_plan: IRoomPlan[]
  room_type_name: string
  room_type_code: string
  room_type_description: string
  min_people: number
  max_people: number
  max_adult: number
  hide_smoking: boolean
  room_facilities: []
  position: number
  filters: IRoomsListFilter[]
  beds: []
  floor_data: unknown
  room_size: {
    value: number
    unit: string
  }
  bathroom: boolean
  toilet: boolean
  is_smoking: boolean
}

export interface IRoomsListPhoto {
  id: number
  display_name: string
  picture: {
    url: string
    chatbot_header: {
      url: string
    }
    thumbnail: {
      url: string
    }
    wordpress: {
      url: string
    }
    wordpress_thumb: {
      url: string
    }
  }
}

export interface IRoomsListFilter {
  id: number
  name: string
  filter_type: string
  order: number
}

export interface IRoomsListSearchParams {
  checkin_date: string
  checkout_date: string
  hotel_plans: unknown
  room_types: unknown
}

export interface IRoomPlan {
  availability: string
  booking_start_date: string
  hotel_plan_code: string
  position: number
  limited: boolean
  hotel_plan_description: string
  total_price: number
  charge_percent: number
  tax: number
  room_rate: IRoomRate[]
  url_plan_pictures: string[]
  sleeps: number
  selected_room_count: number
  cancellation_policy_link: string
  filters: IRoomsListFilter[]
  matched_search_criteria: {
    adults_count: number
    children_count: number
    adults_with_companion: number
    adult_companion: number
    children_with_kid_tier_A_companion: number
    kid_tier_A_companion: number
  }
  cancellation_free_deadline: string
  is_no_refund: boolean
  meal_status: string
  payment_method: IPaymentMethod[]
  room_plan_code: string
  room_plan_name: string
  wifi_option: string
  non_sign_in_discount: IDiscount
  sign_in_discount: IDiscount
}

interface IPaymentMethod {
  code: string
  name: string
}

interface IRoomRate {
  date: string
  rate: number
}

interface IDiscount {
  total_price_after_discount: number
  total_price_after_discount_tax: number
  applied_scrape_id: unknown
  brr_prices: Array<unknown>
  promotions: IPromotion[]
}

interface IPromotion {
  id: number
  name: string
  promotion_type: string
  coupon_code: string
  sale_start_date: string
  sale_end_date: string
  excluding_start_date: string
  excluding_end_date: string
  discount_amount: number
}

// Plans List

export interface IPlansList {
  data: IPlansListWithParams
}

export interface IPlansListWithParams {
  plans: IPlansListData[]
  search_params: IRoomsListSearchParams
}

export interface IPlansListData {
  description: string
  url_plan_pictures: string[]
  plan_pictures: IRoomsListPhoto
  meal_status: string
  payment_method: IPaymentMethod[]
  filters: IRoomsListFilter[]
  rooms: []
  id: number
  code: string
  name: string
  start_date: string
  end_date: string
  active: boolean
  meals: Array<unknown>
  check_in_range: string
  check_out_time: string
  cancel_policy: string
  charge_type: number
  rate_types: string[]
  wifi: string
  on_site_payment: boolean
  credit_card_payment: boolean
  hotel_kids_rate_profile_id: number
  cancellation_policy_id: number
  is_refundable: boolean
  booking_deadline_day: number
  booking_deadline_time: string
  checkin_time_start: string
  checkin_time_end: string
  checkout_time: string
  sales_region: string
  min_stay: number
  max_stay: number
  min_guest: number
  max_guest: number
  position: number
  is_day_use: boolean
  mode: string
  target_guest: boolean
  target_type: string
  posting_start_date: string
  posting_end_date: string
  deferred_payment: boolean
  booking_start_date: string
  charge_percent: number
}

export interface IRoomsInPlan {}

// GET Room & Plan payload

export interface IGetRoomPayload {
  queryString: {
    checkin_date: string
    checkout_date: string
    type: string
    rooms: Array<any>
    coupon_code: string
    order: string
    bookable: string
    is_including_occupied?: boolean
    is_day_use?: boolean
    room_type_codes?: boolean
    room_plan_codes?: boolean
    room_search_filters: string[]
  }
  hotel_id: number | string
  type: string
}

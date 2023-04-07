export interface IHotelPrice {
  data: IHotelPriceData[]
  page: number
  total_entries: number
  total_pages: number
}

export interface IHotelPriceData {
  id: number
  name: string
  tel: string
  latitude: string
  longitude: string
  triplabot_code: string
  is_demo: boolean
  triplabot_url: string
  is_booking_widget_active: boolean
  area: null
  lowest_price: number | null
  address: IHotelAddress
  hotel_photos: IHotelPhoto[]
  kids_setting: {
    kids_type: string
  }
  search_params: {
    rooms: IHotelSearchParams[]
  }
  hotelID?: number
}

export interface IHotelAddress {
  full_address: string
  city: string
  state: string
  post_code: string
  country: string
  country_code: string
}

export interface IHotelPhoto {
  id: number
  fullSize: string
  thumbnail: string
}

export interface IHotelSearchParams {
  checkin_date: string
  checkout_date: string
  adults: number
  children: number
  kids_age_range: []
}

export interface IHotelPriceItem {
  hotelID: string | number
  id: number
  price: number
}

// Get Price payload

export interface IGetPricePayload {
  rooms: Array<any>
  is_including_max_of_lowest_price_next_30_days: boolean
  is_including_lowest_price: boolean
  page: number
  per_page: number
  hotel_codes: number[] | string[]
  coupon_code?: string
}

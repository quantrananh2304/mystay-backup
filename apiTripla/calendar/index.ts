import { NuxtAxiosInstance } from '@nuxtjs/axios'
import moment from 'moment'

export interface IGetAvailability {
  cache?: boolean
  start_date?: string
  end_date?: string
  room_plan_code?: string
  adults?: number
  nights?: number
  children?: number
  transform_kids_params?: boolean
  hotelID: number
}

export default ($triplaApi: NuxtAxiosInstance) => ({
  getAvailabilityForSingleHotel: (
    payload: IGetAvailability = {
      cache: false,
      hotelID: 0,
      transform_kids_params: false
    }
  ) => {
    const { hotelID, ...params } = payload
    const api = $triplaApi.get(`/hotels/${hotelID}/rooms/availability`, {
      params
    })

    return api
  },

  getCalendarForSingleHotel: (payload?: any) => {
    const {
      year,
      month,
      adults,
      children,
      nights,
      hotelID,
      room_plan_code,
      rooms,
      isRoom = false
    } = payload

    const result = []

    for (let item = 0; item < 2; item++) {
      if (month < 12) {
        const checkin_date = moment(
          new Date(year, month + item, 1),
          'YYYY-MM-DD'
        )
          .format('YYYY-MM-DD')
          .toString()
        const checkout_date = moment(
          new Date(year, month + item + 1, 0),
          'YYYY-MM-DD'
        )
          .format('YYYY-MM-DD')
          .toString()

        const year_month = moment(new Date(checkin_date), 'YYYY/MM')
          .format('YYYY/MM')
          .toString()

        const params = {
          checkin_date,
          checkout_date,
          adults,
          children,
          nights
        }

        const paramsForRoom = {
          cache: true,
          start_date: checkin_date,
          end_date: checkout_date,
          nights,
          room_plan_code,
          year_month,
          rooms
        }

        const api = $triplaApi.get(`/hotels/${hotelID}/rooms/inventory`, {
          params: isRoom
            ? {
                q: paramsForRoom
              }
            : params
        })
        result.push(api)
      } else {
        const checkin_date = new Date(year + 1, month + item, 1)
        const checkout_date = new Date(year, month + item + 1, 0)

        const params = {
          checkin_date,
          checkout_date,
          adults,
          children,
          nights
        }

        const year_month = moment(new Date(checkin_date), 'YYYY/MM')
          .format('YYYY/MM')
          .toString()

        const paramsForRoom = {
          cache: true,
          start_date: checkin_date,
          end_date: checkout_date,
          nights,
          room_plan_code,
          year_month,
          rooms
        }

        const api = $triplaApi.get(`/hotels/${hotelID}/rooms/inventory`, {
          params: isRoom
            ? {
                q: paramsForRoom
              }
            : params
        })
        result.push(api)
      }
    }

    return result
  },

  getCalendarForMultipleHotel: (payload?: any) => {
    const {
      year,
      month,
      adults,
      children,
      nights,
      brandId,
      hotel_ids,
      year_month
    } = payload
    const result = []

    for (let item = 0; item < 2; item++) {
      if (month < 12) {
        const year_month = moment(new Date(year, month + item, 1), 'YYYY/MM')
          .format('YYYY/MM')
          .toString()

        const params = {
          year_month,
          adults,
          children,
          nights,
          hotel_ids
        }
        const api = $triplaApi.get(`/hotel_brands/${brandId}/inventory`, {
          params
        })
        result.push(api)
      } else {
        const year_month = moment(
          new Date(year + 1, month + item, 1),
          'YYYY/MM'
        )
          .format('YYYY/MM')
          .toString()

        const params = {
          year_month,
          adults,
          children,
          nights,
          hotel_ids
        }
        const api = $triplaApi.get(`/hotel_brands/${brandId}/inventory`, {
          params
        })
        result.push(api)
      }
    }
    return result
  }
})

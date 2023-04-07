import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { IGetRoomPayload } from '~/interfaces/hotelDetail'

export default ($triplaApi: NuxtAxiosInstance) => ({
  getRoomsAndPlans: (payload: any) => {
    return $triplaApi.get(
      `/hotels/${payload.hotel_id}/rooms?q=${JSON.stringify(
        payload.queryString
      )}&type=${payload.type}`
    )
  },

  getRooms: (payload: IGetRoomPayload) => {
    return $triplaApi.get(
      `/hotels/${payload.hotel_id}/rooms?q=${JSON.stringify(
        payload.queryString
      )}&type=${payload.type}`
    )
  },

  getPlans: (payload: IGetRoomPayload) => {
    return $triplaApi.get(
      `/hotels/${payload.hotel_id}/rooms?q=${JSON.stringify(
        payload.queryString
      )}&type=${payload.type}`
    )
  },

  getHotelDetail: (payload: any) => {
    return $triplaApi.get(`/hotels/${payload.hotelID}`)
  },

  getCancellationPolicies(payload: any) {
    return $triplaApi.get(
      `/hotels/${payload.hotelID}/cancellation_policies?q=${JSON.stringify(
        payload.queryString
      )}`
    )
  },

  getRoomSelected(payload: any) {
    return $triplaApi.get(
      `/hotels/${payload.hotelID}/rooms/price?q=${JSON.stringify(
        payload.queryString
      )}`
    )
  },

  getInventoryForMonth(hotelId: string | number, q: object | any) {
    return $triplaApi.get(
      `/hotels/${hotelId}/rooms/inventory?q=${JSON.stringify(q)}`
    )
  },

  getHotelSettings(hotel_code: number | string) {
    return $triplaApi.get(`/hotels/${hotel_code}/settings/booking_widget`)
  }
})

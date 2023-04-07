import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { IGetPricePayload } from '~/interfaces/hotelListPage'

export default ($triplaApi: NuxtAxiosInstance, env: any) => ({
  getTiersList: (hotelId: number) => {
    return $triplaApi.get(`/hotels/${hotelId}/tiers`)
  },

  getHotelPrices: (payload: IGetPricePayload) => {
    const {
      rooms,
      page,
      hotel_codes,
      per_page,
      is_including_lowest_price,
      is_including_max_of_lowest_price_next_30_days
    } = payload

    const totalRequest = Math.ceil(hotel_codes.length / per_page)

    const params = {
      is_including_lowest_price,
      is_including_max_of_lowest_price_next_30_days,
      q: {
        page,
        per_page,
        rooms,
        hotel_codes
      }
    }

    let request = []
    for (let index = 0; index < totalRequest; index++) {
      params.q.page = index + 1
      request.push(
        $triplaApi.get(`/hotel_brands/${env.BRAND_ID}/hotels`, { params })
      )
    }

    return Promise.all(request)
  },

  termsAndCondition(hotel_code: number | string) {
    return $triplaApi.get(`hotels/${hotel_code}/settings/terms_and_conditions`)
  },

  searchBarSettings(hotel_code: number | string) {
    return $triplaApi.get(`hotels/${hotel_code}/settings/search_bar`)
  }
})

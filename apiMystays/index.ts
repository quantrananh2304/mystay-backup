import { NuxtAxiosInstance } from '@nuxtjs/axios'
import fetchWithCache from '../shared/helper/fetchWithCache'

export default ($mystaysApi: NuxtAxiosInstance) => ({
  getHotelsList: (payload: any) => {
    return fetchWithCache('_hotels_list', payload, '1d', () =>
      $mystaysApi.post('/MystaysTriplaGetHotelsAndAreasV2', payload)
    )
  },

  getHotelDetailV2: (payload: any) => {
    return $mystaysApi.post('/MystaysTriplaGetHotelDetail', payload)
  },
  getHotelReviews: (payload: any) => {
    return $mystaysApi.post('/MystaysTriplaGetHotelReviews', payload)
  },

  getLocale(payload: any) {
    return fetchWithCache('_dictionaries', payload, '30m', () =>
      $mystaysApi.post('/MystaysTriplaGetDictionaries', payload)
    )
  },

  getLocation(payload: any) {
    return fetchWithCache('_location', payload, '2m', () =>
      $mystaysApi.get('/MystaysTriplaGetCurrentUserLocation', payload)
    )
  }
})

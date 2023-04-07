import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
import { Plugin } from '@nuxt/types'
import { convertTime } from '@/shared/helper/fetchWithCache'

const ls = new SecureLS({
  isCompression: false
})

const persisedState: Plugin = ({ store }) => {
  const expiredStorage = Number(localStorage.getItem('_expired'))
  const currentTime = new Date().getTime()

  const currentVersion = localStorage.getItem('_version')
  const version = '1.0.6' // change version to clear local storeage // last change: 09/09/2021

  if (currentVersion && currentVersion !== version) {
    localStorage.clear()
    localStorage.setItem('_version', version)
  } else {
    localStorage.setItem('_version', version)
  }

  if (expiredStorage && expiredStorage < currentTime) {
    localStorage.clear()
  } else {
    const weekTime = convertTime('7d') // 7 days
    localStorage.setItem('_expired', String(currentTime + weekTime))
  }

  createPersistedState({
    key: '_my_stays',
    paths: [
      'hotelDetail.selectedRoom',
      'hotelDetail.roomFilterModel',
      'hotelDetail.sortBy',
      'hotelDetail.isUpdateBooking',
      'hotelDetail.is_day_use',
      'hotelDetail.isAvailable',
      'hotelDetail.roomList',
      'hotelDetail.planList',
      'hotelDetail.hotelDetail',
      'hotelDetail.hotelDetailV2',
      'hotelDetail.roomSelectedFromAPI',
      'hotel.data.fullPath',
      'hotel.data.fullPathHotelDetail',
      'hotel.data.hotelID',
      'hotel.data.tiers',
      'hotel.data.citySearch',
      'hotel.data.recentSearch',
      'booking.bookingData',
      'booking.roomParamsForGetRoomSelected',
      'booking.reservationData',
      'booking.searchData',
      'appHeader.data',
      'guestDetail.guest',
      'guestDetail.someoneElseData',
      'guestDetail.isBookingForSomeoneElse'
    ]
    // storage: {
    //   getItem: key => ls.get(key),
    //   setItem: (key, value) => ls.set(key, value),
    //   removeItem: key => ls.remove(key)
    // }
  })(store)
}

export default persisedState

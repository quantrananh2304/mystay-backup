import HotelRepository from '../../apiTripla/hotel/index'
import HotelDetailRepository from '../../apiTripla/hotel-detail'
import UserRepository from '../../apiTripla/users'
import GuestRepository from '../../apiTripla/guest'
import ReservationsRepository from '../../apiTripla/reservations'
import mystaysRepository from '../../apiMystays'
import CalendarRepository from '../../apiTripla/calendar'
import { Plugin } from '@nuxt/types'
import { triplaRepo, mystaysRepo } from './types'

declare module 'vue/types/vue' {
  interface Vue {
    $triplaRepo: triplaRepo
    $mystaysRepo: mystaysRepo
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $triplaRepo: triplaRepo
    $mystaysRepo: mystaysRepo
  }
}

const repositories: Plugin = (
  { $triplaApi, $mystaysApi, $axios, env },
  inject
) => {
  const triplaRepositories = {
    hotel: HotelRepository($triplaApi, env),
    hotelDetail: HotelDetailRepository($triplaApi),
    users: UserRepository($triplaApi, $axios, env),
    guest: GuestRepository($triplaApi),
    reservations: ReservationsRepository($triplaApi),
    calendar: CalendarRepository($triplaApi)
  }

  const mystaysRepo = mystaysRepository($mystaysApi)

  inject('triplaRepo', triplaRepositories)
  inject('mystaysRepo', mystaysRepo)
}

export default repositories

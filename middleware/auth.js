import { STATIC_HOTEL_ID } from '~/shared/constants'
import { convertTime } from '@/shared/helper/fetchWithCache'

export default async function({ store, $cookiz, $triplaApi, query }) {
  const _authorization = query.access_token || $cookiz.get('_authorization')
  if (_authorization && !store.state.users?.data?.userData) {
    $triplaApi.setHeader('authorization', _authorization)
    try {
      const data = await store.dispatch('users/getUserDetail', STATIC_HOTEL_ID)
      if (data.id && query.access_token) {
        $cookiz.set('_authorization', query.access_token, {
          expires: new Date(Date.now() + convertTime('10d')), // 10 days,
          path: '/'
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

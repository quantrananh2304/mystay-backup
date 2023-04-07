import { convertTime } from '@/shared/helper/fetchWithCache'

export default async function({
  $triplaRepo,
  $triplaApi,
  $cookiz,
  redirect,
  store
}) {
  const clientSession = $cookiz.get('tripla-client-session')
  if (!clientSession && !store.state.clientSession) {
    try {
      const data = await $triplaRepo.users.getClientSesstion()

      if (data) {
        $cookiz.set('tripla-client-session', data.data.client_session, {
          path: '/',
          expires: new Date(Date.now() + convertTime('24h'))
        })
        $triplaApi.setHeader('client-session', data.data.client_session)
        store.dispatch('setSession', data.data.client_session)
      }
    } catch (error) {
      redirect('/something-wrong')
    }
  }

  if (clientSession) {
    $triplaApi.setHeader('client-session', clientSession)
    store.dispatch('setSession', clientSession)
  }
}

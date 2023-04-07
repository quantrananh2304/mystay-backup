export default async function({
  $triplaRepo,
  $mystaysApi,
  $cookiz,
  redirect,
  store
}) {
  const mystaysDevToken = $cookiz.get('mystays-dev-token')

  if (!mystaysDevToken && !store.state.mystaysDevToken) {
    try {
      const data = await $triplaRepo.users.getAccessToken()

      if (data) {
        $cookiz.set('mystays-dev-token', data.access_token, {
          path: '/',
          expires: new Date(Date.now() + data.expires_in * 1000)
        })
        $mystaysApi.setHeader('authorization', `Bearer ${data.access_token}`)
        store.dispatch('setMystaysDevToken', data.access_token)
      }
    } catch (error) {
      redirect('/something-wrong')
    }
  }

  if (mystaysDevToken) {
    $mystaysApi.setHeader('authorization', `Bearer ${mystaysDevToken}`)
    store.dispatch('setMystaysDevToken', mystaysDevToken)
  }
}

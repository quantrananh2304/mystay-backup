import { AxiosError } from 'axios'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Plugin } from '@nuxt/types'

const devMystays: Plugin = ({ $axios, store, $cookiz, env }, inject) => {
  const mystaysDevToken = store.state.mystaysDevToken

  const mystaysApi = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
        ...(mystaysDevToken && { authorization: `Bearer ${mystaysDevToken}` })
      }
    }
  }) as NuxtAxiosInstance

  mystaysApi.setBaseURL(env.MYSTAYS_BASE_URL || 'https://triplaapi.mystays.com')

  mystaysApi.onError(async (error: AxiosError | any) => {
    const originalConfig = error.config
    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      try {
        const rs = await store.$triplaRepo.users.getAccessToken()

        if (rs) {
          const { access_token, expires_in } = rs
          originalConfig.headers['authorization'] = `Bearer ${access_token}`
          store.dispatch('setMystaysDevToken', access_token)
          mystaysApi.setHeader('authorization', `Bearer ${access_token}`)
          $cookiz.set('mystays-dev-token', access_token, {
            path: '/',
            expires: new Date(Date.now() + expires_in * 1000)
          })
        }
        return mystaysApi(originalConfig)
      } catch (_error) {
        return Promise.reject(_error)
      }
    }
  })

  inject('mystaysApi', mystaysApi)
}

export default devMystays

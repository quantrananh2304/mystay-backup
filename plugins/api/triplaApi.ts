import { Plugin } from '@nuxt/types'
import { AxiosError } from 'axios'
import { AxiosResponse } from 'axios'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import formatLanguage from '~/shared/helper/formatLanguage'
import checkTokenExpired from '~/shared/helper/checkTokenExpired'
import { STATIC_HOTEL_ID } from '~/shared/constants'
import { convertTime } from '~/shared/helper/fetchWithCache'

const triplaApi: Plugin = (
  { $axios, store, $cookiz, i18n, env, query },
  inject
) => {
  const clientSession = store.state.clientSession
  const authorization = query.access_token || $cookiz.get('_authorization')
  const triplaApi = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*',
        'app-version': 'tripla-API/1.0',
        'tripla-locale': formatLanguage(i18n.locale),
        ...(clientSession && { 'client-session': clientSession }),
        ...(authorization && { authorization })
      }
    }
  }) as NuxtAxiosInstance

  triplaApi.setBaseURL(env.TRIPLA_BASE_URL || 'https://endpoint.tripla.ai')

  triplaApi.onResponse((resp: AxiosResponse | any) => {
    return resp.data
  })

  triplaApi.onError(async (error: AxiosError | any) => {
    const originalConfig = { ...error.config }
    const originalTokenConfig = { ...error.config }
    const url = error.response.config.url
    const errorStatus = error.response.status

    if (errorStatus === 401) {
      const errorsList = error.response?.data?.errors
      if (
        checkTokenExpired(errorsList).isAccessToken &&
        !originalTokenConfig._retry
      ) {
        originalTokenConfig._retry = true
        const refreshToken = $cookiz.get('_refreshToken')
        if (refreshToken) {
          try {
            const rs = await store.$triplaRepo.users.refreshToken(
              STATIC_HOTEL_ID,
              refreshToken
            )

            if (rs) {
              const tripla_access_token = rs.data?.access_token

              triplaApi.setHeader('authorization', tripla_access_token)

              originalTokenConfig.headers['authorization'] = tripla_access_token

              $cookiz.set('_authorization', tripla_access_token, {
                path: '/',
                expires: new Date(Date.now() + convertTime('10d')) // 10 days
              })
            }

            return triplaApi(originalTokenConfig)
          } catch (_error) {
            store.dispatch(
              'appAuthen/openExpireTokenModal',
              errorsList && errorsList[0]
            )
            store.dispatch('users/removeUser')
            return Promise.reject(_error)
          }
        } else {
          triplaApi.setHeader('authorization', undefined)
          store.dispatch('users/removeUser')
          store.dispatch(
            'appAuthen/openExpireTokenModal',
            errorsList && errorsList[0]
          )
        }
      }

      if (
        checkTokenExpired(errorsList).isSessionToken &&
        !originalConfig._retry
      ) {
        // refresh client session
        originalConfig._retry = true
        try {
          const rs = await store.$triplaRepo.users.getClientSesstion()

          if (rs) {
            const { client_session } = rs.data
            triplaApi.setHeader('client-session', client_session)
            store.dispatch('setSession', client_session)
            originalConfig.headers['client-session'] = client_session

            $cookiz.set('tripla-client-session', client_session, {
              path: '/',
              expires: new Date(Date.now() + convertTime('24h'))
            })
          }
          return triplaApi(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }

    if (
      (errorStatus === 403 || errorStatus === 500) &&
      !originalConfig._retry
    ) {
      // refresh client session
      originalConfig._retry = true
      try {
        const rs = await store.$triplaRepo.users.getClientSesstion()

        if (rs) {
          const { client_session } = rs.data
          triplaApi.setHeader('client-session', client_session)
          store.dispatch('setSession', client_session)
          originalConfig.headers['client-session'] = client_session

          $cookiz.set('tripla-client-session', client_session, {
            path: '/',
            expires: new Date(Date.now() + convertTime('24h'))
          })
        }
        return triplaApi(originalConfig)
      } catch (_error) {
        return Promise.reject(_error)
      }
    }
    const errors = {
      message: error.response.data?.errors
    }
    return Promise.reject(errors)
  })

  inject('triplaApi', triplaApi)
}

export default triplaApi

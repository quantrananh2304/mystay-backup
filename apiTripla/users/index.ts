import { NuxtAxiosInstance } from '@nuxtjs/axios'
const PrivateTokens = require('../../api/constants')
const qs = require('qs')

export default (
  $triplaApi: NuxtAxiosInstance,
  $axios: NuxtAxiosInstance,
  env: any
) => ({
  getClientSesstion: () => {
    return $axios.post(env.SESSION_URL, {
      key: env.KEY,
      secret: env.SECRET
    })
  },

  getAccessToken() {
    const data = qs.stringify(PrivateTokens.data)

    return $axios.post(PrivateTokens.accessTokenUrl, data, {
      headers: PrivateTokens.headers
    })
  },

  refreshToken(hotel_id: number | string, token: string) {
    const body = {
      token
    }
    const params = {
      grant_type: 'client_credentials'
    }
    return $triplaApi.post(`/hotels/${hotel_id}/memberships/tokens`, body, {
      params
    })
  },

  login: (payload: any) => {
    const body = {
      email: payload.email,
      password: payload.password
    }

    const params = {
      grant_type: 'client_credentials'
    }
    return $triplaApi.post(
      `/hotels/${payload.hotel_id}/memberships/sign_in`,
      body,
      { params }
    )
  },

  signUp: (payload: any) => {
    const { hotel_id } = payload
    if (payload.hotel_id && payload.password_confirm) {
      delete payload.hotel_id
      delete payload.password_confirm
    }
    return $triplaApi.post(`/hotels/${hotel_id}/memberships/sign_up`, payload)
  },

  signOut: (hotel_id: number) => {
    return $triplaApi.delete(`/hotels/${hotel_id}/memberships/sign_out`)
  },

  resetPassword: (payload: any) => {
    return $triplaApi.post(
      `/hotels/${payload.hotel_id}/memberships/start_reset_password_process`,
      payload.body
    )
  },

  updatePassword: (payload: any) => {
    return $triplaApi.put(
      `/hotels/${payload.hotel_id}/memberships/update_password`,
      payload.body
    )
  },

  getUserDetail: (hotel_id: number) => {
    return $triplaApi.get(`/hotels/${hotel_id}/memberships/show`)
  },

  updateUserInfo: (payload: any) => {
    return $triplaApi.put(
      `/hotels/${payload.hotel_id}/memberships/update`,
      payload
    )
  },

  getMemberConfimation: (payload: any) => {
    return $triplaApi.get(
      `/hotels/${payload.hotel_id}/memberships/confirm?confirmation_token=${payload.confirmation_token}&program_id=${payload.program_id}`
    )
  },

  cancelMembership: (payload: any) => {
    return $triplaApi.post(
      `/hotels/${payload.hotel_id}/memberships/cancel`,
      payload.body
    )
  },

  getMemberPoint: (hotel_id: number) => {
    return $triplaApi.get(`/hotels/${hotel_id}/memberships/point`)
  },

  getUserCard(hotel_id: number) {
    return $triplaApi.get(`/hotels/${hotel_id}/memberships/credit_cards`)
  }
})

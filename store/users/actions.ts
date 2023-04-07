import { STATIC_HOTEL_ID } from '../../shared/constants/index'
import { UserActionTypes } from './types'
import { ActionTree } from 'vuex'
import { convertTime } from '@/shared/helper/fetchWithCache'
import state from './state'

export type RootState = ReturnType<typeof state>

const actions: ActionTree<RootState, RootState> = {
  async loginUser({ commit, dispatch }, payload) {
    commit(UserActionTypes.LOGIN_USER, {
      payload
    })
    await this.$triplaRepo.users
      .login(payload)
      .then(resp => {
        this.$cookiz.set('_authorization', resp.data?.access_token, {
          expires: new Date(Date.now() + convertTime('10d')), // 10 days
          path: '/'
        })

        if (resp.data?.refresh_token) {
          this.$cookiz.set('_refreshToken', resp.data?.refresh_token.token, {
            expires: new Date(resp.data?.refresh_token.expires_at),
            path: '/'
          })
        }

        this.$triplaApi.setHeader('authorization', resp.data?.access_token)
        dispatch('getUserDetail', {
          hotelId: payload.hotelIdForGetMembership
        })
        commit(UserActionTypes.LOGIN_USER_SUCCESS, { payload: resp.data })

        return Promise.resolve(resp)
      })
      .catch(error => {
        commit(UserActionTypes.LOGIN_USER_FAIL, { error })
        return Promise.reject(error)
      })
  },
  signupUser({ commit }, payload) {
    commit(UserActionTypes.SIGNUP_USER, {})
    return new Promise((resolve, reject) => {
      this.$triplaRepo.users
        .signUp(payload)
        .then(resp => {
          resolve(resp)
          commit(UserActionTypes.SIGNUP_USER_SUCCESS, {
            payload: resp.data
          })
        })
        .catch(error => {
          reject(error?.message[0]?.title || error.errors[0]?.title)
          commit(UserActionTypes.SIGNUP_USER_FAIL, {
            error
          })
        })
    })
  },

  logoutUser({ commit, dispatch }, payload) {
    let hotel_id = STATIC_HOTEL_ID
    if (payload && payload.hotel_id) {
      hotel_id = payload.hotel_id
    }
    this.$triplaRepo.users
      .signOut(hotel_id)
      .then(() => {
        this.$cookiz.remove('_authorization')
        this.$cookiz.remove('_accessToken')
        this.$cookiz.remove('_refreshToken')
        dispatch('removeUser')
      })
      .catch(error => {
        commit(UserActionTypes.LOGOUT_USER_FAIL, {
          error
        })
      })
  },

  removeUser({ commit }) {
    this.$cookiz.remove('_authorization')
    this.$cookiz.remove('_accessToken')
    this.$cookiz.remove('_refreshToken')
    this.$triplaApi.setHeader('authorization', undefined)
    commit(UserActionTypes.LOGOUT_USER_SUCCESS)
  },

  getUserDetail({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      commit(UserActionTypes.GET_USER_DETAIL)

      this.$triplaRepo.users
        .getUserDetail(payload.hotelId || payload)
        .then(resp => {
          // dispatch("getMembershipPoint", BRAND_ID);
          commit(UserActionTypes.GET_USER_DETAIL_SUCCESS, {
            payload: payload.hotelId
              ? resp.data
              : {
                  ...resp.data,
                  loginByToken: true
                }
          })
          resolve(resp.data)
        })
        .catch(error => {
          reject(error)
          commit(UserActionTypes.GET_USER_DETAIL_FAIL, { payload: error })
        })
    })
  },

  updateUserInfo({ commit }, payload) {
    commit(UserActionTypes.UPDATE_USER_INFO, {})
    return new Promise((resolve, reject) => {
      this.$triplaRepo.users
        .updateUserInfo(payload)
        .then(resp => {
          resolve(resp)
          commit(UserActionTypes.UPDATE_USER_INFO_SUCCESS, {
            payload: resp.data
          })
        })
        .catch(error => {
          reject(error?.message?.[0].title)
          commit(UserActionTypes.UPDATE_USER_INFO_FAIL, { error, payload })
        })
    })
  },

  getRessetPasswordToken({ commit }, payload) {
    commit(UserActionTypes.GET_RESSET_PASSWORD_TOKEN, { payload })
  },

  getMemberConfimation({ commit }, payload) {
    commit(UserActionTypes.GET_MEMBER_CONFIRMATION, { payload })
    this.$triplaRepo.users
      .getMemberConfimation(payload)
      .then(res => {
        commit(UserActionTypes.GET_MEMBER_CONFIRMATION_SUCCESS, {
          payload: res
        })
      })
      .catch(error => {
        commit(UserActionTypes.GET_MEMBER_CONFIRMATION_FAIL, {
          payload: error
        })
      })
  },

  getMembershipPoint({ commit }, hotelId) {
    this.$triplaRepo.users
      .getMemberPoint(hotelId)
      .then(res => {
        commit(UserActionTypes.GET_MEMBERSHIP_POINT_SUCCESS, res.data)
      })
      .catch(error => {
        commit(UserActionTypes.GET_MEMBERSHIP_POINT_FAIL, error)
      })
  },

  getMyRewards({ commit }, hotelId) {
    this.$triplaRepo.reservations
      .getMyRewards(hotelId)
      .then(res => {
        commit(UserActionTypes.GET_MY_REWARDS_SUCCESS, res.data)
      })
      .catch(error => {
        commit(UserActionTypes.GET_MY_REWARDS_FAIL, error)
      })
  },

  getReservasionsList({ commit }) {
    commit(UserActionTypes.GET_RESERVAIONS_LIST)
    this.$triplaRepo.reservations
      .getReservationsList()
      .then(res => {
        commit(UserActionTypes.GET_RESERVAIONS_LIST_SUCCESS, res.data)
      })
      .catch(error => {
        commit(UserActionTypes.GET_RESERVAIONS_LIST_SUCCESS, error)
      })
  }
}

export default actions

import * as types from './types'
import { GetterTree } from 'vuex'
import { RootState } from './actions'

const getters: GetterTree<RootState, RootState> = {
  guestDetailAddition: (state: types.IState) => state.additional,
  diningTime: (state: types.IState) => state.diningTime,
  isFormInValid: (state: types.IState) => state.isFormInvalid,
  isMakingForSomeoneFormInValid: state => {
    return state.isMakingForSomeoneFormInvalid && state.isBookingForSomeoneElse
  },
  isSubmitted: (state: types.IState) => state.isSubmitted,

  extrasParams(state) {
    const { extrasParams } = state
    return extrasParams.filter((extras: any) => extras.quantity)
  },
  additionalParams(state, getters, rootState) {
    const { additionalParams } = state
    const { roomParamsForGetRoomSelected } = rootState.booking

    const rooms = (additional: any) => {
      return roomParamsForGetRoomSelected.map((room: any) => {
        if (additional.question_type === 'checkin') {
          return {
            checkin_time: additional.answer.text || null
          }
        }

        return {
          checkout_time: additional.answer.text || null
        }
      })
    }

    const additionalParamsFilter =
      additionalParams.filter(
        (additional: any) => additional.answer_type !== 'none'
      ) || []

    const additionalParamsFormatted = additionalParamsFilter?.map(
      (additional: any) => {
        let data = {}

        if (
          additional.question_type === 'checkin' ||
          additional.question_type === 'checkout'
        ) {
          data = {
            id: additional.id,
            answer: {
              rooms: rooms(additional)
            }
          }
        } else {
          data = {
            id: additional.id,
            answer: {
              text: additional.answer.text
            }
          }
        }

        return data
      }
    )

    return additionalParamsFormatted || []
  },
  isReceiveSubscription: state => state.isReceiveSubscription,
  guest: state => state.guest[0] || {}
}

export default getters

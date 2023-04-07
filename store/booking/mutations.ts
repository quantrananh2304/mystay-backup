import { MutationTree } from 'vuex'
/* eslint-disable import/no-duplicates */
import moment from 'moment'
import { BookingActionTypes } from './types'
import * as types from './types'
import { IBookingState } from './state'

const mutations: MutationTree<IBookingState> = {
  [BookingActionTypes.SHOW_LOCATION](state) {
    state.bookingError.location.msg = null
    state.bookingState = {
      location: true,
      checking: false,
      roomSelect: false,
      promoCode: false,
      searchButton: false,
      nightSelect: false
    }
  },
  [BookingActionTypes.SHOW_CHECKING](state) {
    state.bookingState = {
      location: false,
      checking: true,
      roomSelect: false,
      promoCode: false,
      searchButton: false,
      nightSelect: false
    }
  },
  [BookingActionTypes.SHOW_ROOM_SELECT](state) {
    state.bookingState = {
      location: false,
      checking: false,
      roomSelect: true,
      promoCode: false,
      searchButton: false,
      nightSelect: false
    }
  },
  [BookingActionTypes.SHOW_NIGHT_SELECT](state) {
    state.bookingState = {
      location: false,
      checking: false,
      roomSelect: false,
      promoCode: false,
      searchButton: false,
      nightSelect: true
    }
  },
  [BookingActionTypes.SHOW_PROMO_CODE](state) {
    state.bookingState = {
      location: false,
      checking: false,
      roomSelect: false,
      promoCode: true,
      searchButton: false,
      nightSelect: false
    }
  },
  [BookingActionTypes.SEARCH_ROOM](state) {
    state.bookingState = {
      ...state.bookingState,
      searchButton: true
    }
  },
  [BookingActionTypes.CLOSE_ALL](state) {
    state.bookingState = {
      location: false,
      checking: false,
      roomSelect: false,
      promoCode: false,
      searchButton: false,
      nightSelect: false
    }
  },
  [BookingActionTypes.SHOW_TOTAL_GUEST](state) {
    state.isShowTotalGuest = true
  },

  [BookingActionTypes.GET_LOCATION](state, action) {
    if (action?.payload?.name) {
      state.bookingData.location = action.payload.name
      state.bookingData.hotelID = action.payload.hotelID
    } else {
      state.bookingData.location = ''
      state.bookingData.hotelID = ''
    }
  },

  [BookingActionTypes.GET_CHECKIN](state, action) {
    state.bookingData.checkIn = action.payload
  },

  [BookingActionTypes.GET_CHECKOUT](state, action) {
    state.bookingData.checkOut = action.payload
  },

  [BookingActionTypes.RESET_HOTEL_ID](state) {
    state.bookingData.hotelID = ''
  },

  [BookingActionTypes.GET_PROMO_CODE](state, action) {
    state.bookingData.promoCode = action.payload?.toUpperCase()
  },

  [BookingActionTypes.GET_DATA_FROM_URL](state, payload) {
    const roomInitial = [
      {
        id: '',
        adults: {
          title: 'Adults',
          number: 2
        },
        children: {
          title: 'Children',
          childrenList: []
        }
      }
    ]

    let location = ''
    if (payload.location !== undefined) {
      location = payload.location
    } else if (state.bookingData.location) {
      location = state.bookingData.location
    } else {
      location = ''
    }

    if (payload.checkIndate && payload.checkOutdate) {
      const today = moment().format('YYYY-MM-DD')
      if (
        moment(today, 'YYYY-MM-DD').isAfter(payload.checkIndate) ||
        moment(today, 'YYYY-MM-DD').isAfter(payload.checkOutdate) ||
        moment(payload.checkIndate, 'YYYY-MM-DD').isAfter(payload.checkOutdate)
      ) {
        const checkinDate = moment()
          .day(7)
          .format('YYYY-MM-DD')
        const checkoutDate = moment()
          .day(8)
          .format('YYYY-MM-DD')
        state.bookingData = {
          ...state.bookingData,
          location,
          checkIn: checkinDate,
          checkOut: checkoutDate,
          checkOutBeforeBookingUseDay: checkoutDate,
          promoCode: payload?.coupon_code?.toUpperCase() || '',
          is_day_use: payload.is_day_use && JSON.parse(payload.is_day_use),
          is_including_occupied:
            payload.is_including_occupied &&
            JSON.parse(payload.is_including_occupied),
          search_type: payload.search_type,
          room_type_codes: payload.room_type_codes || '',
          room_plan_codes: payload.room_plan_codes || '',
          roomTypeCodes: payload.room_type_codes?.split(',') || [],
          tab: payload.tab || '',
          type: payload.type || 'rooms',
          promoCodeExist: {},
          roomList: payload.rooms ? JSON.parse(payload.rooms) : roomInitial
        }
      } else {
        state.bookingData = {
          ...state.bookingData,
          location,
          checkIn: payload.checkIndate,
          checkOut: payload.checkOutdate,
          checkOutBeforeBookingUseDay: payload.checkOutdate,
          promoCode: payload?.coupon_code?.toUpperCase() || '',
          promoCodeExist: {},
          is_day_use: payload.is_day_use && JSON.parse(payload.is_day_use),
          is_including_occupied:
            payload.is_including_occupied &&
            JSON.parse(payload.is_including_occupied),
          search_type: payload.search_type,
          room_type_codes: payload.room_type_codes || '',
          roomTypeCodes: payload.room_type_codes?.split(',') || [],
          tab: payload.tab || '',
          type: payload.type || 'rooms',
          roomList: payload.rooms ? JSON.parse(payload.rooms) : roomInitial
        }
      }
    } else if (state.bookingData.checkIn && !payload.checkIndate) {
      const today = moment().format('YYYY-MM-DD')
      if (
        moment(today, 'YYYY-MM-DD').isAfter(state.bookingData.checkIn) ||
        moment(today, 'YYYY-MM-DD').isAfter(state.bookingData.checkOut)
      ) {
        const checkinDate = moment()
          .day(7)
          .format('YYYY-MM-DD')
        const checkoutDate = moment()
          .day(8)
          .format('YYYY-MM-DD')
        state.bookingData = {
          ...state.bookingData,
          checkIn: checkinDate,
          checkOut: checkoutDate
        }
      }
    } else {
      const checkinDate = moment()
        .day(7)
        .format('YYYY-MM-DD')
      const checkoutDate = moment()
        .day(8)
        .format('YYYY-MM-DD')
      state.bookingData = {
        ...state.bookingData,
        location,
        checkIn: checkinDate,
        checkOut: checkoutDate,
        checkOutBeforeBookingUseDay: checkoutDate,
        promoCode: payload?.coupon_code?.toUpperCase() || '',
        promoCodeExist: {},
        is_day_use: payload.is_day_use && JSON.parse(payload.is_day_use),
        is_including_occupied:
          payload.is_including_occupied &&
          JSON.parse(payload.is_including_occupied),
        search_type: payload.search_type,
        room_type_codes: payload.room_type_codes || '',
        roomTypeCodes: payload.room_type_codes?.split(',') || [],
        tab: payload.tab || '',
        type: payload.type || 'rooms',
        roomList: payload.rooms ? JSON.parse(payload.rooms) : roomInitial
      }
    }
  },

  [BookingActionTypes.DELETE_ROOM_TYPE_CODE](state, code) {
    const roomTypeCodes = state.bookingData.roomTypeCodes
    const roomTypeCodesFilter = roomTypeCodes.filter(room => room !== code)

    state.bookingData.roomTypeCodes = roomTypeCodesFilter

    state.bookingData.room_type_codes = roomTypeCodesFilter.toString()
  },

  [BookingActionTypes.SET_SEARCH_KEYWORD](state, payload) {
    state.bookingData.location = payload
  },
  [BookingActionTypes.GET_ERROR](state, action) {
    switch (action.payload.key) {
      case 'location':
        state.bookingError.location.msg = action.payload.msg
        break
      default:
        break
    }
  },

  [BookingActionTypes.CHECK_PROMO_CODE_SUCCESS](state, action) {
    state.bookingData.promoCodeExist = action.payload
  },

  [BookingActionTypes.CHECK_PROMO_CODE_FAIL](state, action) {
    state.bookingData.promoCodeExist = action.error
  },

  [BookingActionTypes.SET_INITIAL_BOOKING](_state, _action) {
    // state.bookingData.booking = action.payload
  },

  [BookingActionTypes.GET_INITIAL_BOOKING](state, action) {
    state.bookingData = {
      ...state.bookingData,
      checkIn: action.payload.checkIn,
      checkOut: action.payload.checkOut,
      checkOutBeforeBookingUseDay: action.payload.checkOut
      // roomSelect: action.payload.roomSelect
    }
  },

  [BookingActionTypes.SET_SEARCH_TYPE](state, payload) {
    state.bookingData.searchType = payload
  },

  [BookingActionTypes.SAVE_SEARCH_DATA](state, payload) {
    state.searchData = payload
  },

  [BookingActionTypes.SAVE_HOTEL_ID](state, payload) {
    state.bookingData.hotelID = payload
  },

  [BookingActionTypes.SAVE_ROOM_INDEX](state, payload) {
    state.roomIndex = payload
  },

  //
  [BookingActionTypes.SAVE_ROOM_LIST](state, payload) {
    state.bookingData.roomList = payload
    state.bookingData.totalGuest = payload
      .map(
        (x: types.IRoomModel) =>
          x.adults.number + x.children.childrenList.length
      )
      .reduce((a: number, b: number) => a + b)
  },

  [BookingActionTypes.ADD_ROOM](state) {
    // const roomModel = {
    //   id: '',
    //   adults: {
    //     title: 'Adults',
    //     number: 1
    //   },
    //   children: {
    //     title: 'Children',
    //     childrenList: []
    //   }
    // }
    // state.bookingData.roomList.push(roomModel)

    const roomItem = {
      ...JSON.parse(JSON.stringify(state.bookingData.roomList[0]))
    }
    state.bookingData.roomList.push(roomItem)
  },

  [BookingActionTypes.DELETE_ROOM](state, roomID: number) {
    if (state.bookingData?.roomList?.length > 1) {
      state.bookingData.roomList.splice(roomID, 1)
    }
  },

  [BookingActionTypes.ON_CHANGE_CHILD](state, payload: types.IChangeChild) {
    // if (payload.child.isMinus) {
    //   state.bookingData.roomList[payload.roomIndx].children.childrenList.pop();
    // } else {
    //   state.bookingData.roomList[payload.roomIndx].children.childrenList.push({
    //     title: `Child ${payload.child.data.number}`,
    //     age: 1,
    //     value: "Select Tier",
    //     bed: false
    //   });
    // }

    const { roomList } = state.bookingData
    if (payload.child.isMinus) {
      state.bookingData.roomList[0].children.childrenList.pop()

      const firstRoom = { ...state.bookingData.roomList[0] }
      state.bookingData.roomList = roomList.map(room => {
        return firstRoom
      })
    } else {
      state.bookingData.roomList[0].children.childrenList.push({
        title: `Child ${payload.child.data.number}`,
        age: 1,
        value: 'Select Tier',
        bed: false
      })
      const firstRoom = { ...state.bookingData.roomList[0] }
      state.bookingData.roomList = roomList.map(room => {
        return firstRoom
      })
    }
  },

  [BookingActionTypes.ON_CHANGE_PERSON](state, payload: types.IPersonChange) {
    // state.bookingData.roomList[payload.roomIndx].adults = payload.person.data;
    state.bookingData.roomList.map(room => {
      room.adults = payload.person.data
      return room
    })
  },

  [BookingActionTypes.ON_CHANGE_CHILD_AGE](
    state,
    payload: types.IChangeChildAge
  ) {
    state.bookingData.roomList[payload.roomIdx].children.childrenList[
      payload.data.index
    ].age = payload.data.age
    state.bookingData.roomList[payload.roomIdx].children.childrenList[
      payload.data.index
    ].value = payload.data.age

    const firstRoom = JSON.parse(JSON.stringify(state.bookingData.roomList[0]))

    state.bookingData.roomList = state.bookingData.roomList.map(room => {
      return firstRoom
    })
  },

  [BookingActionTypes.ON_CHANGE_BED_SELECT](state, payload) {
    state.bookingData.roomList[payload.roomIdx].children.childrenList[
      payload.data.index
    ].bed = payload.data.bed

    const firstRoom = JSON.parse(JSON.stringify(state.bookingData.roomList[0]))

    state.bookingData.roomList = state.bookingData.roomList.map(room => {
      return firstRoom
    })
  },

  [BookingActionTypes.CREATE_RESERVATIONS](state) {
    state.isUpdateLoading = true
  },

  [BookingActionTypes.CREATE_RESERVATIONS_SUCCESS](state, action) {
    state.reservationData = action.payload
    state.isUpdateLoading = false
  },

  [BookingActionTypes.CREATE_RESERVATIONS_FAIL](state, action) {
    state.paymentState.isLoading = false
    state.isUpdateLoading = false
    state.reservationError = action
  },

  [BookingActionTypes.GET_RESERVATIONS](state, _action) {
    state.reservationData = {}
    state.isReservationLoading = true
  },

  [BookingActionTypes.GET_RESERVATIONS_SUCCESS](state, action) {
    state.reservationData = action.payload
    state.isReservationLoading = false
  },

  [BookingActionTypes.GET_RESERVATIONS_FAIL](state, action) {
    state.isReservationLoading = false
  },

  [BookingActionTypes.CANCEL_RESERVATIONS](state) {
    state.isReservationLoading = true
    // state.e = true;
  },

  [BookingActionTypes.CANCEL_RESERVATIONS_SUCCESS](state, action) {
    state.success = true
    state.reservationData = action.payload
    state.isReservationLoading = false
    state.successCancelReservationMessage = action.payload.message.title
  },

  [BookingActionTypes.CANCEL_RESERVATIONS_FAIL](state, action) {
    state.isReservationLoading = false
    const errorMessage = action.error.message[0].title
    state.cancelReservationMessage = errorMessage
  },

  [BookingActionTypes.UPDATE_RESERVATIONS](state) {
    state.isUpdateLoading = true
  },

  [BookingActionTypes.UPDATE_RESERVATIONS_SUCCESS](state, action) {
    state.reservationData = action.payload
    state.isUpdateLoading = false
  },

  [BookingActionTypes.UPDATE_RESERVATIONS_FAIL](state, action) {
    state.isUpdateLoading = false
    state.reservationError = action
  },

  [BookingActionTypes.UPDATE_GUEST_DETAIL](state) {
    state.isReservationLoading = true
    // state.e = true;
  },

  [BookingActionTypes.UPDATE_GUEST_DETAIL_SUCCESS](state, action) {
    state.success = true
    state.reservationData = action.payload
    state.isReservationLoading = false
    // state.e = true;
  },

  [BookingActionTypes.UPDATE_GUEST_DETAIL_FAIL](state, action) {
    state.isReservationLoading = false
  },

  [BookingActionTypes.GET_SETTING_RESERVATIONS_SUCCESS](state, action) {
    state.reservationsSettings = action.payload
  },

  [BookingActionTypes.GET_SETTING_RESERVATIONS_FAIL](state, action) {
    state.reservationsSettings = action.payload
  },

  [BookingActionTypes.SAVE_URL_PARAMS_RESERVATIONS](state, payload) {
    state.reservationParams = {
      hotelID: payload.hotelID,
      reservationID: payload.reservationID,
      email: payload.email,
      bypass_token: payload.byPassToken
    }
  },

  [BookingActionTypes.SET_BOOKING_FROM_API](state, payload) {
    state.bookingData = {
      ...state.bookingData,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      checkOutBeforeBookingUseDay: payload.checkOut,
      roomList: payload.roomList
    }
  },

  [BookingActionTypes.SET_CALENDAR](state, payload) {
    state.allowedSelectOneDay = payload
    const tomorrow = moment(state.bookingData.checkIn).add(1, 'days')
    let checkOut = ''

    if (
      state.bookingData.checkOutBeforeBookingUseDay &&
      !state.bookingData.is_undated
    ) {
      if (
        moment(
          state.bookingData.checkOutBeforeBookingUseDay,
          'YYYY-MM-DD'
        ).isSame(state.bookingData.checkIn)
      ) {
        checkOut = moment(tomorrow, 'YYYY-MM-DD').format('YYYY-MM-DD')
      } else {
        checkOut = state.bookingData.checkOutBeforeBookingUseDay
      }

      if (moment(checkOut).isBefore(moment(state.bookingData.checkIn))) {
        checkOut = moment(tomorrow, 'YYYY-MM-DD').format('YYYY-MM-DD')
      }
    } else {
      checkOut = moment(state.bookingData.checkIn)
        .add(state.bookingData.totalNight, 'days')
        .format('YYYY-MM-DD')
    }

    if (payload) {
      state.bookingData.checkOut = state.bookingData.checkIn
    } else {
      state.bookingData.checkOut = checkOut
    }
  },

  [BookingActionTypes.GET_BOOKING_ID](state, _action) {
    state.bookingData.hotelID = _action.payload
  },

  [BookingActionTypes.SAVE_ROOM_PARAMS_FOR_GET_ROOM_SELECTED](state) {
    state.roomParamsForGetRoomSelected = [...state.bookingData.roomList]
  },

  [BookingActionTypes.DEL_ROOM_PARAMS_FOR_GET_ROOM_SELECTED](
    state,
    roomIdx: number
  ) {
    state.roomParamsForGetRoomSelected.splice(roomIdx, 1)
  },

  [BookingActionTypes.SAVE_USE_DAY_PARAMS_FROM_BOOKING](
    state,
    payload: boolean
  ) {
    state.bookingData.is_day_use = payload
  },

  [BookingActionTypes.SAVE_IS_ROOM_AVAILABLE](state, payload: boolean) {
    state.bookingData.is_including_occupied = payload
  },

  [BookingActionTypes.SAVE_IS_UNDATED](state, payload: boolean) {
    if (payload && !state.bookingData.totalNight) {
      state.bookingData.totalNight = 1
    }

    state.bookingData.is_undated = payload
    
    if (payload) {
      state.bookingData.is_day_use = false
      state.bookingData.is_including_occupied = true
    }

    if (!payload && state.bookingData.checkIn === state.bookingData.checkOut) {
      state.bookingData.is_day_use = true
    }
  },

  [BookingActionTypes.SAVE_CURRENT_TAB](state, tab) {
    state.bookingData.type = tab
  },

  [BookingActionTypes.RESET_ROOM_TYPE_CODE](state, tab) {
    state.bookingData.room_type_codes = ''
    state.bookingData.roomTypeCodes = []
  },

  [BookingActionTypes.SET_TOTAL_NIGHT](state, payload: number) {
    state.bookingData.totalNight = payload
  },

  [BookingActionTypes.SET_QUERY_SEARCH_TYPE](state, payload: string) {
    state.bookingData.search_type = payload
  }
}

export default mutations

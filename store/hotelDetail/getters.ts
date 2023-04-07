import { GetterTree } from 'vuex'
import { IHotelDetail, IHotelDetailAmenity } from '@/interfaces/hotelDetail'
import moment from 'moment'
import * as constant from '../../shared/constants/index'
import { PlanHelper, RoomHelper } from './helper'
import State from './state'

const getters: GetterTree<typeof State, typeof State> = {
  roomDetails: (state: any, _getters: any, rootState: any) => {
    const selectedRoom = rootState.booking?.bookingData?.roomList
    const roomDetail = state.selectedRoom.map(
      (roomPlan: any, roomIdx: number) => {
        const guests = selectedRoom[roomIdx]?.adults?.number
        const numberChildren =
          selectedRoom[roomIdx]?.children?.childrenList.length
        const numberAdults = selectedRoom[roomIdx]?.adults?.number
        const roomTitleWithGuestNumber = `${roomPlan.room?.roomTitle} ${roomPlan
          .plan?.title || ''}`

        const newRoom = {
          roomID: roomPlan.room?.roomId,
          roomName: '',
          roomTitle: roomPlan.room?.roomTitle,
          title: roomTitleWithGuestNumber,
          roomInfo: {},
          sleeps: roomPlan.plan?.sleeps,
          roomPlanCode:
            roomPlan.plan?.roomPlanCode || roomPlan.room?.roomPlanCode
        }
        const details = roomPlan?.plan?.roomRate?.map(
          (plan: any, index: number) => {
            const percentTax =
              roomPlan.plan?.tax / (roomPlan.plan?.rate + roomPlan.plan?.tax)
            return {
              time: `Night ${index + 1}`,
              price: plan?.rate - percentTax * plan?.rate
            }
          }
        )
        const title = roomPlan.plan?.title || ''

        newRoom.roomInfo = {
          title,
          totalPrice: roomPlan.plan?.rate, // + roomPlan.plan.tax
          detail: details,
          numberChildren,
          numberAdults
        }
        return newRoom
      }
    )

    return roomDetail
  },

  roomDetailFromAPI(state: any) {
    const { roomSelectedFromAPI } = state
    const rooms = roomSelectedFromAPI?.rooms
    if (rooms && rooms.length) {
      const roomDetail = rooms.map((room: any) => {
        const title = room.room_plan_name || ''
        const newRoomDetail = {
          roomID: room.room_type_code,
          roomInfo: {},
          roomName: '',
          roomPlanCode: room.room_plan_code,
          roomTitle: room.room_type_name,
          sleeps: '',
          title
        }

        const details = room.room_rates?.map((rate: any, rateIdx: number) => {
          return {
            time: `Night ${rateIdx + 1}`,
            price: rate.day_total_rate
          }
        })

        const totalPrice = details
          .map((d: any) => d.price)
          .reduce((a: any, b: any) => a + b)

        newRoomDetail.roomInfo = {
          title,
          totalPrice, // + roomPlan.plan.tax
          detail: details,
          numberChildren: room.children,
          numberAdults: room.adults
        }

        return newRoomDetail
      })

      return roomDetail
    }
  },

  couponDiscount(state: any) {
    const { roomSelectedFromAPI } = state

    return -roomSelectedFromAPI?.coupon_discount_amount
  },

  percentDiscount(state: any) {
    const { roomSelectedFromAPI } = state
    const discountAmount = roomSelectedFromAPI?.coupon_discount_amount
    const originalPriceWithTax = roomSelectedFromAPI?.original_price_with_tax

    if (discountAmount && originalPriceWithTax) {
      const percent = Number((discountAmount / originalPriceWithTax) * 100)
      return `${percent.toFixed(0)}%`
    }

    return ''
  },

  promoCodeFromAPI(state: any) {
    const { roomSelectedFromAPI } = state

    return roomSelectedFromAPI?.coupon_promotion?.coupon_code
  },

  tax: (state: any) => {
    const roomDetail = state.selectedRoom
    const { roomSelectedFromAPI } = state
    if (roomDetail.length) {
      const taxDetail = [
        {
          time: 'tax',
          price: roomSelectedFromAPI?.tax
        }
      ]
      return {
        title: 'tax_and_fee_change',
        totalPrice: roomSelectedFromAPI?.total_price,
        totalTax: roomSelectedFromAPI?.tax,
        couponDiscount: roomSelectedFromAPI?.coupon_discount_amount,
        detail: taxDetail
      }
    }
  },

  taxFromAPI(_state: any, _getters: any, rootState: any) {
    const reservationData = rootState.booking?.reservationData
    const detail = [
      {
        time: 'tax',
        price: reservationData?.tax
      }
    ]

    if (reservationData?.spending_point_value) {
      detail.unshift({
        time: 'spending_points',
        price: reservationData?.spending_point_value
      })
    }

    return {
      title: 'tax_and_fee_change',
      totalPrice: reservationData?.total_price,
      totalTax: reservationData?.tax,
      detail
    }
  },

  totalPrice: (state: any) => {
    const { roomSelectedFromAPI } = state

    return roomSelectedFromAPI?.total_price
  },
  totalPriceWithoutTax: (_state: any, getters: any) => {
    const roomDetail = getters.roomDetails
    if (roomDetail.length) {
      const totalGross = roomDetail
        .map((room: any) => {
          return room.roomInfo?.totalPrice
        })
        .reduce((a: any, b: any) => a + b)
      return totalGross
    }
  },
  roomDetailSidebar: state => {
    const hotelDetail = state.hotelDetail?.data
    const roomFacilitiesFilter = hotelDetail?.amenities.filter(
      (amenity: IHotelDetailAmenity) => amenity.is_active
    )
    const roomFacilities = roomFacilitiesFilter?.map(
      (amenity: IHotelDetailAmenity) => {
        let icon = ''
        constant.amenitiesInclude.forEach((a: any) => {
          if (amenity.name === a.name) {
            icon = a.icon
          }
        })
        return {
          icon,
          name: amenity.name
        }
      }
    )

    return {
      roomBookingTime: {
        checkIn: state.hotelDetailV2?.checkin,
        checkOut: state.hotelDetailV2?.checkout
      },
      roomFacilities: {
        title: 'room_facilities',
        serviceList: roomFacilities
      },
      roomServices: {
        title: 'facilities_and_service',
        serviceList: []
      },
      roomRentalEquipment: {
        title: 'rental_equipment',
        serviceList: []
      }
    }
  },
  checkInOverview: (state: any) => {
    const emails = state.hotelDetailV2?.email?.split(',')
    return [
      {
        name: 'check_in_out',
        icon: 'icon-Icon-Time',
        title: `${state.hotelDetailV2.checkin} / ${state.hotelDetailV2.checkout}`,
        clickable: false
      },
      {
        name: 'call_to_inquire',
        icon: 'icon-Icon-Phone',
        title: `${state.hotelDetailV2.phone}`,
        clickable: true
      },
      {
        name: 'contact_us',
        icon: 'icon-Icon-Email',
        title: `${emails && emails[0]}`,
        clickable: true
      }
    ]
  },

  phoneNumber(state: any) {
    return state.hotelDetailV2.phone
  },

  findUsOverview: (state: any) => {
    const hotelDetail = state.hotelDetail && state.hotelDetail.data
    const area = hotelDetail?.area?.name
    const findUsOverview: Array<any> = []

    const transportations = state.hotelDetailV2?.transportations || []

    transportations?.forEach((transport: any) => {
      findUsOverview.push({
        name: transport.text,
        icon:
          transport.type === 'Plane'
            ? 'icon-Icon-Amenity-Airport'
            : 'icon-Icon-Amenity-Transit',
        title: ''
      })
    })

    return findUsOverview
  },
  planInfo: (state: any, getters: any, rootState: any, rootGetters: any) => {
    if (state.planList?.plans?.length) {
      const { sortBy } = state
      const isLogin = rootGetters['users/isLogin']

      const hotelDetailHelper = new PlanHelper(
        state.planList?.plans,
        sortBy,
        {},
        [],
        [],
        isLogin
      )

      return hotelDetailHelper.planInfo()
    }

    return []
  },

  roomList: (state: any, getters: any, _rootState: any, rootGetters: any) => {
    if (state.roomList?.rooms?.length) {
      const { roomStatus } = getters
      const { sortBy } = state
      const roomList = state.roomList.rooms
      const roomPlanCode = state.roomPlanCode
      const isLogin = rootGetters['users/isLogin']
      const roomHelper = new RoomHelper(
        roomStatus,
        sortBy,
        roomList,
        roomPlanCode,
        {},
        false,
        isLogin
      )

      return roomHelper.roomInfo()
    }

    return []
  },

  roomFilter: (state: any, getters: any, rootState: any, rootGetters: any) => {
    const filterModel = state.roomFilterModel
    const roomList = getters.roomList
    const { sortBy } = state
    const roomPlanCode = state.roomPlanCode
    let isSmoking = false
    const isLogin = rootGetters['users/isLogin']
    const roomHelper = new RoomHelper(
      {},
      sortBy,
      roomList,
      roomPlanCode,
      filterModel,
      isSmoking,
      isLogin
    )

    return roomHelper.roomFilter()
  },

  roomLeftFilter(state: any, getters: any) {
    return getters.roomFilter
  },

  planLeftFilter(state: any, getters: any, rootState: any, rootGetters: any) {
    const planInfo = JSON.parse(JSON.stringify(getters.planInfo))
    const { selectedRoom } = state
    const { sortBy } = state
    const filterModel = state.roomFilterModel
    const isLogin = rootGetters['users/isLogin']

    const planHelper = new PlanHelper(
      [],
      sortBy,
      filterModel,
      selectedRoom,
      planInfo,
      isLogin
    )

    return planHelper.planLeftFilter()
  },

  hotelDetail: (state: any): IHotelDetail => {
    return state.hotelDetail?.data
  },

  hotelDetailV2: (state: any) => {
    return state.hotelDetailV2
  },

  amennitiesInclude(_state: any, _getters: any) {
    const serviceList = _getters.roomDetailSidebar?.roomFacilities?.serviceList
    return serviceList?.slice(0, 4)
  },

  roomStatus(state: any, _getters: any, rootState: any) {
    const { roomIndex } = state
    const roomList = rootState.booking?.bookingData?.roomList
    if (roomList?.length) {
      return roomList[roomIndex]
    }
    return 0
  },

  roomSelected(_state: any, getters: any, rootState: any) {
    const { roomDetailFromAPI } = getters
    const selectedRoom = rootState.booking?.roomParamsForGetRoomSelected
    const roomNameList = roomDetailFromAPI?.map(
      (roomDetail: any, index: number) => {
        const numberAdults = selectedRoom[index]?.adults?.number
        const numberChildren =
          selectedRoom[index]?.children?.childrenList.length
        return {
          title: `${roomDetail.roomTitle}`,
          detail: roomDetail.roomInfo.detail,
          totalPrice: roomDetail.roomInfo.totalPrice,
          numberAdults,
          numberChildren
        }
      }
    )
    return roomNameList
  },

  mapBackgroundImage(
    state: any,
    _getters: any,
    _rootState: any,
    rootGetters: any
  ) {
    const hotelDetail = state.hotelDetail?.data
    const language = rootGetters['appHeader/language']
    const lat = Number(hotelDetail?.latitude)
    const lng = Number(hotelDetail?.longitude)
    const mapImageSize = {
      desktopSize: '638x265',
      ipadSize: '387x177',
      mobileSize: '600x135'
    }
    if (lat && lng) {
      return {
        desktopImage: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&scale=1&size=${mapImageSize.desktopSize}&maptype=roadmap&key=AIzaSyD9G3yU6CBFBMhuClWTKYsxZIDk5D44Szs&format=png&visual_refresh=true&markers=icon:https://www.mystays.com/Assets/Mystays/images/ms-zoomout-icon.png|shadow:true|${lat},${lng}&language=${language}&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.05978,141.347616&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.062577,141.353647&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true`,
        ipadImage: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&scale=1&size=${mapImageSize.ipadSize}&maptype=roadmap&key=AIzaSyD9G3yU6CBFBMhuClWTKYsxZIDk5D44Szs&format=png&visual_refresh=true&markers=icon:https://www.mystays.com/Assets/Mystays/images/ms-zoomout-icon.png|shadow:true|${lat},${lng}&language=${language}&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.05978,141.347616&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.062577,141.353647&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true`,
        mobileImage: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&scale=1&size=${mapImageSize.mobileSize}&maptype=roadmap&key=AIzaSyD9G3yU6CBFBMhuClWTKYsxZIDk5D44Szs&format=png&visual_refresh=true&markers=icon:https://www.mystays.com/Assets/Mystays/images/ms-zoomout-icon.png|shadow:true|${lat},${lng}&language=${language}&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.05978,141.347616&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true|43.062577,141.353647&markers=icon:https://www.mystays.com/Assets/Mystays/images/location-map-hover.png|shadow:true`
      }
    }
  },

  cancellationPolicies(state: any) {
    const { cancellationPolicies } = state
    if (cancellationPolicies?.length) {
      return cancellationPolicies[0]
    }
  },

  hotelReviews(state: any) {
    const { hotelReviews } = state
    const hotelReviewList = hotelReviews?.map((hotelReview: any) => {
      return {
        ...hotelReview,
        rating: Math.round(hotelReview.rating)
      }
    })

    return hotelReviewList
  },

  currentTab: (state: any) => {
    return {
      currentTab: state.currentTab,
      currentId: state.currentId
    }
  },

  roomTypes(state: any) {
    const { search_params } = state.roomList

    return search_params?.room_types
  },

  roomDataDefault(state: any) {
    return state.roomDataDefault
  },

  roomSearchFilters(state: any) {
    return (
      state.hotelSettings?.booking_widget_setting_attributes
        ?.room_search_filters || []
    )
  }
}

export default getters

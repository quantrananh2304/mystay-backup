<template>
  <div class="hotel-detail">
    <client-only>
      <HotelNavigationBar
        :is-selected-hotel="isSelectedHotel"
        :current-step="currentStep"
        :is-show-back-to-search-result="isShowBackToSearchResult"
        @on:Apply="$_onApply"
      />
    </client-only>

    <HotelDetailPageTopView />
    <LazyHotelDetailRoomsAndPlans />
    <LazyOtherNearbyHotels
      v-if="hotelDetailV2.nearbyHotels && hotelDetailV2.nearbyHotels.length"
    />
    <LazyHotelDetailFindUs />
    <LazyHotelDetailReviews />
    <div
      v-if="
        bookingState.checking ||
          bookingState.roomSelect ||
          bookingState.promoCode
      "
      class="hotel-detail__overlay"
      @click="$_closeAll"
    />
    <PageLoader v-show="isRoomLoading && isFromMystays" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { MYSTAYS_BRAND_ID } from '../shared/constants'
export default Vue.extend({
  name: 'HotelDetail',

  async fetch() {
    const { hotelID } = this.$route.params

    const hotel = await this.$triplaRepo.hotelDetail.getHotelDetail({ hotelID })

    const hotelDetailV2 = await this.$mystaysRepo.getHotelDetailV2({
      TargetLanguage: this.langForGetHotelDetail(this.$i18n.locale),
      HotelID: hotelID,
      IsClearCache: false
    })

    const hotelDetail = hotelDetailV2.data

    this.nearbyHotels = hotelDetail.nearbyHotels

    const overview = hotelDetail && hotelDetail.overview

    const firstImg = hotelDetailV2.data?.images?.[0]
    this.hotelDesc = {
      image: firstImg,
      overview
    }

    this.pageTitle = hotel?.data?.name
  },
  data() {
    return {
      isSelectedHotel: false,
      currentStep: 2,
      isShowBackToSearchResult: true,
      isChangeLanguage: false,
      isBookingDataChange: false,
      isOpenBooking: false,
      title: '',
      pageTitle: '',
      hotelDesc: {},
      nearbyHotels: []
    }
  },

  computed: {
    ...mapState({
      bookingState: state => state.booking.bookingState,
      checkin: state => state.booking.bookingData?.checkIn,
      checkout: state => state.booking.bookingData?.checkOut,
      roomListFromBookingData: state => state.booking.bookingData?.roomList,
      promoCode: state => state.booking.bookingData?.promoCode,
      hotelDetail: state => state.hotelDetail?.hotelDetail?.data,
      roomIndex: state => state.hotelDetail?.roomIndex,
      tiersSettings: state => state.hotel.data.tiersSettings,
      is_day_use: state => state.booking.bookingData.is_day_use,
      is_including_occupied: state =>
        state.booking.bookingData.is_including_occupied,
      searchKeyword: state => state.booking.bookingData.location,
      roomFilterModel: state => state.hotelDetail.roomFilterModel,
      sortByValue: state => state.hotelDetail.sortBy,
      room_type_codes: state => state.booking.bookingData?.room_type_codes,
      isRoomLoading: state => state.hotelDetail.isRoomLoading,
      bookingDataFromStore: state => state.booking.bookingData,
      hotelDetailV2: state => state.hotelDetail.hotelDetailV2
    }),
    ...mapGetters({
      roomList: 'booking/roomList',
      getCheckinDate: 'booking/getCheckinDate',
      getCheckoutDate: 'booking/getCheckoutDate',
      isSelectedAge: 'booking/isSelectedAge',
      roomListWithChildren: 'booking/roomListWithChildren',
      hasChildren: 'booking/hasChildren',
      isKidsTierSupport: 'hotel/isKidsTierSupport',
      roomListAPI: 'hotelDetail/roomList',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      tiers: 'hotel/tiers',
      hotelReviews: 'hotelDetail/hotelReviews',
      numberAdults: 'booking/numberAdults',
      numberChildren: 'booking/numberChildren',
      hotelDetailV2: 'hotelDetail/hotelDetailV2',
      users: 'users/userData',
      hotelSelected: 'hotel/hotelSelected',
      numberOfDaysToCheckIn: 'booking/numberOfDaysToCheckIn',
      totalNight: 'booking/totalNight'
    }),

    bookingData() {
      return {
        roomList: this.roomListFromBookingData,
        checkIn: this.checkin,
        checkOut: this.checkout,
        promoCode: this.promoCode
      }
    },

    roomListWithoutChildren() {
      const roomListWithoutChildren = this.roomList.map((room) => {
        room.children = 0
        return room
      })

      return roomListWithoutChildren
    },

    showRoomList() {
      return {
        isSelectedAge: this.isSelectedAge,
        hasChildren: this.hasChildren,
        isKidsTierSupport: this.isKidsTierSupport
      }
    },

    pathUrl() {
      return this.$route.fullPath
    },

    bookingUseDay() {
      return {
        is_day_use: this.is_day_use,
        isAvailable: this.is_including_occupied
      }
    },

    isFromMystays() {
      return this.$route.query.from === 'mystays'
    }
  },

  watch: {
    bookingData: {
      handler() {
        if (this.isOpenBooking) {
          this.isBookingDataChange = true
        }
      },
      deep: true
    },

    bookingState(bookingState) {
      if (
        bookingState.roomSelect ||
        bookingState.promoCode ||
        bookingState.checking
      ) {
        this.isOpenBooking = true
      }
    },

    is_day_use(is_day_use) {
      this.$gtm.push({
        event: 'showOnlyAvailableFilter',
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        enabledDisabled: is_day_use ? 'Enabled' : 'Disabled',
        triggerType: 'User Interaction'
      })
    },

    checkout(checkout) {
      this.$gtm.push({
        event: 'bookNowHome',
        checkInDate: this.checkin,
        checkOutDate: checkout,
        productCoupon: this.promoCode,
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        searchTerm: this.searchKeyword,
        numberOfAdult: this.numberAdults,
        numberOfChildren: this.numberChildren,
        numberOfRooms: this.roomListFromBookingData.length,
        triggerType: 'User Interaction'
      })
    },

    roomListFromBookingData: {
      handler() {
        this.$gtm.push({
          event: 'bookNowHome',
          checkInDate: this.checkin,
          checkOutDate: this.checkout,
          productCoupon: this.promoCode,
          language: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          searchTerm: this.searchKeyword,
          numberOfAdult: this.numberAdults,
          numberOfChildren: this.numberChildren,
          numberOfRooms: this.roomListFromBookingData.length,
          triggerType: 'User Interaction'
        })
      },
      deep: true
    },

    $route() {
      this.searchRoomAndPlan(this.roomIndex)
    },

    sortByValue() {
      this.searchRoomAndPlan(this.roomIndex)
    },

    showRoomList(roomState) {
      if (
        roomState.hasChildren &&
        roomState.isKidsTierSupport &&
        !roomState.isSelectedAge
      ) {
        this.showRoomSelect()
      }
    },

    tiersSettings(tiers) {
      const hotelID = this.$route.params.hotelID
      const fullPath = this.$route.fullPath
      this.saveFullPathHotelDetail({ fullPath, hotelID })
      this.clearRoomSelected()
      if (tiers?.kids_setting) {
        this.searchRoomAndPlan(0)
      }
    },

    pathUrl(fullPath) {
      const hotelID = this.$route.params.hotelID
      this.saveFullPathHotelDetail({ fullPath, hotelID })
    },

    async fullLang(lang) {
      if (lang && this.isChangeLanguage) {
        const hotelID = this.$route.params.hotelID
        this.searchRoomAndPlan(0)
        const hotelDetails = await this.getHotelDetail({
          hotelID,
          fullLang: this.fullLang
        }).then((data) => {
          this.getHotelSettings(data.triplabot_code)
        })

        this.getHotelDetailV2({
          TargetLanguage: this.langForGetHotelDetail(this.fullLang),
          HotelID: hotelID,
          IsClearCache: false,
          fullLang: this.fullLang
        })

        this.getHotelReviews({
          hotelID,
          countryCode: this.fullLang,
          TargetLanguage: this.langForGetHotelDetail(this.fullLang)
        })

        this.pageTitle = hotelDetails?.name || ''
      }
    },

    hotelSelected(hotel) {
      if (hotel) {
        this.$gtm.push({
          triggerType: 'Page Load',
          eeAction: 'eeProductDetail',
          language: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          products: [
            {
              brand: MYSTAYS_BRAND_ID,
              category: this.hotelSelected.prefecture,
              checkInDate: this.checkin,
              checkOutDate: this.is_day_use ? this.checkin : this.checkout,
              id: this.hotelSelected.triplaHotelId,
              name: this.hotelSelected.name,
              numberOfAdult: this.numberAdults,
              numberOfChildren: this.numberChildren,
              numberOfDaysToCheckIn: this.numberOfDaysToCheckIn
            }
          ]
        })
      }
    },

    roomListAPI(roomList) {
      if (this.$route.query.from === 'mystays') {
        if (roomList?.length) {
          this.saveRoomParamsForGetRoomSelected()
          const room = roomList[0]
          const plan = roomList[0].subContent[0]
          this.saveRoomInfo([{ room, plan }])
        }
      }
    }
  },
  created() {
    const { search_type, nights } = this.$route.query

    if (search_type === 'undated' && nights) {
      this.saveIsUndated(true)
    } else {
      this.saveIsUndated(false)
    }
    const fullPath = this.$route.fullPath
    const hotelID = this.$route.params.hotelID
    const query = this.$route.query
    this.closeAll()
    this.saveSortRoomBy('price_low_to_high')
    this.updateBooking(query, hotelID)
    this.saveFullPathHotelDetail({ fullPath, hotelID })
    this.callAPI(hotelID)
    this.saveRoomAndPlanCode(query)
    this.onChangeTab()
  },
  mounted() {
    const hotelID = this.$route.params.hotelID
    const checkIndate = this.$route.query.checkIndate

    if (checkIndate) {
      this.getCheckin(checkIndate)
    }

    this.gtmData()
    this.scrollToTop()
    this.showCancelReservation(true)
    this.showRoomSelectComponent()
    this.clearRoomSelected()
    this.getBookingId(hotelID)
    this.onReceiveEvent()
    this.saveAdditionalParams([])
  },
  destroyed() {
    this.closeAll()
    this.a_toggleSidebar(false)
    this.resetRoomTypeCode()
    this.offReceiveEvent()
  },
  methods: {
    ...mapActions({
      closeAll: 'booking/closeAll',
      showCancelReservation: 'appAuthen/showCancelReservation',
      searchRoom: 'hotelDetail/searchRoom',
      getHotelDetail: 'hotelDetail/getHotelDetail',
      clearRoomSelected: 'hotelDetail/clearRoomSelected',
      saveRoomPlanCode: 'hotelDetail/saveRoomPlanCode',
      saveFullPathHotelDetail: 'hotel/saveFullPathHotelDetail',
      getTiersList: 'hotel/getTiersList',
      showRoomSelect: 'booking/showRoomSelect',
      getHotelReviews: 'hotelDetail/getHotelReviews',
      updateBookingStatus: 'hotelDetail/updateBookingStatus',
      getReservations: 'booking/getReservations',
      getBookingId: 'booking/getBookingId',
      clearHotelDetail: 'hotelDetail/clearHotelDetail',
      changeTab: 'hotelDetail/changeTab',
      a_toggleSidebar: 'hotelDetail/a_toggleSidebar',
      getHotelDetailV2: 'hotelDetail/getHotelDetailV2',
      saveRoomInfo: 'hotelDetail/a_saveRoomInfo',
      saveRoomParamsForGetRoomSelected:
        'booking/saveRoomParamsForGetRoomSelected',
      saveRoomWhenHaveNoData: 'hotelDetail/saveRoomWhenHaveNoData',
      resetRoomTypeCode: 'booking/resetRoomTypeCode',
      saveAdditionalParams: 'guestDetail/saveAdditionalParams',
      getHotelSettings: 'hotelDetail/getHotelSettings',
      saveSortRoomBy: 'hotelDetail/saveSortRoomBy',
      saveUseDayParamsFromBooking: 'booking/saveUseDayParamsFromBooking',
      handleGetHotelPrice: 'hotel/getHotelPrice',
      getCheckin: 'booking/getCheckin',
      saveIsUndated: 'booking/saveIsUndated'
    }),

    getPriceParams(hotel_codes) {
      const roomList = this.bookingData?.roomList
      const roomMapper = roomList?.map((room) => {
        return {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          adults: room.adults.number,
          children: room.children.childrenList.length,
          kids_age_range: []
        }
      })
      const query = {
        rooms: roomMapper,
        is_including_max_of_lowest_price_next_30_days: false,
        is_including_lowest_price: true,
        page: 1,
        per_page: 5,
        hotel_codes
      }

      return query
    },

    gtmData() {
      this.$gtm.push({
        ...(this.isPageLoaded && { event: 'virtualPageview' }),
        triggerType: 'Page Load',
        locale: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        userId: this.isLogin ? this.users.id : '',
        loginStatus: this.isLogin
      })
    },

    langForGetHotelDetail(language) {
      let lang = language
      if (language === 'en-US') {
        lang = 'en'
      }

      switch (language) {
        case 'en-US':
          lang = 'en'
          break
        case 'ja':
          lang = 'ja-JP'
          break
        case 'ko':
          lang = 'ko-KR'
          break
        case 'zh':
          lang = 'zh-CN'
          break
        case 'tw':
          lang = 'zh-TW'
          break
        default:
          break
      }

      return lang
    },

    onChangeTab() {
      const type = this.$route.query.type

      if (!type) {
        this.changeTab({
          currentTab: 'room',
          currentId: ''
        })

        return
      }

      if (type === 'plans') {
        this.changeTab({
          currentTab: 'plan',
          currentId: ''
        })
      } else if (type === 'rooms') {
        this.changeTab({
          currentTab: 'room',
          currentId: ''
        })
      }
    },

    showRoomSelectComponent() {
      if (
        this.tiers?.kids_setting &&
        this.isKidsTierSupport &&
        !this.isSelectedAge
      ) {
        this.showRoomSelect()
      }
    },

    saveRoomAndPlanCode(query) {
      const roomPlanCode = {
        roomCode: query.roomCode,
        planCode: query.planCode
      }
      this.saveRoomPlanCode(roomPlanCode)
    },

    scrollToTop() {
      const query = this.$route.query
      if (
        !(query.bypass_token && query.email && query.reservationID && query.tab)
      ) {
        window.scrollTo({
          top: 0,
          left: 0
        })
      }
    },

    onReceiveEvent() {
      this.$nuxt.$on('onChangeLanguage', () => {
        this.isChangeLanguage = true
      })

      this.$nuxt.$on('calendar-mobile-click-done', this.$_closeAll)
    },

    offReceiveEvent() {
      this.$nuxt.$off('onChangeLanguage', () => {
        this.isChangeLanguage = true
      })

      this.$nuxt.$off('calendar-mobile-click-done', this.$_closeAll)
    },

    updateBooking(query, hotelID) {
      if (query.bypass_token && query.email && query.reservationID) {
        this.updateBookingStatus(true)
        const params = {
          hotelID,
          reservationID: query.reservationID,
          byPassToken: query.bypass_token,
          email: query.email,
          lang: this.lang
        }
        this.getReservations(params)
        // this.findRoom();
      } else {
        this.updateBookingStatus(false)
      }
    },

    callAPI(hotelID) {
      if (this.$route.query.is_day_use === 'true') {
        this.saveUseDayParamsFromBooking(true)
      }
      if (process.browser) {
        this.getHotelDetail({
          hotelID
        }).then((data) => {
          this.getHotelSettings(data.triplabot_code)
        })

        this.getHotelReviews({
          hotelID,
          countryCode: this.fullLang,
          TargetLanguage: this.langForGetHotelDetail(this.fullLang)
        })
        this.getHotelDetailV2({
          TargetLanguage: this.langForGetHotelDetail(this.fullLang),
          HotelID: hotelID,
          IsClearCache: false,
          fullLang: this.fullLang
        })
        if (this.tiers?.kids_setting?.kids_type) {
          this.searchRoomAndPlan(0)
        } else {
          this.getTiersList(hotelID)
        }
      }
    },

    findRoom() {
      const roomAndPlan = document.querySelector('#plantab')
      if (roomAndPlan) {
        roomAndPlan.click()
      }
    },

    buildParams(type, roomIndex) {
      const { search_type } = this.$route.query
      if (this.bookingDataFromStore.is_undated && search_type === 'undated') {
        return this.buildParamsUndated(type, roomIndex)
      }

      return this.buildParamsNotUndated(type, roomIndex)
    },

    buildParamsNotUndated(type, roomIndex) {
      const hotelID = this.$route.params && this.$route.params.hotelID
      const room_type_codes = this.$route.query.room_type_codes
        ? this.$route.query.room_type_codes.split(',')
        : null
      const room_plan_codes = this.$route.query.room_plan_codes
        ? this.$route.query.room_plan_codes.split(',')
        : null

      const room_search_filters = this.$route.query.room_search_filters
        ? this.$route.query.room_search_filters.split(',')
        : null

      const { is_day_use, is_including_occupied } = this.$route.query

      const params = {
        queryString: {
          checkin_date: this.checkin,
          checkout_date: this.is_day_use ? this.checkin : this.checkout,
          type,
          rooms: this.isKidsTierSupport
            ? [this.roomListWithChildren[roomIndex]]
            : [this.roomListWithoutChildren[roomIndex]],
          coupon_code: this.promoCode,
          order: this.sortByValue,
          bookable: 'skip',
          ...(is_including_occupied && { is_including_occupied }),
          ...(is_day_use && { is_day_use }),
          ...(this.$route.query.room_type_codes && { room_type_codes }),
          ...(room_plan_codes && { room_plan_codes }),
          ...(room_search_filters && { room_search_filters })
        },
        hotel_id: hotelID,
        type: 'plants'
      }

      return params
    },

    buildParamsUndated(type, roomIndex) {
      const hotelID = this.$route.params && this.$route.params.hotelID
      const { is_including_occupied, search_type, nights } = this.$route.query

      return {
        queryString: {
          type,
          rooms: this.isKidsTierSupport
            ? [this.roomListWithChildren[roomIndex]]
            : [this.roomListWithoutChildren[roomIndex]],
          coupon_code: this.promoCode,
          order: this.sortByValue,
          bookable: 'skip',
          ...(is_including_occupied && { is_including_occupied }),
          ...(search_type && { search_type }),
          ...(nights ? { nights } : { nights: this.totalNight })
          // search_type: 'undated'
          // ...(room_search_filters && { room_search_filters })
        },
        hotel_id: hotelID,
        type: 'plants'
      }
    },

    $_onApply() {
      if (this.isBookingDataChange) {
        this.onSetBookingDataToRouter()
        this.clearRoomSelected()
        this.findRoom()
        if (this.nearbyHotels.length) {
          const hotel_codes = this.nearbyHotels.map(
            item => item.triplaBookingCode
          )

          this.handleGetHotelPrice(this.getPriceParams(hotel_codes))
        }
        this.isBookingDataChange = false
      } else {
        this.isBookingDataChange = false
        this.closeAll()
      }
    },

    $_closeAll() {
      if (this.isBookingDataChange) {
        this.onSetBookingDataToRouter()
        this.findRoom()
        if (this.isKidsTierSupport) {
          if (this.isSelectedAge) {
            this.closeAll()
          } else {
            this.$nuxt.$emit('onCloseOverlay')
          }
        } else {
          this.closeAll()
        }
        this.isBookingDataChange = false
      } else {
        this.isBookingDataChange = false
        if (this.isKidsTierSupport) {
          if (this.isSelectedAge) {
            this.closeAll()
          } else {
            this.$nuxt.$emit('onCloseOverlay')
          }
        } else {
          this.closeAll()
        }
      }

      this.$gtm.push({
        event: 'bookNowHome',
        checkInDate: this.checkin,
        checkOutDate: this.checkout,
        productCoupon: this.promoCode,
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        searchTerm: this.searchKeyword,
        numberOfAdult: this.numberAdults,
        numberOfChildren: this.numberChildren,
        numberOfRooms: this.roomListFromBookingData.length,
        triggerType: 'User Interaction'
      })
    },

    onSetBookingDataToRouter() {
      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingDataFromStore, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },

    searchRoomWhenHaveNoRoom(type, roomIdx) {
      const queryString = {
        ...this.buildParams(type, roomIdx).queryString,
        rooms: [{ adults: 2, children: 0, kids_tiers: [] }]
      }
      const buildParams = {
        ...this.buildParams(type, roomIdx),
        queryString
      }

      this.searchRoom(buildParams)
    },

    searchRoomAndPlan(roomIdx) {
      this.saveRoomWhenHaveNoData(null)
      if (this.checkin && this.checkout) {
        this.searchRoom(this.buildParams('rooms', roomIdx)).then((resp) => {
          if (!resp.length) {
            this.searchRoomWhenHaveNoRoom('rooms', roomIdx)
            this.saveRoomWhenHaveNoData({
              adults: 2,
              children: 0,
              kids_tiers: []
            })
          }
        })
        this.searchRoom(this.buildParams('plan', roomIdx)).then((resp) => {
          if (!resp.length) {
            this.searchRoomWhenHaveNoRoom('plan', roomIdx)
            this.saveRoomWhenHaveNoData({
              adults: 2,
              children: 0,
              kids_tiers: []
            })
          }
        })
      }
    }
  },

  head() {
    return {
      title: `${this.pageTitle || this.hotelDetail?.name || ''} | ${this.$t(
        'general.my_stays_title'
      )}`,
      meta: [
        {
          hid: 'title',
          name: 'title',
          property: 'title',
          content: this.pageTitle
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: this.pageTitle
        },
        {
          hid: 'description',
          name: 'description',
          property: 'description',
          content: this.hotelDesc.overview
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: this.hotelDesc.overview
        },
        {
          hid: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'company'
        },
        {
          hid: 'og:image',
          name: 'og:image',
          property: 'og:image',
          content: this.hotelDesc.image
        },
        {
          hid: 'og:locale',
          name: 'og:locale',
          property: 'og:locale',
          content: this.$i18n.locale
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          property: 'og:site_name',
          content: 'PHASE2.BOOKING.MYSTAYS.com'
        },
        {
          hid: 'og:url',
          name: 'og:url',
          property: 'og:url',
          content: 'https://phase2.booking.mystays.com' + this.$route.fullPath
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://phase2.booking.mystays.com' + this.$route.fullPath
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail {
  background: #ffffff;
  // scroll-behavior: smooth;
  &__overlay {
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.95;
    width: 100%;
    z-index: 11;
    height: 100%;
    background: #232e48;
    @include min-sm {
      background: #232e48;
    }
  }
}
</style>

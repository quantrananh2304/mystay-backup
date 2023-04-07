<template>
  <div class="guest-detail-page">
    <HotelNavigationBar
      :is-selected-hotel="isSelectedHotel"
      :is-login="isAuthened"
      :current-step="currentStep"
      :is-show-back-to-search-result="isShowBackToSearchResult"
    />
    <CompareBooking />
    <section
      v-if="pageLoaded"
      class="guest-detail"
      :class="{ 'is-update-booking': isUpdateBooking }"
    >
      <div class="container-page">
        <h1>{{ getLang.guestDetail }}</h1>
        <div class="guest-detail-section">
          <GuestDetailInfo :is-authened="isAuthened" />
          <GuestDetailPayment :is-authened="isAuthened" />
        </div>
      </div>
      <GuestDetailButton />
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { MYSTAYS_BRAND_ID } from '../shared/constants'
export default Vue.extend({
  name: 'GuestDetail',
  fetch() {
    this.getMystaysToken()
  },
  data() {
    return {
      isAuthened: true,
      isSelectedHotel: true,
      currentStep: 4,
      isShowBackToSearchResult: true,
      pageLoaded: false
    }
  },
  onIdle() {
    this.$router
      .push({
        path: `/hotel/${this.hotelID}`,
        query: this.hotelDetailRouteParams
      })
      .catch(() => {})
  },
  computed: {
    ...mapState({
      hotelID: state => state.hotel.data.hotelID,
      bookingData: state => state.booking.bookingData,
      roomSelected: state => state.hotelDetail.selectedRoom,
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking,
      fullPathHotelDetail: state => state.hotel.data.fullPathHotelDetail,
      selectedRoom: state => state.hotelDetail.selectedRoom,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI
    }),
    ...mapGetters({
      roomListWithChildren: 'booking/roomListWithChildren',
      totalPrice: 'hotelDetail/totalPriceWithoutTax',
      adults: 'booking/numberAdults',
      children: 'booking/numberChildren',
      isKidsTierSupport: 'hotel/isKidsTierSupport',
      roomListWithoutChildren: 'booking/roomList',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      roomList: 'booking/roomList',
      hotelSelected: 'hotel/hotelSelected',
      roomSelectedParams: 'booking/roomSelectedParams',
      hotelDetailRouteParams: 'booking/hotelDetailRouteParams',
      hotelDetail: 'hotelDetail/hotelDetail',
      users: 'users/userData'
    }),
    getLang() {
      return {
        guestDetail: this.$t('guest_detail.guest_detail'),
        backToReview: this.$t('guest_detail.back_to_review')
      }
    },

    rooms() {
      if (this.isKidsTierSupport) {
        return (
          this.roomSelectedFromAPI &&
          this.roomSelectedFromAPI.rooms &&
          this.roomSelectedFromAPI?.rooms?.map((room) => {
            return {
              checkin_date: this.roomSelectedFromAPI.checkin_date,
              checkout_date: this.roomSelectedFromAPI.checkout_date,
              room_count: 1,
              room_type_code: room.room_type_code,
              room_plan_code: room.room_plan_code,
              adults: room.adults,
              children: room.children,
              kids_age_range: room.kids_age_range
            }
          })
        )
      } else {
        return this.roomListWithoutChildren?.map((room, index) => {
          return {
            checkin_date: this.roomSelectedFromAPI.checkin_date,
            checkout_date: this.roomSelectedFromAPI.checkout_date,
            room_count: 1,
            room_type_code: this.roomSelected[index]?.room?.roomId,
            room_plan_code:
              this.roomSelected[index]?.plan?.roomPlanCode ||
              this.roomSelected[index]?.room?.roomPlanCode,
            adults: room.adults,
            children: room.children,
            kids_age_range: null
          }
        })
      }
    }
  },
  watch: {
    users(users) {
      if (users) {
        this.guestDetailGtm()
      }
    }
  },
  mounted() {
    this.pageLoaded = true
    this.scrollToTop()
    this.showCancelReservation(false)
    this.getExtras(this.getExtrasParams())
    this.getAdditionalQuestion(this.getAdditionalQuestionParams())
    this.guestDetailGtm()
    this.checkHaveRoomDetail()
  },
  methods: {
    ...mapActions({
      showCancelReservation: 'appAuthen/showCancelReservation',
      getExtras: 'guestDetail/getExtras',
      getAdditionalQuestion: 'guestDetail/getAdditionalQuestion',
      getHotelDetail: 'hotelDetail/getHotelDetail',
      saveGuestDetailData: 'guestDetail/saveGuestDetailData',
      getRoomSelected: 'hotelDetail/getRoomSelected'
    }),

    async getMystaysToken() {
      const headers = {
        UserName: 'sitecore\\InternalApiUser',
        Password: 'InternalApiUser',
        Audience: 'https://phase2.booking.mystays.com'
      }

      if (!this.$cookiz.get('mystays-token')) {
        const rs = await this.$api.get(
          '/api/core/CoreAuthentication/GenerateToken',
          {
            headers
          }
        )

        if (rs && rs.data) {
          this.$cookiz.set('mystays-token', rs.data.token, {
            path: '/',
            expires: new Date(rs.data.expired)
          })
          this.$api.setHeader('authorization', rs.data.token)
        }
      }
    },

    checkHaveRoomDetail() {
      if (!this.roomSelected.length) {
        if (this.fullPathHotelDetail) {
          this.$router.push(this.fullPathHotelDetail)
        } else {
          this.$router.push('/')
        }
      }
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

    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0
      })
    },

    guestDetailGtm() {
      const products =
        this.roomSelectedFromAPI &&
        this.roomSelectedFromAPI?.rooms?.map((room) => {
          return {
            brand: MYSTAYS_BRAND_ID,
            category: this.hotelSelected.prefecture,
            checkInDate: this.roomSelectedFromAPI.checkin_date,
            checkOutDate: this.roomSelectedFromAPI.checkout_date,
            coupon: this.bookingData.promoCode,
            id: this.hotelID,
            name: this.hotelID,
            numberOfAdult: room.adults,
            numberOfChildren: room.children,
            numberOfRooms: this.roomList.length,
            numberOfDaysToCheckIn: this.roomSelectedFromAPI
              .number_of_days_to_checkin,
            price: room.total_price,
            quantity: this.roomSelectedFromAPI.nights,
            roomId: room.room_type_code,
            roomName: room.room_type_name,
            roomSize: room.room_size.value,
            roomType: room.room_type_name,
            planId: room.room_plan_code,
            planName: room.room_plan_name
          }
        })

      const gmtData = {
        triggerType: 'Page Load',
        ...(this.isPageLoaded && { event: 'virtualPageview' }),
        eeAction: 'eeCheckout',
        checkoutStep: '1',
        userId: this.users?.id || '',
        pageCategory: this.$route.name,
        products
      }

      this.$gtm.push(gmtData)
    },

    getExtrasParams() {
      const params = {
        hotelID: this.hotelID,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.isKidsTierSupport ? this.children : 0,
          mode: 'standard',
          adults: this.adults,
          total_price_without_tax: this.totalPrice,
          rooms: this.rooms
        },
        fullLang: this.fullLang
      }
      return params
    },

    roomSelectedParam(lang) {
      return {
        hotelID: this.hotelID,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.children,
          mode: 'standard',
          adults: this.adults,
          total_price_without_tax: this.totalPrice,
          rooms: this.roomSelectedParams
        },
        fullLang: lang
      }
    },

    getAdditionalQuestionParams() {
      const params = {
        hotelID: this.hotelID,
        queryString: {
          label_filters: [
            {
              labels: ['place_booking_process']
            }
          ]
        },
        room_plan_code: this.rooms && this.rooms[0].room_plan_code,
        fullLang: this.fullLang
      }
      return params
    }
  },
  head() {
    return {
      title: this.$t('general.guest_detail_page_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mystays Hotel'
        }
      ]
    }
  }
})
</script>
<style lang="scss" scoped>
.is-update-booking {
  padding-top: 20px;
}

.guest-detail-page {
  min-height: calc(100vh - 78px);
  background: $white;
}

.guest-detail {
  padding-top: 30px;
  @include min-xl {
    padding-top: 75px;
    padding-bottom: 100px;
  }
  h1 {
    font-size: 30px;
    color: $text-color-blue;
    font-weight: bold;
    margin-bottom: 20px;
    width: 100%;
    @include min-md {
      margin: 0 auto 20px auto;
    }
    @include min-xl {
      width: 656px;
      width: auto;
      margin: 0 0 20px 0;
    }
  }
  p,
  label {
    font-size: 14px;
    color: $text-color-blue;
    line-height: 17px;
    margin-bottom: 0;
    &.is-bold {
      font-weight: bold;
    }
  }
  a {
    font-size: 20px;
    color: $bg-color-blue;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    @include min-sm {
      display: none;
    }
    [class^='icon-'],
    [class*=' icon-'] {
      margin-right: 15px;
    }
  }
  &-section {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    @include min-xl {
      flex-direction: row;
      align-items: flex-start;
    }
  }
}
</style>

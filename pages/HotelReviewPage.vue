<template>
  <div class="hotel-review">
    <HotelNavigationBar
      v-if="loadedPage"
      :is-selected-hotel="isSelectedHotel"
      :current-step="currentStep"
      :is-show-back-to-search-result="isShowBackToSearchResult"
    />
    <CompareBooking />
    <LazyHotelReviewStay />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default Vue.extend({
  name: 'HotelReview',
  data() {
    return {
      isSelectedHotel: true,
      currentStep: 3,
      isShowBackToSearchResult: true,
      loadedPage: false
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
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking,
      fullPathHotelDetail: state => state.hotel.data.fullPathHotelDetail,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI
    }),
    ...mapGetters({
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      roomDetails: 'hotelDetail/roomDetails',
      hotelDetail: 'hotelDetail/hotelDetail',
      roomSelectedParams: 'booking/roomSelectedParams',
      totalPriceWithoutTax: 'hotelDetail/totalPriceWithoutTax',
      hotelDetailRouteParams: 'booking/hotelDetailRouteParams',
      numberAdultsInRoomSelected: 'booking/numberAdultsInRoomSelected',
      numberChildrenInRoomSelected: 'booking/numberChildrenInRoomSelected',
      users: 'users/userData',
      hotelSelected: 'hotel/hotelSelected',
      numberOfDaysToCheckIn: 'booking/numberOfDaysToCheckIn'
    }),

    roomPlanCode() {
      if (this.roomDetails?.length) {
        return this.roomDetails[0]?.roomPlanCode
      }

      return ''
    }
  },
  watch: {
    roomSelectedFromAPI(roomSelectedFromAPI) {
      if (roomSelectedFromAPI) {
        const firstRoom = roomSelectedFromAPI.rooms[0]

        this.$gtm.push({
          event: 'bookingReview',
          triggerType: 'Page Load',
          language: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          hotelID: this.hotelID,
          roomID: firstRoom.room_type_code,
          planID: firstRoom.room_plan_code,
          checkInDate: roomSelectedFromAPI.checkin_date,
          checkOutDate: roomSelectedFromAPI.checkout_date,
          numberOfAdults: roomSelectedFromAPI.adults,
          numberOfChildren: roomSelectedFromAPI.children,
          numberOfDaysToCheckIn: roomSelectedFromAPI.number_of_days_to_checkin
        })
      }
    }
  },
  mounted() {
    this.scrollToTop()
    this.gtmData()
    this.showCancelReservation(false)
    this.checkHaveRoomDetail()
    this.loadedPage = true
  },
  methods: {
    ...mapActions({
      showCancelReservation: 'appAuthen/showCancelReservation',
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies',
      getRoomSelected: 'hotelDetail/getRoomSelected',
      getHotelDetail: 'hotelDetail/getHotelDetail'
    }),

    checkHaveRoomDetail() {
      if (!this.roomDetails.length) {
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

    buildParams(lang) {
      return {
        hotelID: this.hotelID,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.numberChildrenInRoomSelected,
          mode: 'standard',
          adults: this.numberAdultsInRoomSelected,
          total_price_without_tax: this.totalPriceWithoutTax,
          rooms: this.roomSelectedParams,
          coupon_code: this.bookingData.promoCode,
          type: this.bookingData.type
        },
        fullLang: lang
      }
    }
  },
  head() {
    return {
      title: this.$t('general.summary_page_title'),
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
.hotel-review {
  background: #ffffff;
  min-height: 100vh;
}
</style>

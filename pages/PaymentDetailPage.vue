<template>
  <LazyPayment />
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'PaymentDetail',
  middleware: 'backGuestPage',
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
      fullPathHotelDetail: state => state.hotel.data.fullPathHotelDetail,
      hotelID: state => state.hotel.data.hotelID,
      bookingData: state => state.booking.bookingData,
      roomSelected: state => state.hotelDetail.selectedRoom
    }),
    ...mapGetters({
      roomListWithChildren: 'booking/roomListWithChildren',
      totalPrice: 'hotelDetail/totalPriceWithoutTax',
      adults: 'booking/numberAdults',
      children: 'booking/numberChildren',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      roomSelectedParams: 'booking/roomSelectedParams',
      hotelDetailRouteParams: 'booking/hotelDetailRouteParams',
      hotelDetail: 'hotelDetail/hotelDetail',
      users: 'users/userData'
    })
  },
  watch: {
    fullLang(lang) {
      this.getHotelDetail({ hotelID: this.hotelID, fullLang: lang })
      this.getRoomSelected(this.roomSelectedParam(lang))
    }
  },
  mounted() {
    this.scrollToTop()
    this.checkHaveRoomDetail()
  },
  methods: {
    ...mapActions({
      getHotelDetail: 'hotelDetail/getHotelDetail',
      getRoomSelected: 'hotelDetail/getRoomSelected'
    }),

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
      if (this.users) {
        this.$gtm.push({
          ...(this.isPageLoaded && { event: 'virtualPageview' }),
          triggerType: 'Page Load',
          locale: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          userId: this.isLogin ? this.users.id : '',
          loginStatus: this.isLogin
        })
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0
      })
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
    }
  },
  head() {
    return {
      title: this.$t('general.payment_page_title'),
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

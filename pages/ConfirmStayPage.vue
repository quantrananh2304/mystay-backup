<template>
  <section class="confirm-stay-page">
    <AppHeader />
    <HotelNavigationBarStep :current-step="currentStep" />
    <LazyConfirmStay />
  </section>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { decodeBase64 } from '../shared/helper/base64'

export default Vue.extend({
  name: 'ConfirmStayPage',
  data() {
    return {
      isSelectedHotel: true,
      currentStep: 6,
      isScroll: true,
      isShowBackToSearchResult: true,
      isChangeLanguage: false
    }
  },
  computed: {
    ...mapGetters({
      reservationsData: 'booking/reservationsData',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      hotelDetail: 'hotelDetail/hotelDetail'
    }),

    hotelID() {
      const { hotel_id, code } = this.$route.query

      return Number(hotel_id) || code
    },

    reservationQuestionParams() {
      return {
        hotelID: this.hotelID,
        reservationID: this.reservationsData?.reservation_number,
        byPassToken: this.reservationsData?.bypass_token,
        email: this.reservationsData?.email,
        fullLang: this.fullLang,
        q: {
          label_filters: [
            { labels: ['place_confirmation_screen'] },
            { labels: ['place_booking_process'] }
          ]
        }
      }
    },

    langForGetHotelDetail() {
      let lang = this.fullLang
      if (this.fullLang === 'en-US') {
        lang = 'en'
      }

      return lang
    }
  },
  watch: {
    fullLang() {
      if (this.isChangeLanguage) {
        this.getReservations(this.reservationParams())
        this.getHotelDetail({
          hotelID: this.hotelID
        })

        this.getHotelDetailV2({
          TargetLanguage: this.langForGetHotelDetail,
          HotelID: this.hotelID,
          IsClearCache: false
        })
      }
    },

    reservationQuestionParams(params) {
      if (params.reservationID) {
        this.getReservationQuestion(this.reservationQuestionParams)
      }
    }
  },
  mounted() {
    this.initCallApi()
    this.scrollToTop()
    this.showCancelReservation(true)
    this.updateBookingStatus(false)
    this.$nuxt.$on('onChangeLanguage', this.onChangeLanguage)
    this.clearRoomSelected()
  },

  beforeDestroy() {
    this.$nuxt.$off('onChangeLanguage', this.onChangeLanguage)
  },

  methods: {
    ...mapActions({
      showCancelReservation: 'appAuthen/showCancelReservation',
      getSettingReservations: 'booking/getSettingReservations',
      updateBookingStatus: 'hotelDetail/updateBookingStatus',
      getReservations: 'booking/getReservations',
      getHotelDetail: 'hotelDetail/getHotelDetail',
      saveUrlParamsReservations: 'booking/saveUrlParamsReservations',
      saveHotelID: 'hotel/saveHotelID',
      getHotelDetailV2: 'hotelDetail/getHotelDetailV2',
      getReservationQuestion: 'confirmBooking/getReservationQuestion',
      clearRoomSelected: 'hotelDetail/clearRoomSelected'
    }),

    onChangeLanguage() {
      this.isChangeLanguage = true
    },

    initCallApi() {
      this.getReservations(this.reservationParams())
      this.getHotelDetail({
        hotelID: this.hotelID,
        fullLang: this.fullLang
      })

      this.getHotelDetailV2({
        TargetLanguage: this.langForGetHotelDetail,
        HotelID: this.hotelID,
        IsClearCache: false
      })

      this.getSettingReservations(this.reservationParams())

      this.saveUrlParamsReservations(this.reservationParams())
      this.saveHotelID(this.hotelID)
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0
      })
    },

    reservationParams() {
      const { bypass_token, email } = this.$route.query
      const { reservationID } = this.$route.params

      const params = {
        hotelID: this.hotelID,
        reservationID,
        byPassToken: bypass_token,
        email: email.includes('@') ? email : decodeBase64(email),
        fullLang: this.fullLang
      }

      return params
    }
  },

  head() {
    return {
      title: this.$t('general.confirm_page_title'),
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
.confirm-stay-page {
  background: #ffffff;
  min-height: 100vh;
}
</style>

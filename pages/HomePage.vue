<template>
  <div class="home-page">
    <div class="app-container">
      <AppHeader />
      <Booking />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'HomePage',
  computed: {
    ...mapState({
      hotelFilter: state => state.hotel.data.hotelFilter,
      access_token: state => state.customer.auth.data.access_token
    }),
    ...mapGetters({
      myLocation: 'general/myLocation',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      users: 'users/userData',
      totalNight: 'booking/totalNight'
    })
  },
  created() {
    this.closeAll()
    this.clearHotelDetail()
    this.routeToHotelDetail()
  },
  mounted() {
    this.gtmData()
    this.saveFullPath('')
    this.saveHotelID('')
    this.showCancelReservation(true)

    const fullPath = decodeURIComponent(this.$route.fullPath)
    const isResetPassword = fullPath.split('reset_password_token=')[1]

    if (isResetPassword) {
      this.toggleLogin({ isLoginOpen: true })
      this.getRessetPasswordToken(isResetPassword)
      this.goToRessetPasswordConfirm()
    }
  },
  methods: {
    ...mapActions({
      closeAll: 'booking/closeAll',
      saveFullPath: 'hotel/saveFullPath',
      toggleLogin: 'appAuthen/toggleLogin',
      filterHotelList: 'hotel/filterHotelList',
      clearHotelDetail: 'hotelDetail/clearHotelDetail',
      getMemberConfimation: 'users/getMemberConfimation',
      getRessetPasswordToken: 'users/getRessetPasswordToken',
      showCancelReservation: 'appAuthen/showCancelReservation',
      goToRessetPasswordConfirm: 'appAuthen/goToRessetPasswordConfirm',
      saveHotelID: 'hotel/saveHotelID'
    }),

    routeToHotelDetail() {
      const query = this.$route.query
      if (query.checkin && query.checkout) {
        const room = {
          id: '',
          adults: { title: 'Adults', number: Number(query.adults) },
          children: {
            title: 'Children',
            childrenList: []
          }
        }

        const rooms = []
        for (
          let roomIndex = 0;
          roomIndex < Number(query.room_count);
          roomIndex++
        ) {
          rooms.push(room)
        }

        this.$router.push({
          path: `/hotel/${query.code}`,
          query: {
            checkIndate: query.checkin,
            checkOutdate: query.checkout,
            language: query.locale,
            coupon_code: query.coupon_code,
            is_day_use: query.is_day_use,
            is_including_occupied: query.is_including_occupied,
            tab: '',
            type: query.type,
            rooms: JSON.stringify(rooms),
            nights: this.totalNight
          }
        })
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
    }
  },
  head() {
    return {
      title: this.$t('general.home_page_title'),
      meta: [
        {
          hid: 'title',
          name: 'title',
          property: 'title',
          content: this.$t('general.home_page_title')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: this.$t('general.home_page_title')
        },
        {
          hid: 'description',
          name: 'description',
          property: 'description',
          content: this.$t('general.home_page_description')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: this.$t('general.home_page_description')
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
          content:
            'https://d2ahiw9kb7is19.cloudfront.net/-/media/Mystays/Destinations/Tokyo.jpg?d=20170904T194523'
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
          content: 'https://phase2.booking.mystays.com'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://phase2.booking.mystays.com'
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  flex: 1;
  width: 100%;
  display: flex;

  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>

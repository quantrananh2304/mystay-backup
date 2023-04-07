<template>
  <div class="main-layout">
    <PageLoader v-show="isPageLoading && !$nuxt.isOffline" />
    <!-- <HeaderComponent /> -->
    <HeaderNavTop v-if="isShowHeaderTop" @changeLanguage="changeLanguage" />
    <HeaderSearchBox
      :is-show-search-box="isShowSearchBox"
      @hideSearchBox="hideSearchBox"
    />

    <!-- Login/ Signup Section -->
    <HeaderNavLogin class="login-sidebar" />
    <HeaderNavSignup class="signup-sidebar" />

    <!-- Main Section -->
    <nuxt />

    <!-- Footer Section -->
    <AppFooter />

    <!-- Alert client status -->
    <b-alert
      v-model="$nuxt.isOffline"
      class="position-fixed fixed-bottom m-0 rounded-0"
      style="z-index: 2000"
      variant="warning"
      dismissible
    >
      You are Offline!
    </b-alert>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import SecureLS from 'secure-ls'
import { ToastPlugin } from 'bootstrap-vue'
import Utilities from '@/shared/helper/utilities'
import { guestInfo } from '@/shared/helper/guestInfo'
import { STATIC_PASSWORD } from '@/shared/constants'
import { checkLanguage } from '~/shared/helper/checkLanguage'
import { defaultLanguage, STATIC_HOTEL_ID } from '~/shared/constants'

Vue.use(ToastPlugin)

export default {
  name: 'DefaultLayout',
  asyncData({ $cookiz }) {
    return {
      isPageLoading: true,
      authorization: $cookiz.get('_authorization')
    }
  },

  data() {
    return {
      isReady: false,
      isBookingDataChange: false,
      isOpenBooking: false,
      title: '',
      pageLoaded: undefined,
      isChangeLanguage: false,
      isPageLoading: true
    }
  },

  computed: {
    ...mapState({
      localeMessages: state => state.general.data.locale.messages,
      isConfirmationSuccess: state => state.users.data.isConfirmationSuccess,
      bookingState: state => state.booking.bookingState,
      bookingData: state => state.booking.bookingData,
      access_token: state => state.customer.auth.data.access_token,
      skeleton: state => state.general.data.skeleton,
      page_loading: state => state.general.data.page_loading,
      hotelFilter: state => state.hotel.data.hotelFilter,
      isShowSearchBox: state => state.appAuthen.isShowSearchBox,
      isHotelDetailV2Loading: state => state.hotelDetail.isHotelDetailV2Loading,
      userData: state => state.users.data.userData,
      checkin: state => state.booking.bookingData?.checkIn,
      checkout: state => state.booking.bookingData?.checkOut,
      roomListFromBookingData: state => state.booking.bookingData?.roomList,
      promoCode: state => state.booking.bookingData?.promoCode,
      tokenModel: state => state.appAuthen.tokenModel,
      location: state => state.booking.bookingData.location
    }),

    ...mapGetters({
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      myLocation: 'general/myLocation',
      userLocation: 'general/userLocation'
    }),

    bookingDataCustom() {
      return {
        roomList: this.roomListFromBookingData,
        checkIn: this.checkin,
        checkOut: this.checkout,
        promoCode: this.promoCode,
        location: this.location
      }
    },

    isOnline() {
      return this.$nuxt.isOnline
    },

    isShowHeaderTop() {
      const path = this.$route.path
      return (
        path !== this.$pageRoute.hotelReview &&
        path !== this.$pageRoute.guestDetail &&
        path !== this.$pageRoute.payment
      )
    },

    langForMystaysAPI() {
      let lang = this.$i18n.locale
      switch (lang) {
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
    }
  },
  watch: {
    $route() {
      this.pageLoaded = true
      this.savePageLoaded()
      if (process.browser && process.env.NODE_ENV === 'production') {
        this.authenticationMiddleware()
      }
    },

    tokenModel(tokenModel) {
      if (tokenModel) {
        this.$bvToast.toast(`${tokenModel.title}!`, {
          title: 'Login Fail',
          toaster: 'b-toaster-top-center',
          solid: true,
          appendToast: true,
          variant: 'danger'
        })
      }
    },

    bookingDataCustom: {
      handler() {
        if (this.isOpenBooking) {
          this.isBookingDataChange = true
        }
      },
      deep: true
    },

    location() {
      this.isBookingDataChange = true
    },

    isOnline(isOnline) {
      if (isOnline) {
        location.reload(true)
      } else {
        this.$scrollBody.enable()
      }
    },

    localeMessages() {
      this.setLocaleMess()
      const data = this.$route.query
      this.getDataFromUrl(data)
    },

    bookingState(bookingState) {
      const homePageRoute = this.$pageRoute.homePage
      if (
        (bookingState.checking ||
          bookingState.roomSelect ||
          bookingState.promoCode) &&
        this.$route.path !== homePageRoute
      ) {
        this.$scrollBody.disable()
      } else if (!this.isPageLoading) {
        this.$scrollBody.enable()
      }

      if (
        bookingState.roomSelect ||
        bookingState.promoCode ||
        bookingState.checking
      ) {
        this.isOpenBooking = true
      } else {
        this.isBookingDataChange = false
      }
    },

    bookingData: {
      handler(newData) {
        if (this.isBookingDataChange) {
          const path = this.$route.path
          if (path === this.$pageRoute.hotelsList) {
            this.$router
              .push({
                path,
                query: this.$hotelSearchQuery(newData, this.fullLang)
              })
              .catch(() => {})
          }
        }
      },
      deep: true
    },

    lang(lang) {
      this.$triplaApi.setHeader('tripla-locale', this.$langFormat(lang))

      this.title = this.$t('general.my_stays_title')

      if (this.userData) {
        const guest = guestInfo(this.userData, lang, this.$lang)
        this.saveGuestDataFromAPI([guest])
      }

      localStorage.removeItem('recent_search')
    },

    fullLang() {
      if (!this.userData) {
        this.resetGuestData()
      }
      this.setLocaleMess()

      this.saveFullPath()
    },

    userData(user) {
      if (user) {
        const guest = guestInfo(user, this.lang, this.$lang)
        this.saveGuestDataFromAPI([guest])
      } else {
        const guest = guestInfo(null, this.lang, this.$lang)
        this.saveGuestDataFromAPI([guest])
      }
    }
  },

  created() {
    this.getUrlData()
    this.initApplication()
    this.onRouteToConfirmBooking()
    this.routeToHotelDetail()
    this.getLocale('en-US')
    this.getLocation()

    if (process.browser) {
      this.$scrollBody.enable()
      this.onResize()
      // eslint-disable-next-line nuxt/no-globals-in-created
      window.addEventListener('resize', this.onResize)
    }

    if (this.authorization && !this.isLogin) {
      this.$store.dispatch('users/getUserDetail', STATIC_HOTEL_ID)
    }
  },
  mounted() {
    this.getHotelsList({
      ...this.userLocation,
      lang: this.langForMystaysAPI
    }).then(() => {
      this.$nuxt.$emit('on:CloseSearchBoxOverlay')
    })
    if (process.env.NODE_ENV === 'production') {
      this.authenticationMiddleware()
    }

    if (this.$nuxt.isOffline) {
      this.getHotelsList(
        JSON.stringify({ ...this.userLocation, lang: this.langForMystaysAPI })
      )
    }
    this.checkUpdate()
    this.setLocaleMess()
    this.getSetLocale()
    this.gtmData()

    this.$nuxt.$on('onChangeLanguage', this.onChangeLanguage)

    this.isPageLoading = false

    if (this.tokenModel) {
      this.openToast(this.tokenModel)
    }
  },

  beforeDestroy() {
    this.$nuxt.$off('onChangeLanguage', this.onChangeLanguage)
  },

  methods: {
    ...mapActions({
      initApplication: 'general/initApplication',
      getAccessToken: 'customer/auth/getAccessToken',
      getLocale: 'general/getLocale',
      getLocaleForCalendar: 'appHeader/changeLanguage',
      getDeviceInfo: 'general/getDeviceInfo',
      getUserDetail: 'users/getUserDetail',
      getDataFromUrl: 'booking/getDataFromUrl',
      changeLanguages: 'appHeader/changeLanguage',
      getHotelsList: 'hotel/getHotelList',
      saveFullPath: 'hotel/saveFullPath',
      toggleHeaderSearchBox: 'appAuthen/toggleHeaderSearchBox',
      getLocation: 'general/getLocation',
      resetGuestData: 'guestDetail/resetGuestData',
      saveGuestDataFromAPI: 'guestDetail/saveGuestDataFromAPI',
      savePageLoaded: 'general/savePageLoaded',
      openExpireTokenModal: 'appAuthen/openExpireTokenModal'
    }),

    openToast(tokenModel) {
      this.$bvToast.toast(`${tokenModel?.title}!`, {
        title: 'Login Fail',
        toaster: 'b-toaster-top-center',
        solid: true,
        appendToast: true,
        variant: 'danger'
      })

      this.openExpireTokenModal(null)
    },

    onChangeLanguage(lang) {
      const path = this.$route.path
      if (
        path.includes(`${this.$pageRoute.hotelDetail}/`) ||
        path === this.$pageRoute.hotelsList
      ) {
        this.$router
          .push({
            path,
            query: path.includes(`${this.$pageRoute.hotelDetail}/`)
              ? this.$hotelDetailQuery(this.bookingData, lang)
              : this.$hotelSearchQuery(this.bookingData, lang)
          })
          .catch(() => {})
      }
    },

    gtmData() {
      if (this.isLogin) {
        this.$gtm.push({
          ...(this.pageLoaded && { event: 'virtualPageview' }),
          triggerType: 'Page Load',
          locale: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          userId: this.userData.id,
          loginStatus: true
        })
      }
    },

    routeToHotelDetail() {
      const fullPath = this.$route.fullPath
      if (fullPath.includes('/#/booking/result')) {
        const path = fullPath.replace('/#', '')
        this.$router.push(path)
      }
    },

    authenticationMiddleware() {
      const ls = new SecureLS({
        isCompression: false
      })
      const password = ls.get('auth-password')

      const redirectUrl =
        this.$route.path !== '/authentication'
          ? `redirectUrl=${this.$route.fullPath}`
          : ''

      if (password !== STATIC_PASSWORD) {
        if (this.$route.path !== '/authentication') {
          this.$router.push(`/authentication?${redirectUrl}`).catch(err => err)
        }
      } else {
        const redirectUrl = this.$route.query?.redirectUrl
        if (redirectUrl) {
          this.$router.push(redirectUrl).catch(err => err)
        }

        if (this.$route.path === '/authentication') {
          this.$router.push('/').catch(err => err)
        }
      }
    },

    // async getUserInfo() {
    //   const _authorization =
    //     this.$route.query.access_token || this.$cookiz.get('_authorization')
    //   if (_authorization && !this.userData) {
    //     this.$triplaApi.setHeader('authorization', _authorization)
    //     try {
    //       const data = await this.getUserDetail(STATIC_HOTEL_ID)
    //       if (data.id && this.$route.query.access_token) {
    //         this.$cookiz.set('_authorization', this.$route.query.access_token, {
    //           expires: new Date(Date.now() + convertTime('10d')), // 10 days,
    //           path: '/'
    //         })
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // },

    setLocaleMess() {
      if (
        this.localeMessages.en &&
        this.localeMessages?.en?.message !==
          'Authorization has been denied for this request.'
      ) {
        for (const lang in this.localeMessages) {
          let key = lang
          switch (lang) {
            case 'ko-KR':
              key = 'ko'
              break
            case 'ja-JP':
              key = 'ja'
              break
            case 'zh-TW':
              key = 'tw'
              break
            case 'zh-CN':
              key = 'zh'
              break
            default:
              break
          }
          this.$i18n.setLocaleMessage(key, this.localeMessages[lang])
        }
      }
    },

    onResize() {
      if (window.innerWidth < 768) {
        this.getDeviceInfo(true)
      } else {
        this.getDeviceInfo(false)
      }
    },

    getSetLocale() {
      const queryString = this.$route.query
      let lang = localStorage.getItem('lang')
      if (lang === 'en-US') {
        lang = 'en'
      }
      // check current lange
      const Uti = Utilities
      const queryStringLanguage = queryString.language
      if (queryStringLanguage) {
        const currentLanguageByQueryString = Uti.getLocale(queryStringLanguage)
        moment.locale(currentLanguageByQueryString.code)
      } else if (lang) {
        moment.locale(lang)
        this.getLocaleForCalendar({
          langText: lang.slice(0, 2),
          fullLang: lang
        })
      } else {
        // searchValue
      }
    },

    getUrlData() {
      const data = this.$route.query
      this.getDataFromUrl(data)
      if (data.language) {
        if (checkLanguage(data.language)) {
          const shortLang = checkLanguage(data.language).shortLang
          this.$i18n.setLocale(shortLang)
        }

        this.changeLanguages({
          langText: checkLanguage(data.language)
            ? checkLanguage(data.language).shortLang
            : defaultLanguage.lang,
          fullLang: checkLanguage(data.language)
            ? checkLanguage(data.language).fullLang
            : defaultLanguage.fullLang
        })
        if (process.browser) {
          localStorage.setItem('lang', data.language)
        }
      } else {
        this.changeLanguages({
          langText: checkLanguage(this.$i18n.locale)
            ? checkLanguage(this.$i18n.locale).shortLang
            : defaultLanguage.lang,
          fullLang: checkLanguage(this.$i18n.locale)
            ? checkLanguage(this.$i18n.locale).fullLang
            : defaultLanguage.fullLang
        })
      }
    },

    onRouteToConfirmBooking() {
      const hash = decodeURIComponent(this.$route && this.$route.fullPath)
      if (hash.includes('bypass_token') && hash.includes('confirmation')) {
        const confirmBookingQuery = hash.split('/confirmation/')[1]
        this.$router.push(
          `${this.$pageRoute.comfirmBooking}/${confirmBookingQuery}`
        )
      }
    },

    changeLanguage(lang) {
      moment.locale(lang.code)
      localStorage.setItem('lang', lang.code)
      const langText = lang.code.slice(0, 2)
      this.changeLanguages({
        langText,
        fullLang: lang.code
      })

      const location = localStorage.getItem('location')
      this.getHotelsList({
        ...location,
        lang: this.langForMystaysAPI
      }).then(() => {
        this.$nuxt.$emit('on:CloseSearchBoxOverlay')
      })
    },

    hideSearchBox() {
      this.toggleHeaderSearchBox(false)
    },
    async checkUpdate() {
      const workbox = await window.$workbox
      if (workbox) {
        workbox.addEventListener('installed', (event) => {
          if (event.isUpdate) {
            location.reload()
          }
        })
      }
    }
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale
      },

      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mystay Hotel'
        }
      ]
    }
  }
}
</script>

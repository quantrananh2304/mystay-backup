<template>
  <div class="hotels-list">
    <HotelSearchNavigationBar
      v-if="!isMobile && pageLoaded"
      @on:Apply="$_onApply"
    />
    <HotelNavigationBar
      v-if="isMobile && pageLoaded"
      :is-selected-hotel="isSelectedHotel"
      :current-step="currentStep"
      :is-show-back-to-search-result="isShowBackToSearchResult"
      @on:Apply="$_onApply"
    />
    <HotelSearchTopView />
    <HotelSearchInput />
    <HotelSearchHeader />
    <transition name="fade" mode="out-in">
      <keep-alive>
        <component :is="switchViewType.component" />
      </keep-alive>
    </transition>
    <div>
      <HotelSearchOverlay
        v-if="
          overlayState.showMap ||
            overlayState.showSortBy ||
            overlayState.showFilter
        "
      />
      <CalendarLoader v-if="isMapLoading && isMobile" class="app-loader" />
      <div
        v-if="
          bookingState.checking ||
            bookingState.roomSelect ||
            bookingState.promoCode
        "
        class="hotels-list__overlay"
        @click="closeBookingPopup"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import HotelSearchContent from '@modules/hotelSearchPage/hotel-search-content/HotelSearchContent.vue'
import HotelSearchMapView from '@modules/hotelSearchPage/hotel-search-content/HotelSearchMapView.vue'

export default Vue.extend({
  name: 'SearchHotel',
  data() {
    return {
      isSelectedHotel: false,
      currentStep: 1,
      isShowBackToSearchResult: false,
      viewSection: {
        listView: {
          name: 'HotelSearchContent',
          component: HotelSearchContent
        },
        mapView: {
          name: 'HotelSearchMapView',
          component: HotelSearchMapView
        }
      },
      isOpenBooking: false,
      isBookingDataChange: false,
      isMapLoading: false,
      pageLoaded: false
    }
  },
  computed: {
    ...mapState({
      overlayState: state => state.searchHotel.filterState,
      bookingState: state => state.booking.bookingState,
      bookingData: state => state.booking.bookingData,
      viewType: state => state.searchHotel.viewType,
      searchText: state => state.booking.bookingData.location,
      cityList: state => state.hotel.data.cityList,
      roomListFromBookingData: state => state.booking.bookingData?.roomList
    }),

    ...mapGetters({
      ListHotelID: 'hotel/listHotelID',
      listHotelCodeFilter: 'hotel/listHotelCodeFilter',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      users: 'users/userData',
      numberAdults: 'booking/numberAdults',
      numberChildren: 'booking/numberChildren',
      myLocation: 'general/myLocation'
    }),

    switchViewType() {
      return this.viewType === 'Map View'
        ? this.viewSection.mapView
        : this.viewSection.listView
    },

    pathUrl() {
      return this.$route.fullPath
    },

    numberOfHotelID() {
      return this.ListHotelID.length
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
    },

    numberOfCity() {
      return this.cityList.length
    }
  },
  watch: {
    myLocation(myLocation) {
      if (
        myLocation &&
        (myLocation.country === 'VN' || myLocation.country === 'JP')
      ) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const location = {
              lat: position.coords.latitude,
              long: position.coords.longitude,
              lang: this.langForMystaysAPI
            }
            this.getHotelsList(location)
          })
        } else {
          console.log('Geolocation is not supported by this browser.')
        }
      } else {
        // not in Japan (or Vietname)
      }
    },

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

    pathUrl(fullPath) {
      this.saveFullPath(fullPath)
    },

    numberOfCity(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$_handleSearchHotel(false)
      }
    },

    lang() {
      this.changeViewType('List View')
    }
  },

  created() {
    this.resetFilterModel()
    this.clearTiersList()
    this.clearHotelDetail()
    this.getDataFromUrl(this.$route.query)
  },
  mounted() {
    this.pageLoaded = true
    this.saveFullPath(this.$route.fullPath)
    this.searchHotelWithKeyword()
    this.gtmData()
    this.saveHotelID('')
    this.resetHotelId()
    if (this.ListHotelID.length) {
      this.getMystaysHotelPrice()
    }
    this.receiveEvent()
  },
  destroyed() {
    this.changeViewType('List View')
    this.resetFilterModel()
    this.offEvent()
  },
  methods: {
    ...mapActions({
      closeAll: 'booking/closeAll',
      getDataFromUrl: 'booking/getDataFromUrl',
      filterHotelList: 'hotel/filterHotelList',
      changeViewType: 'searchHotel/changeViewType',
      handleGetHotelPrice: 'hotel/getHotelPrice',
      saveFullPath: 'hotel/saveFullPath',
      clearHotelDetail: 'hotelDetail/clearHotelDetail',
      clearTiersList: 'hotel/clearTiersList',
      savePrefectureValue: 'hotel/savePrefectureValue',
      setSearchKeyword: 'booking/setSearchKeyword',
      resetFilterModel: 'hotel/resetFilterModel',
      saveHotelID: 'hotel/saveHotelID',
      getHotelsList: 'hotel/getHotelList',
      resetHotelId: 'booking/resetHotelId'
    }),

    receiveEvent() {
      this.$nuxt.$on('onLoadingGoogleMap', this.onLoadingGoogleMap)
      this.$nuxt.$on('calendar-mobile-click-done', this.$_onApply)
      this.$nuxt.$on('on:CloseSearchBoxOverlay', this.getMystaysHotelPrice)
    },

    offEvent() {
      this.$nuxt.$off('onLoadingGoogleMap', this.onLoadingGoogleMap)
      this.$nuxt.$off('calendar-mobile-click-done', this.$_onApply)
      this.$nuxt.$off('on:CloseSearchBoxOverlay', this.getMystaysHotelPrice)
    },

    searchHotelWithKeyword() {
      const path = this.$route.path

      const hotelName =
        path.replace('/hotels-', '')?.replaceAll('/', '') ||
        path.replace('/Hotels-', '')?.replaceAll('/', '')

      if (hotelName && hotelName?.toLowerCase() !== 'list') {
        const hotelNameCapitalize =
          hotelName?.charAt(0)?.toUpperCase() + hotelName.slice(1)
        if (hotelNameCapitalize) {
          this.setSearchKeyword(hotelNameCapitalize?.replaceAll('/', ''))
        }
      }

      if (
        path.toLowerCase() === '/hotels/' ||
        path.toLowerCase() === '/hotels'
      ) {
        this.setSearchKeyword('')
      }
      this.$_handleSearchHotel(false)
    },

    onLoadingGoogleMap(isLoading) {
      this.isMapLoading = isLoading
    },

    gtmData() {
      if (this.isLogin) {
        this.$gtm.push({
          ...(this.isPageLoaded && { event: 'virtualPageview' }),
          triggerType: 'Page Load',
          locale: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          userId: this.isLogin ? this.users.id : '',
          loginStatus: true
        })
      }

      this.$gtm.push({
        event: 'bookNowHome',
        checkInDate: this.bookingData.checkIn,
        checkOutDate: this.bookingData.checkOut,
        productCoupon: this.bookingData.promoCode,
        language: this.$langFormat(this.lang),
        pageCategory: 'HotelListingPage',
        searchTerm: this.bookingData.location,
        numberOfAdult: this.numberAdults,
        numberOfChildren: this.numberChildren,
        numberOfRooms: this.roomListFromBookingData.length,
        triggerType: 'Page Load'
      })
    },

    getMystaysHotelPrice() {
      this.$_handleSearchHotel(false)
      this.handleGetHotelPrice(this.getTriplaHotelPriceParams()).then(() => {
        this.resetFilterModel()
        this.$_handleSearchHotel(false)
      })
    },

    $_handleSearchHotel(isLoading) {
      this.savePrefectureValue('')
      this.resetFilterModel()
      this.filterHotelList({
        searchParam: {
          keyword: this.searchText || '',
          isFilter: true,
          isLoading
        }
      })
    },

    closeBookingPopup() {
      this.closeAll()
      if (this.isBookingDataChange) {
        this.resetFilterModel()
        this.filterHotelList({
          searchParam: {
            keyword: this.searchText || '',
            isFilter: true,
            isLoading: true
          }
        })
        this.getMystaysHotelPrice()
        this.isBookingDataChange = false
      }
    },

    $_onApply() {
      this.closeAll()
      if (this.isBookingDataChange) {
        this.resetFilterModel()
        this.filterHotelList({
          searchParam: {
            keyword: this.searchText || '',
            isFilter: true,
            isLoading: true
          }
        })
        this.getMystaysHotelPrice()
        this.isBookingDataChange = false
      }
    },

    getTriplaHotelPriceParams() {
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

      return {
        rooms: roomMapper,
        is_including_max_of_lowest_price_next_30_days: false,
        is_including_lowest_price: true,
        page: 1,
        per_page: 5,
        hotel_codes: this.listHotelCodeFilter
      }
    }
  },
  head() {
    return {
      title: this.$t('general.hotel_list_page_title'),
      meta: [
        {
          hid: 'title',
          name: 'title',
          property: 'title',
          content: this.$t('general.search_page_title')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          property: 'og:title',
          content: this.$t('general.search_page_title')
        },
        {
          hid: 'description',
          name: 'description',
          property: 'description',
          content: this.$t('general.search_page_description')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          property: 'og:description',
          content: this.$t('general.search_page_description')
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
          content: ''
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
.hotels-list {
  background: #f3f3f3;
  padding-bottom: 50px;
  flex: 1;
  &__overlay {
    position: fixed;
    left: 0;
    top: 0;
    opacity: 0.95;
    width: 100%;
    z-index: 1;
    height: 100%;
    background: #232e48;
    @include min-sm {
      background: #232e48;
    }
  }

  .app-loader {
    z-index: 100;
    background: white;
  }
}
</style>

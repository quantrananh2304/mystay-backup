<template>
  <div class="search-button" @click="closeAll">
    <div class="search-button__title">
      {{ title_text }}
    </div>
    <div class="search-button__search">
      <button class="button m-btn m-btn__yellow" @click="searchHotels">
        {{ search_button_text }}
      </button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
export default Vue.extend({
  name: 'SearchButton',
  components: {},
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      bookingError: state => state.booking.bookingError,
      searchType: state => state.booking.bookingData.searchType
    }),
    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      numberAdults: 'booking/numberAdults',
      numberChildren: 'booking/numberChildren',
      searchData: 'booking/searchData'
    }),
    title_text() {
      return this.$t('booking.find_a_hotel')
    },
    search_button_text() {
      return this.$t('headers.search')
    }
  },

  methods: {
    ...mapActions({
      closeAll: 'booking/closeAll',
      getError: 'booking/getError',
      searchRoom: 'booking/searchRoom',
      setBooking: 'booking/setInitialBooking',
      setSearchKeyword: 'booking/setSearchKeyword',
      setSearchType: 'booking/searchType',
      saveHotelID: 'booking/saveHotelID'
    }),
    searchHotels() {
      if (this.searchData.location && this.bookingData.location) {
        this.setSearchKeyword(this.searchData.location)
        this.setSearchType(this.searchData.searchType)
        this.saveHotelID(this.searchData.hotelID)
        this.getError({ key: 'location', msg: null })
      } else if (!this.bookingData.location) {
        this.getError({ key: 'location', msg: 'null field' })
      } else {
        this.getError({ key: 'location', msg: null })
      }

      if (!this.bookingError.location.msg) {
        this.setBooking(this.bookingData)
        let next_redirect_route = ''
        if (this.searchType === 'hotel') {
          const hotelID = this.bookingData.hotelID
          next_redirect_route = `/hotel/${hotelID}`
        } else {
          next_redirect_route = this.$pageRoute.hotelsList
        }

        this.$router.push({
          path: `${next_redirect_route}`,
          query:
            this.$route.path === this.$pageRoute.hotelsList
              ? this.$hotelSearchQuery(this.bookingData, this.fullLang)
              : this.$hotelDetailQuery(this.bookingData, this.fullLang)
        })
      }

      this.$gtm.push({
        event: 'searchHome',
        checkInDate: this.bookingData.checkIn,
        checkOutDate: this.bookingData.checkOut,
        productCoupon: this.bookingData.promoCode,
        language: this.$langFormat(this.lang),
        pageCategory: 'HomePage',
        searchTerm: this.bookingData,
        numberOfAdult: this.numberAdults,
        numberOfChildren: this.numberChildren,
        triggerType: 'User Interaction'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.search-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @include min-md {
    width: auto;
  }
  &__title {
    color: $text-color-blue;
    font-size: 13px;
    margin-bottom: 12px;
    text-align: center;
    display: none;
    @include min-md {
      display: block;
    }
  }
  &__search {
    margin-top: 20px;
    width: 100%;
    @include min-md {
      margin-top: 0;
    }
    .button {
      padding: 12px;
      width: 100%;
      max-height: 59px;
      @include min-md {
        padding: 0 20px;
        max-width: 100%;
        height: 59px;
      }
    }
  }
}
</style>

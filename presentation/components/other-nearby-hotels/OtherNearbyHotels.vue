<template>
  <div class="other-nearby-hotels">
    <div class="container">
      <h2>{{ getLang.otherNearbyHotels }}</h2>

      <div v-if="hotelDetailV2.nearbyHotels" class="row">
        <div
          v-for="(hotel, index) in nearbyHotels"
          :key="index"
          class="col-sm-4 col-md-4 col-lg-4 has-price"
        >
          <HotelSearchResults :key="index" :hotel-detail="hotel" />
        </div>
      </div>

      <div class="see-more-link" @click="searchHotels">
        <span>{{ getLang.seeMoreHotels }}</span>
        <span class="icon-Arrow-Small-Right" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
export default Vue.extend({
  name: 'OtherNearbyHotels',
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      bookingError: state => state.booking.bookingError,
      searchType: state => state.booking.bookingData.searchType,
      hotelDetailV2: state => state.hotelDetail.hotelDetailV2
    }),
    ...mapGetters({
      searchData: 'booking/searchData',
      hotelList: 'hotel/hotelFilter'
    }),
    getLang() {
      return {
        otherNearbyHotels: this.$t('hoteldetail.other_nearby_hotels'),
        seeMoreHotels: this.$t('hoteldetail.see_more_hotels')
      }
    },
    nearbyHotels() {
      let nearbyHotels = []
      const hotelDetailV2 = this.hotelDetailV2
      if (hotelDetailV2.nearbyHotels) {
        nearbyHotels = this.hotelDetailV2.nearbyHotels.map((item) => {
          const thisHotel = this.hotelList.filter(
            hotel => hotel.triplaHotelId === item.hotelCode
          )[0]
          return {
            ...item,
            ...thisHotel
          }
        })
      }
      return nearbyHotels
    }
  },
  watch: {
    hotelDetailV2() {
      if (
        this.hotelDetailV2.nearbyHotels &&
        this.hotelDetailV2.nearbyHotels.length
      ) {
        const hotel_codes = this.hotelDetailV2.nearbyHotels.map(
          item => item.triplaBookingCode
        )

        this.handleGetHotelPrice(this.getPriceParams(hotel_codes))
      }
    },
    bookingData() {
      if (
        this.hotelDetailV2.nearbyHotels &&
        this.hotelDetailV2.nearbyHotels.length
      ) {
        const hotel_codes = this.hotelDetailV2.nearbyHotels.map(
          item => item.triplaBookingCode
        )

        this.handleGetHotelPrice(this.getPriceParams(hotel_codes))
      }
    }
  },
  mounted() {
    this.filterHotelList({ searchParam: { isFilter: true } })
  },
  methods: {
    ...mapActions({
      getError: 'booking/getError',
      saveHotelID: 'booking/saveHotelID',
      handleGetHotelPrice: 'hotel/getHotelPrice',
      setNearbyPrice: 'hotel/getNearbyHotelPrice',
      filterHotelList: 'hotel/filterHotelList',
      setBooking: 'booking/setInitialBooking'
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
    getItemPage(hotelList) {
      let itemInPage = this.currentPage * this.itemPerPage
      if (itemInPage > hotelList.length) {
        itemInPage = hotelList.length
      }
      return itemInPage
    },
    searchHotels() {
      if (this.searchData.location && this.bookingData.location) {
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
.other-nearby-hotels {
  background-color: #f3f3f3;
  display: none;
  padding-bottom: 20px;

  @include min-sm {
    display: block;
  }

  .icon-Arrow-Small-Right {
    font-size: 9px;
  }

  .container {
    padding: 0 20px;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  h2 {
    margin-bottom: 25px;
    text-align: center;
    font-size: 20px;
    @include min-sm {
      font-size: 30px;
    }
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    justify-content: center;
  }

  .see-more-link {
    margin-top: 0;
    width: 100%;
    font-size: 13px;
    font-weight: 900;
    text-align: right;

    span {
      cursor: pointer;
    }
  }
}
</style>

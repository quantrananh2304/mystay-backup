<template>
  <div class="hotel-search-input mb-2">
    <SearchBoxTitle
      :title="getTextString.where_in_japan"
      :placeholder="getTextString.search_hotels_destinations"
      @on:focus="focus"
    />
    <div class="hotel-search-input__total-result mt-3">
      {{ resultsText }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'HotelSearchInput',
  props: {},
  data() {
    return {
      isIdle: false
    }
  },
  computed: {
    ...mapState({
      viewType: state => state.searchHotel.viewType,
      searchKeyword: state => state.booking.bookingData.location,
      isHotelLoading: state => state.hotel.isHotelLoading,
      isPriceLoading: state => state.hotel.isPriceLoading,
      isGetLocationLoading: state => state.general.data.isGetLocationLoading
    }),
    ...mapGetters({
      hotelList: 'hotel/hotelFilter'
    }),

    getTextString() {
      return {
        where_in_japan: this.$t('booking.where_in_japan'),
        search_hotels_destinations: this.$t(
          'booking.search_hotels_destinations'
        )
      }
    },

    getLang() {
      return {
        mapView: this.$t('searchhotel.map_view'),
        listView: this.$t('searchhotel.list_view'),
        sortBy: this.$t('searchhotel.sort_by'),
        filter: this.$t('hoteldetail.filter'),
        results: this.$t('searchhotel.results'),
        result: this.$t('searchhotel.result'),
        for: this.$t('summary.for')
      }
    },

    resultsText() {
      let resultsText = ''
      if (!this.isIdle) {
        if (this.searchKeyword) {
          resultsText = resultsText = this.getResultTextWithSearchKeyword
        } else {
          resultsText = this.getResultText
        }
      } else {
        resultsText = this.getResultText
      }

      return resultsText
    },

    getResultTextWithSearchKeyword() {
      return this.hotelList.length > 1
        ? this.$t('searchhotel.search_results_for', {
          number_hotel: this.hotelList.length,
          keyword: this.searchKeyword
        })
        : this.$t('searchhotel.search_result_for', {
          number_hotel: this.hotelList.length,
          keyword: this.searchKeyword
        })
    },

    getResultText() {
      return this.hotelList.length > 1
        ? this.$t('searchhotel.number_hotels_found', {
          number_hotel: this.hotelList.length
        })
        : this.$t('searchhotel.number_hotel_found', {
          number_hotel: this.hotelList.length
        })
    }
  },
  mounted() {
    this.$nuxt.$on('on:IdleGoogleMap', this.idleGoogleMap)
  },
  beforeDestroy() {
    this.$nuxt.$off('on:IdleGoogleMap', this.idleGoogleMap)
  },
  methods: {
    ...mapActions({
      openHeaderSearchBox: 'searchHotel/openHeaderSearchBox',
      closeHeaderSearchBox: 'searchHotel/closeHeaderSearchBox',
      toggleHeaderSearchBox: 'appAuthen/toggleHeaderSearchBox'
    }),

    idleGoogleMap(isIdle) {
      this.isIdle = isIdle
    },

    focus() {
      this.toggleHeaderSearchBox(true)
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-search-input {
  margin-top: 24px;
  padding: 0 15px;
  @include min-sm {
    display: none;
  }
  label {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  &__search {
    position: relative;
    margin-bottom: 20px;
    span {
      position: absolute;
      top: 16px;
      left: 15px;
      font-size: 18px;
    }
    input {
      width: 100%;
      height: 51.5px;
      padding-left: 47px;
      border: 1.5px solid $border-color-gray-2;
      font-size: 14px;
      outline: none;
    }
  }

  &__total-result {
    font-size: 14px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: 0;
  }

  &__text {
    text-align: center;
    p {
      color: $text-color-blue-2;
      margin-bottom: 20px;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>

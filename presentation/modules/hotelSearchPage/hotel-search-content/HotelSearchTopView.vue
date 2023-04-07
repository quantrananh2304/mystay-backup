<template>
  <section class="hotel-search-top-view">
    <div class="container">
      <div class="hotel-search-top-view__results">
        <h3 v-show="!isHotelLoading">
          {{ resultsText }}
        </h3>
        <div v-show="isHotelLoading" class="ml-2">
          <b-skeleton animation="fade" width="40%" height="36px" />
        </div>
      </div>
      <div class="hotel-search-top-view__header">
        <!-- <HotelSearchTopStats :viewType="viewType" /> -->
        <div
          v-if="viewType === 'Map View'"
          class="hotel-search-top-view__header__btn-filter"
          @click="$_openFilterSection"
        >
          <span class="icon-Icon-Filter" />
          <span>{{ $t('hoteldetail.filter') }}</span>
        </div>
        <div
          v-if="$nuxt.isOnline"
          class="hotel-search-top-view__header__list-view"
        >
          <div
            class="list-view block"
            :class="{ active: viewType === 'Map View' }"
            @click="$_changeView('List View')"
          >
            <span class="icon-Icon-List" />
            <span>{{ getLang.listView }}</span>
          </div>
          <div
            class="list-view block"
            :class="{ active: viewType === 'List View' }"
            @click="$_changeView('Map View')"
          >
            <span class="icon-Icon-Map-Pin" />
            <span>{{ getLang.mapView }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'HotelSearchTopView',
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
      hotelList: 'hotel/hotelFilter',
      lang: 'appHeader/language'
    }),

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
          resultsText = this.getResultTextWithSearchKeyword
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
      changeViewType: 'searchHotel/changeViewType',
      openFilterSection: 'searchHotel/openFilterSection'
    }),

    idleGoogleMap(isIdle) {
      this.isIdle = isIdle
    },

    $_changeView(type) {
      if (!this.isHotelLoading) {
        this.changeViewType(type)
      }

      this.$gtm.push({
        event: 'viewTypeSelection',
        viewType: type === 'List View' ? 'List' : 'Map',
        pageCategory: this.$route.name,
        language: this.$langFormat(this.lang),
        triggerType: 'User Interaction'
      })
    },

    $_openFilterSection() {
      this.openFilterSection(true)
      this.$scrollBody.disable()
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-search-top-view {
  display: none;
  @include min-sm {
    display: block;
    margin-top: 55px;
    margin-bottom: 19px;
  }

  &__results {
    h3 {
      font-size: 25px;
      margin-bottom: 20px;

      @include min-lg {
        font-size: 30px;
      }
    }
  }

  &__header {
    display: flex;
    justify-content: flex-end;

    &__btn-filter {
      display: flex;
      align-items: center;
      border-radius: 4px;
      height: 41px;
      border: 1px solid $border-color-gray-2;
      padding: 0 30px;
      color: $text-color-blue-2;
      margin-right: 30px;
      cursor: pointer;
      span {
        margin-right: 10px;
        &:last-child {
          font-size: 13px;
          font-weight: bold;
        }
      }
    }

    &__list-view {
      width: 35%;
      display: flex;
      height: 41px;
      @include min-lg {
        width: 23.8%;
      }
    }
    .block {
      padding: 10px;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0 4px 4px 0;
      background: $bg-color-blue-2;
      cursor: pointer;
      &:first-child {
        border-right: 1px solid $border-color-gray-2;
        border-radius: 4px 0 0 4px;
      }
      span {
        color: white;
        font-size: 13px;
        font-weight: bold;
        &:first-child {
          font-size: 16px;
          margin-right: 8px;
          font-weight: normal;
        }
      }
    }

    .active {
      background: #f3f3f3;
      border: 1px solid $border-color-gray-2;
      span {
        color: $bg-color-blue-2;
      }
    }
  }
}

.hotel-loading {
  height: 40px;
  width: 30%;
  box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
  @include background-shimmer($base-color: #f3f3f3, $shimmer-color: white);
}
</style>

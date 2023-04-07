<template>
  <div class="search-box-result">
    <div v-if="isGetAllHotelLoading" class="search-box-result__loading">
      <CalendarLoader />
    </div>
    <div v-if="searchBoxData.searchText" class="search-box__bottom__container">
      <SearchBoxResultItem
        :title="getTextString.top_results"
        :text-see-all="`${getTextString.see_all} ${hotelGetterList.length} hotels`"
        :is-show-see-all="hotelGetterList.length > 5"
        :data="searchBoxData.displayListHotel.defaultList"
        :is-hover="true"
        :show-area="showArea"
        :current-item="isNextTopResult ? -1 : currentItem"
        @on:click="$_selectHotel"
        @on:clickSeeAllBtn="$_selectHotel"
      >
        <div
          v-if="showArea"
          class="place"
          :class="{ 'hotel-hover': currentItem === 0 }"
          @click="$_selectHotel(citySearch || districtList, 'city')"
        >
          <div class="place__address">
            {{ citySearch.name || districtList.name }}
          </div>
          <div class="place__properties">
            <strong>
              {{ searchBoxData.hotelListByCity }}
              {{ getTextString.properties }}
            </strong>
          </div>
        </div>
      </SearchBoxResultItem>
      <SearchBoxResultItem
        v-if="showRecentSearch"
        :title="''"
        :text-see-all="getTextString.see_more_nearby"
        :data="searchBoxData.displayListHotel.IfHaveNotRecentSearch"
        :is-hover="true"
        :current-item="currentItemIfHaveNotRecentSearch"
        :is-next-top-result="isNextTopResult"
        @on:click="$_selectHotel"
        @on:clickSeeAllBtn="$_selectHotel()"
      />
      <SearchBoxResultItem
        v-if="showNearMe"
        :title="getTextString.near_me"
        :text-see-all="getTextString.see_more_nearby"
        :data="hotelNearMe"
        :is-hover="false"
        @on:click="$_selectHotel"
        @on:clickSeeAllBtn="$_selectHotel()"
      />
      <SearchBoxResultItem
        v-if="searchBoxData.recent.length > 0"
        :title="getTextString.recent_searches"
        :text-see-all="getTextString.see_all"
        :data="searchBoxData.recent"
        :is-hover="false"
        @on:click="$_selectHotel"
        @on:clickSeeAllBtn="$_selectHotel()"
      />
    </div>
    <div v-if="!searchBoxData.searchText" class="search-box__bottom__container">
      <SearchBoxResultDefault
        :title="getTextString.destinations"
        :data="cityList"
        @on:selectCity="$_selectDistrict"
        @on:selectDistrict="$_selectDistrict"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import SearchBoxResultItem from './SearchBoxResultItem'
import SearchBoxResultDefault from './SearchBoxResultDefault.vue'
import CalendarLoader from '@/presentation/components/app-loaders/CalendarLoader'
export default {
  components: {
    SearchBoxResultItem,
    SearchBoxResultDefault,
    CalendarLoader
  },
  props: {
    searchBoxData: {
      type: Object,
      require: true,
      default: () => {}
    }
  },

  data() {
    return {
      currentItem: 0
    }
  },

  computed: {
    ...mapState({
      cityList: state => state.hotel.data.cityList,
      hotelFilter: state => state.hotel.data.hotelFilter,
      isGetAllHotelLoading: state => state.hotel.isGetAllHotelLoading,
      isGetLocationLoading: state => state.general.data.isGetLocationLoading,
      hotelNearMe: state => state.hotel.data.hotel_nearme
    }),
    ...mapGetters({
      citySearch: 'hotel/citySearch',
      hotelGetterList: 'hotel/hotelsGetterList',
      hotelDisplayList: 'hotel/hotelsDisplayList',
      districtList: 'hotel/districtListFilterGetter',
      isNearMe: 'general/isNearMe'
    }),
    getTextString() {
      return {
        hotel: this.$t('booking.hotel'),
        see_all: this.$t('booking.see_all'),
        near_me: this.$t('booking.near_me'),
        properties: this.$t('booking.properties'),
        top_results: this.$t('booking.top_results'),
        destinations: this.$t('headers.destinations'),
        recent_searches: this.$t('booking.recent_searches'),
        see_more_nearby: this.$t('booking.see_more_nearby')
      }
    },

    showArea() {
      return Boolean(
        this.searchBoxData.showArea.isShow &&
          (this.citySearch || this.districtList)
      )
    },

    showNearMe() {
      return this.isNearMe && this.hotelNearMe.length > 0
    },

    showRecentSearch() {
      return (
        this.searchBoxData.displayListHotel.IfHaveNotRecentSearch.length > 0
      )
    },

    searchText() {
      return this.searchBoxData.searchText
    },

    currentItemIfHaveNotRecentSearch() {
      return this.showArea ? this.currentItem - 6 : this.currentItem - 5
    },

    isNextTopResult() {
      const totalItem = this.showArea ? 6 : 5

      return this.currentItem >= totalItem
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
    searchText(searchText) {
      if (searchText) {
        this.onFilterWithLocation()
      }
    },

    currentItem() {
      this.onFilterWithLocation()
    }
  },

  mounted() {
    this.$nuxt.$on('on:sendCurrentItem', this.setCurrentItem)

    this.onFilterWithLocation()
    this.getCurrentPosition()
  },

  beforeDestroy() {
    this.$nuxt.$off('on:sendCurrentItem', this.setCurrentItem)
  },

  methods: {
    // MODULE ACTIONS
    ...mapActions({
      selectHotels: 'hotel/selectHotel',
      selectAllHotelsAction: 'hotel/selectAllHotels',
      filterHotelList: 'hotel/filterHotelList',
      showLocation: 'booking/showLocation',
      showChecking: 'booking/showChecking',
      getLocation: 'booking/getLocation',
      saveSearchData: 'booking/saveSearchData',
      getHotelsList: 'hotel/getHotelList'
    }),

    setCurrentItem(currentItem) {
      this.currentItem = currentItem
    },

    getCurrentPosition() {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          lang: this.langForMystaysAPI
        }
        this.getHotelsList(location)
      })
    },

    $_selectHotel(hotel, type = 'hotel') {
      this.$emit('on:selectHotel', { hotel, type })
      this.filterHotelList({
        searchParam: {
          keyword: hotel.name,
          isFilter: true
        }
      })
    },
    $_selectDistrict(hotel) {
      this.$emit('on:selectHotel', { ...hotel, type: hotel.type })
      this.filterHotelList({
        searchParam: {
          keyword: hotel.type === 'city' ? hotel.cityName : hotel.districtName,
          isFilter: true
        }
      })
    },

    onFilterWithLocation() {
      if (this.currentItem === 0 && this.showArea) {
        this.saveSearchData({
          location: this.citySearch.name,
          searchType: 'city'
        })
      } else {
        const index = this.showArea ? this.currentItem - 1 : this.currentItem
        const indexIfHaveNotRecentSearch = this.showArea
          ? this.currentItem - 6
          : this.currentItem - 5

        const currentHotel =
          this.showRecentSearch && this.isNextTopResult
            ? this.searchBoxData.displayListHotel.IfHaveNotRecentSearch[
              indexIfHaveNotRecentSearch
            ]
            : this.searchBoxData.displayListHotel.defaultList[index]

        const location = (currentHotel && currentHotel.name) || ''
        const hotelID = currentHotel && currentHotel.triplaHotelId
        this.saveSearchData({
          location,
          searchType: 'hotel',
          hotelID
        })
      }
    }
  }
}
</script>

<style lang="scss">
.search-box-result {
  width: 100%;
  color: #000;
  position: relative;
  .search-box__bottom__container {
    display: flex;
    width: 100%;
    height: 500px;
    padding: 20px;
    overflow: auto;
    flex-direction: column;
    background-color: $bg-color-white;
    @include scrollbar;

    @include min-sm {
      flex-direction: row;
    }
  }

  &__loading {
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    left: 0;
    @include min-sm {
      top: 0;
      left: 0;
    }
  }

  .hotel-hover {
    background-color: $bg-color-yellow-3;
    padding-left: 20px !important;
  }
}
</style>

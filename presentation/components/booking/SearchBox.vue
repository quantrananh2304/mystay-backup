<template>
  <div class="search-box">
    <SearchBoxTitle
      :title="getTextString.where_in_japan"
      :placeholder="getTextString.search_hotels_destinations"
      :show-area="data.showArea.isShow"
      @on:focus="focus"
      @on:input="handleSearchHotel"
      @on:enter="onEnter"
    />
    <dropdown-transition>
      <div v-if="isShowLocation" class="search-box__bottom">
        <SearchBoxResult
          :search-box-data="data"
          @on:selectHotel="selectHotel"
          @on:selectDistrict="selectHotel"
        />
      </div>
    </dropdown-transition>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import DropdownTransition from '../dropdown-transition/DropdownTransition.vue'
import SearchBoxTitle from './SearchBox/SearchBoxTitle.vue'
import SearchBoxResult from './SearchBox/SearchBoxResult.vue'
import { getWindowInfo } from '~/utils/common'

export default Vue.extend({
  name: 'SearchBox',
  components: {
    DropdownTransition,
    SearchBoxTitle,
    SearchBoxResult
  },
  data() {
    return {
      data: {
        nearMe: [],
        recent: [],
        districtListFilter: [],
        displayListHotel: {
          defaultList: [],
          IfHaveNotRecentSearch: []
        },
        searchText: '',
        debounce: '',
        showArea: { isShow: false, name: 'Tokyo' },
        hotelListByCity: 0
      }
    }
  },

  computed: {
    ...mapState({
      hotelList: state => state.hotel.data.hotelList,
      hotelNearMe: state => state.hotel.data.hotel_nearme,
      hotelFilter: state => state.hotel.data.hotelFilter,
      locationError: state => state.booking.bookingError.location,
      isShowLocation: state => state.booking.bookingState.location,
      cityList: state => state.hotel.data.cityList,
      districtList: state => state.hotel.data.districtListFilter,
      hotelID: state => state.booking.bookingData.hotelID,
      searchType: state => state.booking.bookingData.searchType,
      location: state => state.booking.bookingData.location,
      recentSearchFromStore: state => state.hotel.data.recentSearch
    }),
    ...mapGetters({
      hotelDisplayList: 'hotel/hotelsDisplayList',
      citySearch: 'hotel/citySearch',
      searchData: 'booking/searchData'
    }),
    getTextString() {
      return {
        where_in_japan: this.$t('booking.where_in_japan'),
        search_hotels_destinations: this.$t(
          'booking.search_hotels_destinations'
        )
      }
    }
  },
  watch: {
    hotelDisplayList(newValue) {
      const recentSearch = this.recentSearchFromStore

      if (!recentSearch.length) {
        this.data.displayListHotel.IfHaveNotRecentSearch = newValue.slice(5)
        this.data.displayListHotel.defaultList = newValue.slice(0, 5)
      } else {
        this.data.displayListHotel.defaultList = newValue.slice(0, 5)
      }
    },
    hotelNearMe(newValue) {
      this.data.nearMe = newValue
    },
    hotelID(id) {
      if (id && this.searchType === 'hotel') {
        this.getTiersList(id)
      } else {
        this.clearTiersList()
      }
    },

    isShowLocation(isShow) {
      const recentSearch = this.recentSearchFromStore
      if (!recentSearch.length) {
        this.data.displayListHotel.IfHaveNotRecentSearch = this.hotelDisplayList.slice(
          5
        )
        this.data.displayListHotel.defaultList = this.hotelDisplayList.slice(
          0,
          5
        )
        this.data.recent = []
      } else {
        this.data.displayListHotel.defaultList = this.hotelDisplayList.slice(
          0,
          5
        )

        this.data.displayListHotel.IfHaveNotRecentSearch = []
        this.data.recent = recentSearch
      }

      if (isShow) {
        this.data.searchText = this.location
        this.filterHotelListForSearchBox(this.data.searchText)
      }
    }
  },
  mounted() {
    if (this.hotelID && this.searchType === 'hotel') {
      this.getTiersList(this.hotelID)
    } else {
      this.clearTiersList()
    }

    if (this.hotelNearMe && this.hotelNearMe.length > 0) {
      this.hotelNearMe.map((element) => {
        this.data.nearMe.push({
          name: element.name,
          address: element.prefecture
        })
      })
    }

    this.$nextTick(() => {
      const recentSearch = this.recentSearchFromStore

      if (recentSearch.length) {
        this.data.recent = recentSearch
      }
    })

    if (this.citySearch) {
      this.data.hotelListByCity = this.citySearch.hotelCount
      this.data.showArea.isShow = true
    }
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
      saveRecentSearch: 'hotel/saveRecentSearch',
      handleSearchType: 'booking/searchType',
      closeAll: 'booking/closeAll',
      getTiersList: 'hotel/getTiersList',
      clearTiersList: 'hotel/clearTiersList',
      toggleHeaderSearchBox: 'appAuthen/toggleHeaderSearchBox',
      saveSearchData: 'booking/saveSearchData',
      setSearchKeyword: 'booking/setSearchKeyword',
      setSearchType: 'booking/searchType',
      saveHotelID: 'booking/saveHotelID',
      filterHotelListForSearchBox: 'hotel/filterHotelListForSearchBox'
    }),
    focus() {
      const window = getWindowInfo()

      if (window.isMobile) {
        this.toggleHeaderSearchBox(true)
      } else {
        this.showLocation()
      }
    },
    selectAllHotels() {
      this.selectAllHotelsAction(this.hotelGetterList)
    },

    onEnter() {
      this.setSearchKeyword(this.searchData.location)
      this.setSearchType(this.searchData.searchType)
      this.saveHotelID(this.searchData.hotelID)

      if (this.searchData.hotelID) {
        const findRecent = this.recentSearchFromStore.find(
          hotel => hotel.triplaHotelId === this.searchData.hotelID
        )
        if (!findRecent && this.searchData.hotelID) {
          const hotel = this.hotelFilter.find(
            hotel => hotel.triplaHotelId === this.searchData.hotelID
          )

          this.saveRecentSearch(hotel)
        }
      }

      this.showChecking()
    },

    selectHotel(data) {
      this.handleSearchType(data.type)

      const findRecent = this.recentSearchFromStore.find(
        hotel =>
          data.hotel && hotel.triplaHotelId === data?.hotel?.triplaHotelId
      )
      if (!findRecent && data?.hotel?.triplaHotelId) {
        this.saveRecentSearch(data.hotel)
      }

      this.saveSearchData({
        location: '',
        searchType: ''
      })
      this.getLocation({
        name:
          (data.hotel && data.hotel.name) || data.cityName || data.districtName,
        hotelID: data.hotel && data.hotel.triplaHotelId
      })

      this.showChecking()
    },
    handleSearchHotel(data) {
      this.$emit('on:sendSearchText', data.searchText)
      this.data.searchText = data.searchText
      this.filterHotelListForSearchBox(data.searchText)

      if (this.citySearch) {
        this.data.hotelListByCity = this.citySearch.hotelCount
        this.data.showArea.isShow = true
      }
    },
    clearSearchText() {
      this.$refs.input.focus()
      this.searchText = ''
      this.getLocation('')
      this.handleSearchHotel()
    }
  }
})
</script>
<style lang="scss" scoped>
.search-box {
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  @include min-md {
    width: 287px;
    margin-bottom: 0;
  }
  &__bottom {
    position: absolute;
    width: 100vw;
    top: 90px;
    left: -20px;
    z-index: 10;
    @include min-md {
      width: 950px;
      height: auto;
      top: calc(100% + 28px);
      bottom: -10px;
      left: -37px;
      padding: 0 35px;
      &::after {
        content: '';
        width: 14px;
        height: 14px;
        top: -7px;
        left: calc(287px / 2 + 30px);
        position: absolute;
        border-top: 1px solid $border-color-light-gray;
        border-left: 1px solid $border-color-light-gray;
        background-color: $bg-color-white;
        transform: rotate(45deg);
      }
    }
  }
}
</style>

<template>
  <div
    ref="hotelSearchNav"
    class="hotel-search-navbar"
    :class="{ 'sticky-header': isSticky }"
  >
    <div class="hotel-search-navbar__header container">
      <div class="hotel-search-navbar__header__logo">
        <NuxtLink to="/" class="navbar-brand" aria-label="mystays-logo">
          <img :src="require('@/assets/images/Logo.svg')" alt>
        </NuxtLink>
      </div>

      <div class="hotel-search-navbar__header_info">
        <HotelNavigationBarInfo />
      </div>
    </div>
    <div class="container">
      <div class="hotel-search-navbar__booking">
        <HotelNavigationBooking
          :is-show-search-box="isShowSearchBox"
          page="search-page"
          @on:applyRoom="$_applyRoom"
        />
      </div>
    </div>
    <HotelNavigationBarStep :current-step="currentStep" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

export default Vue.extend({
  name: 'HotelSearchNavigationBar',
  data() {
    return {
      isShowSearchBox: true,
      currentStep: 1,
      navbarHeight: 0,
      isSticky: false,
      isSearchTextChange: false
    }
  },
  computed: {
    ...mapState({
      isOpenSearchBox: state => state.searchHotel.openHeaderSearchBox,
      searchText: state => state.booking.bookingData.location
    })
  },
  watch: {
    searchText() {
      this.isSearchTextChange = true
    }
  },

  destroyed() {
    this.$_closeSearchBox()
  },
  methods: {
    ...mapActions({
      openHeaderSearchBox: 'searchHotel/openHeaderSearchBox',
      closeHeaderSearchBox: 'searchHotel/closeHeaderSearchBox',
      filterHotelList: 'hotel/filterHotelList'
    }),
    $_closeSearchBox() {
      if (this.isSearchTextChange) {
        this.filterHotelList({
          searchParam: {
            keyword: this.searchText,
            isFilter: true
          }
        })
      }
      this.closeHeaderSearchBox()
      // this.$scrollBody.disable();
      setTimeout(() => {
        this.isSearchTextChange = false
      }, 200)
    },

    $_applyRoom() {
      this.$emit('on:Apply')
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-search-navbar {
  background: $bg-color-blue;
  position: relative;
  z-index: 2;
  &__header {
    display: flex;
    padding: 15px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    @include min-sm {
      padding: 15px 30px;
    }

    @include min-xl {
      padding: 15px 0;
    }
  }
  &__booking {
    padding-bottom: 25px;
    @include min-sm {
      width: 100%;
    }
    @include min-lg {
      width: 95%;
    }
    @include min-xl {
      width: 82%;
    }
  }
}

.sticky-header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.5s;
  transform: translate3d(0, 0, 0);
}

.slide-in-enter,
.slide-in-leave-to {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}
</style>

<template>
  <div class="hotel-detail-top-view">
    <div id="header" class="hotel-detail-top-view__header-wrapper">
      <div class="container">
        <HotelDetailPageTopViewHeader
          :hotel-detail="hotelDetail"
          :is-mobile="isMobile"
          :room-count="roomCount"
          :min-price="minPrice"
        />
      </div>
    </div>
    <div v-if="!isMobile && pageLoaded" class="hotel-detail-top-view__swiper">
      <AppSwiper
        v-if="isDisplay && !isHotelDetailV2Loading"
        :hotel-image-list="hotelImageList"
      />
      <HotelDetailSwiperSkeleton v-if="isHotelDetailV2Loading" />
    </div>
    <div v-if="pageLoaded" class="hotel-detail-top-view__banner">
      <HotelDetailPageTopViewBanner
        v-if="!isHotelDetailV2Loading"
        :total-image="hotelImageList.length"
        :first-image="(hotelImageList && hotelImageList[0]) || ''"
        @on:showGallery="$_onShowGallery"
      />
      <div v-if="isHotelDetailV2Loading" class="d-sm-none">
        <b-skeleton-img aspect="360:222" />
      </div>
    </div>
    <div class="hotel-detail-top-view__nav">
      <HotelDetailPageTopViewNav
        :navbar-item="navbarItem"
        :is-mobile="isMobile"
      />
    </div>
    <div id="hotel" class="hotel-detail-top-view__content-wrapper">
      <div v-if="pageLoaded" class="container">
        <HotelDetailPageTopViewContent
          v-if="!isHotelDetailV2Loading"
          :check-in-overview="checkInOverview"
          :hotel-overview="hotelOverview"
        />

        <HotelPageTopViewSkeleton v-if="isHotelDetailV2Loading" />
      </div>
    </div>
    <keep-alive>
      <HotelDetailSidebar
        :room-detail-sidebar="roomDetailSidebar"
        :is-mobile="isMobile"
      />
    </keep-alive>
    <div
      v-if="isShowOverlay && isMobile"
      class="hotel-detail-top-view__gallery-moblie"
    >
      <AppSwiper
        :hotel-image-list="hotelImageList"
        :is-mobile="isMobile"
        :current-slide="currentSlide"
        @on:showGalleryFullScreen="$_onShowGalleryFullScreen"
      />
      <div class="hotel-detail-top-view__gallery-moblie__close">
        <span class="icon-Icon-Close" @click="$_closeOverlay" />
      </div>
      <div
        v-if="!isLandscape"
        class="hotel-detail-top-view__gallery-moblie__tooltip"
      >
        <div class="tooltip-custom">
          <span v-if="roomCount < 10">Only {{ roomCount }} Left at</span>
          <span>{{ minPrice }}</span>
        </div>
      </div>
      <div
        v-if="!isLandscape"
        class="hotel-detail-top-view__gallery-moblie__button"
      >
        <button class="m-btn m-btn__blue" @click="$_findRoom">
          {{ $t("booking.find_a_hotel") }}
        </button>
      </div>
    </div>

    <div v-if="isShowFullScreen">
      <AppSwiperMobile
        :hotel-image-list="hotelImageList"
        :current-slide="currentSlide"
        :is-landscape="isLandscape"
        @on:closeGalleryView="$_onCloseGalleryView"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */

import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'HotelDetailPageTopView',
  data() {
    return {
      isShowOverlay: false,
      isShowFullScreen: false,
      currentSlide: 1,
      isLandscape: false,
      isDisplay: true,
      pageLoaded: false
    }
  },
  computed: {
    ...mapState({
      isHotelDetailV2Loading: state =>
        state.hotelDetail.isHotelDetailV2Loading
    }),
    ...mapGetters({
      roomDetailSidebar: 'hotelDetail/roomDetailSidebar',
      checkInOverview: 'hotelDetail/checkInOverview',
      hotelDetail: 'hotelDetail/hotelDetail',
      roomList: 'hotelDetail/roomLeftFilter',
      hotelReviews: 'hotelDetail/hotelReviews',
      hotelDetailV2: 'hotelDetail/hotelDetailV2'
    }),

    hotelImageList() {
      return this.hotelDetailV2.images || []
    },

    hotelOverview() {
      return this.hotelDetailV2.overview || ''
    },

    navbarItem() {
      const navbarsList = [
        {
          name: this.$t('hoteldetail.hotel'),
          id: this.isMobile ? 'header' : 'hotel'
        },
        { name: this.$t('hoteldetail.room_and_plan'), id: 'plan' },
        { name: this.$t('hoteldetail.find_us'), id: 'map' }
      ]

      if (this.hotelReviews?.length) {
        navbarsList.push({
          name: this.$t('hoteldetail.reviews'),
          id: 'review'
        })
      }

      return navbarsList
    },

    roomCount() {
      if (this.roomList && this.roomList?.length) {
        const newRoom = this.roomList.sort((a, b) => {
          return a.rate > b.rate
        })

        return newRoom[0].roomLeft
      }

      return 0
    },

    price() {
      return this.roomList?.map(r => r.rate)
    },

    minPrice() {
      if (this.roomList && this.roomList?.length) {
        let minPrice = this.roomList[0].rate
        this.roomList.forEach((r) => {
          if (r.rate < minPrice) {
            minPrice = r.rate
          }
        })

        return this.$currencyHelper(minPrice, 'YEN')
      }
      return ''
    }
  },
  mounted() {
    this.pageLoaded = true
    window.addEventListener('orientationchange', (e) => {
      const orientationType = e.target.screen.orientation.type
      this.isLandscape = orientationType === 'landscape-primary'
    })

    this.$nuxt.$on('on:ChangePage', this.setDisplay)
  },

  beforeDestroy() {
    this.isDisplay = false
    this.$nuxt.$off('on:ChangePage', this.setDisplay)
  },
  methods: {
    setDisplay() {
      this.isDisplay = false
    },

    $_closeOverlay() {
      this.isShowOverlay = false
      this.$scrollBody.enable()
    },

    $_onShowGallery() {
      this.isShowOverlay = true
      // this.$scrollBody.disable();
    },

    $_onShowGalleryFullScreen(currentSlide) {
      this.isShowFullScreen = true
      this.currentSlide = currentSlide
    },

    $_onCloseGalleryView(currentSlide) {
      this.isShowFullScreen = false
      this.isShowOverlay = true
      this.currentSlide = currentSlide
    },

    $_findRoom() {
      const roomAndPlan = document.querySelector('#plantab')
      if (roomAndPlan) {
        roomAndPlan.click()
        this.$_closeOverlay()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail-top-view {
  display: flex;
  flex-direction: column;
  @include min-sm {
    display: inline;
  }
  &__header-wrapper {
    order: 3;
    @include min-sm {
      border-top: none;
    }
  }
  &__content-wrapper {
    order: 4;
  }

  .hotel-detail-top-view-slide-desktop {
    overflow: hidden;
  }

  .container {
    order: 3;
  }

  &__swiper {
    &__loading {
      background: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .loading {
        position: relative;
        margin: 10px;
        background: #f3f3f3;
        width: calc(100% / 3);
        padding-top: 30%;
        z-index: 10;
      }
    }
  }

  &__gallery-moblie {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1010;
    background: white;
    &__close {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0.8;
      z-index: 1020;
      span {
        padding: 17px;
        color: white;
        background: $text-color-blue;
      }
    }
    &__tooltip {
      opacity: 0.9;
      position: absolute;
      bottom: 72px;
      width: 100%;
      text-align: center;
      padding: 0 20px;
      .tooltip-custom {
        padding: 7px 0;
        background: $text-color-blue;
        color: white;
        border-radius: 2px;
        position: relative;
        &::before {
          content: "";
          width: 0;
          height: 0;
          border-width: 10px 9px;
          border-style: solid;
          margin-left: -9px;
          border-color: transparent transparent $text-color-blue transparent;
          left: 50%;
          position: absolute;
          transform: rotate(180deg);
          bottom: -15px;
        }
        span {
          &:first-child {
            font-size: 10px;
            margin-right: 5px;
          }
          &:last-child {
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }
    &__button {
      position: absolute;
      bottom: 12px;
      width: 100%;
      padding: 0 20px;
      button {
        width: 100%;
        height: 50px;
      }
    }
    @include min-sm {
      display: none;
    }

    .swiper-pagination-fraction,
    .swiper-pagination-custom,
    .swiper-container-horizontal > .swiper-pagination-bullets {
      bottom: 10px;
      left: 10px;
      background: $text-color-blue;
      color: white;
      padding: 6px 10px 7px 46px;
      border-radius: 3px;
      opacity: 0.95;
      width: auto;
      width: initial;
      bottom: auto;
      bottom: initial;
      left: auto;
      left: initial;
      font-size: 11px;
    }
  }
}
</style>

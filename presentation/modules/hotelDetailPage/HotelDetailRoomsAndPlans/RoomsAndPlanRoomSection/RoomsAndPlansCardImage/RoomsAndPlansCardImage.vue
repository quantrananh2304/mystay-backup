<template>
  <div
    class="rooms-and-plans__card card__image"
    :class="{ 'is-plan-image': info.planId }"
  >
    <div class="card__image-wrapper" @click="$_toggleSideBox(true)">
      <LazyLoadBgrImage :img-url="info.picture" />
      <div
        v-if="isSlider && info.roomLeft < 10 && !bookingData.is_undated"
        class="card__image-rooms-left text-capitalize"
      >
        <span class="icon-Icon-Time" />
        {{ roomLeftText }}
      </div>
      <div v-if="isSlider" class="card__image-count">
        <span class="icon-Icon-Gallery" />
        1 / {{ info.roomSliderImages.length }}
      </div>
    </div>
    <RoomsAndPlansGallery
      v-if="isSlider"
      :is-open="sideBoxOpen"
      :gallery="info.roomSliderImages"
      :room-info="info"
      :current-slide="currentSlide"
      @toggleSideBox="$_toggleSideBox"
      @on:showGalleryFullScreen="$_onShowFullScreen"
    />
    <div v-if="isFullScreen">
      <AppSwiperMobile
        :hotel-image-list="info.roomSliderImages"
        :current-slide="currentSlide"
        @on:closeGalleryView="$_onCloseGalleryView"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  props: {
    // eslint-disable-next-line vue/require-default-prop
    info: {
      type: Object
    },
    isSlider: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      currentSlide: 0,
      sideBoxOpen: false,
      isFullScreen: false
    }
  },
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData
    }),
    ...mapGetters({
      currentTab: 'hotelDetail/currentTab',
      lang: 'appHeader/language'
    }),
    getLang() {
      return {
        only: this.$t('hoteldetail.only'),
        left: this.$t('hoteldetail.left')
      }
    },

    roomLeftText() {
      if (this.info?.roomLeft) {
        return this.$t('hoteldetail.only_room_left', {
          room_left: this.info?.roomLeft
        })
      } else {
        return this.$t('hoteldetail.out_off_room')
      }
    }
  },
  methods: {
    $_toggleSideBox(isOpen) {
      this.sideBoxOpen = isOpen
      if (isOpen) {
        const hotelID = this.$route.params?.hotelID
        this.$gtm.push({
          event: 'viewAllPhotosClick',
          language: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          hotelID,
          roomID: this.info.roomId,
          planID: '',
          triggerType: 'User Interaction'
        })
      }
    },

    $_onCloseGalleryView(currentSlide) {
      this.isFullScreen = false
      this.currentSlide = currentSlide
    },

    $_onShowFullScreen(currentSlide) {
      this.isFullScreen = true
      this.currentSlide = currentSlide
    }
  }
})
</script>

<style lang="scss" scoped>
.rooms-and-plans__card.card__image {
  flex: 1 1 auto;
  // display: none;

  @include min-sm {
    flex: initial;
    width: 200px;
    margin-right: 22px;
    min-width: 200px;
    position: absolute;
    display: block;
  }

  @include min-md {
    margin-right: 30px;
    min-width: 250px;
    position: static;
  }

  &.is-plan-image {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 110px;
    height: 120px;
    overflow: hidden;
    display: none;

    @include min-sm {
      left: 12px;
      right: auto;
      display: block;
    }

    @include min-md {
      position: static;
      width: auto;
      height: auto;
      display: block;
    }

    img {
      position: absolute;
      top: -9999px;
      bottom: -9999px;
      left: -9999px;
      right: -9999px;
      margin: auto;
      width: auto;
      display: block;

      @include min-sm {
        width: 100%;
        position: static;
      }
    }
  }

  .card__image {
    &-wrapper {
      cursor: pointer;
      min-height: 100px;
      position: relative;
      margin-bottom: 20px;
      // height: 180px;
      background-size: cover;
      background-position-x: center;
      background-position-y: center;

      @include min-sm {
        margin-bottom: 0;
        // height: 146px;
        z-index: 1;
      }
    }

    &-rooms-left,
    &-count {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 6px 8px;
      border-radius: 15px;
      background: $bg-color-pink;
      color: $white;
      font-size: 11px;
      display: flex;
      align-items: center;
      z-index: 1;

      [class^='icon-'],
      [class*=' icon-'] {
        font-size: 15px;
        margin-right: 10px;
      }

      @include min-sm {
        border-radius: 0;
        top: 0;
        left: 0;
      }
    }

    &-count {
      top: 10px;
      left: auto;
      right: 10px;
      border-radius: 2px;
      background: $bg-color-blue;

      @include min-sm {
        top: auto;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>

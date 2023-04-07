<template>
  <div class="hotel-detail-top-view-header">
    <div
      v-show="!isHotelDetailLoading"
      class="hotel-detail-top-view-header__title"
    >
      <div class="title">
        <h1>{{ hotelDetail && hotelDetail.name }}</h1>
      </div>
      <div class="address">
        <span class="icon-Icon-Map-Pin" />
        <span>{{ address }}</span>
        <!-- <span></span>
        <span>+81-476-33-166</span> -->
      </div>
    </div>
    <div
      v-show="isHotelDetailLoading"
      class="hotel-detail-top-view-header__loading"
    >
      <b-skeleton
        animation="fade"
        :width="isMobile ? '100%' : '60%'"
        :height="isMobile ? '21px' : '36px'"
      />
      <b-skeleton
        v-show="!isMobile"
        animation="fade"
        width="40%"
        height="20px"
      />
    </div>
    <div
      v-show="$nuxt.isOnline"
      class="hotel-detail-top-view-header__room-price"
    >
      <div v-show="!isRoomLoading && minPrice" class="price">
        <h2>{{ minPrice }}</h2>
        <span>{{ perRoomText }}</span>
      </div>
      <div v-show="isRoomLoading">
        <b-skeleton animation="fade" width="130px" height="57px" />
      </div>
    </div>
    <div class="hotel-detail-top-view-header__find-room">
      <div class="find-room">
        <div
          v-show="roomCount < 10 && !isRoomLoading && minPrice"
          class="find-room__text text-capitalize"
        >
          {{ bestRateText }}
          {{ isMobile ? minPrice : '' }}
        </div>
        <div v-show="isShowMinPrice" class="find-room__text">
          {{ minPrice }}
        </div>
        <div v-show="isRoomLoading">
          <b-skeleton animation="fade" width="100%" height="19px" />
        </div>
        <div class="find-room__button" @click="findRoom">
          <button class="button m-btn m-btn__blue">
            {{ getLanguage.findRoom }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
export default Vue.extend({
  name: 'HotelDetailPageTopViewHeader',
  components: {},
  props: {
    hotelDetail: {
      type: Object,
      default: () => {}
    },
    roomCount: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      roomList: 'hotelDetail/roomList',
      totalNight: 'booking/totalNight'
    }),

    ...mapState({
      isRoomLoading: state => state.hotelDetail.isRoomLoading,
      isHotelDetailLoading: state => state.hotelDetail.isHotelDetailLoading
    }),

    address() {
      if (this.hotelDetail) {
        return `${this.hotelDetail.address?.full_address} ${
          this.hotelDetail.address?.country ? ',' : ''
        } ${
          this.hotelDetail.address?.country
            ? this.hotelDetail.address?.country
            : ''
        }`
      }
      return ''
    },
    perRoomText() {
      return this.$t('hoteldetail.per_night', {
        night: this.totalNight
      })
    },

    bestRateText() {
      return this.$t('hoteldetail.only_room_left_at_best_rate', {
        room_left: this.roomCount
      })
    },

    getLanguage() {
      const langs = {
        findRoom: this.$t('hoteldetail.find_a_room'),
        perNight: this.$t('hoteldetail.per_night'),
        only: this.$t('hoteldetail.only'),
        leftAt: this.$t('hoteldetail.left_at'),
        bestRate: this.$t('hoteldetail.best_rate'),
        night: this.$t('customhtmlcalendar.night')?.toLowerCase(),
        nights: this.$t('customhtmlcalendar.nights')?.toLowerCase()
      }

      return langs
    },

    isShowMinPrice() {
      return (
        this.roomCount >= 10 &&
        !this.isRoomLoading &&
        this.isMobile &&
        this.$nuxt.isOnline &&
        this.minPrice
      )
    }
  },

  methods: {
    findRoom() {
      const roomAndPlan = document.querySelector('#plantab')
      if (roomAndPlan) {
        roomAndPlan.click()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail-top-view-header {
  order: 3;
  padding: 40px 0 35px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  h1 {
    color: $text-color-blue;
    font-size: 18px;
    font-weight: 650;
    text-align: center;
  }
  @include min-sm {
    flex-direction: row;
    align-items: flex-end;
    padding: 44px 0 40px 0;
    border-top: none;
    h1 {
      font-size: 30px;
      text-align: left;
    }
  }
  &__title {
    padding-right: 20px;
    flex-grow: 1;
    width: 100%;
    .title {
      margin-bottom: 10px;
      @include min-sm {
        margin-bottom: 15px;
      }
    }
    .address {
      display: none;
      color: #5e5e66;
      font-size: 14px;
      span:first-child {
        font-size: 20px;
        margin-right: 12px;
      }
      span:nth-child(2) {
        margin-right: 12px;
      }
      span:nth-child(3) {
        padding-right: 15px;
        position: relative;
        &::after {
          content: '';
          width: 1px;
          height: 11px;
          background: #5e5e66;
          position: absolute;
          right: 11px;
          top: 5px;
        }
      }
      @include min-sm {
        display: flex;
      }
    }
  }
  &__room-price {
    display: none;
    margin-right: 28px;
    text-align: right;
    h2 {
      margin-bottom: 0;
      font-weight: bold;
    }
    span {
      color: $text-color-blue;
      font-size: 11px;
    }

    .price-loading {
      min-height: 60px;
      width: 140px;
      box-shadow: 2px 3px 14px 0px rgba(74, 74, 74, 0.25);
      @include background-shimmer($base-color: white, $shimmer-color: #f3f3f3);
    }
    @include min-sm {
      display: block;
    }

    .price {
      min-width: 120px;
    }
  }
  &__find-room {
    width: 100%;
    @include min-sm {
      width: initial;
    }
    .find-room {
      &__text {
        color: $bg-color-blue-2;
        font-size: 12px;
        margin-bottom: 15px;
        text-align: center;
        align-items: flex-end;
        font-weight: bold;
        @include min-sm {
          font-size: 13px;
          margin-bottom: 7px;
        }
      }
      &__button {
        button {
          width: 100%;
          height: 45px;
          @include min-sm {
            width: 194px;
          }
        }
      }

      &__loading {
        height: 19px;
        margin-bottom: 7px;
        box-shadow: 2px 3px 14px 0px rgba(74, 74, 74, 0.25);
        @include background-shimmer(
          $base-color: white,
          $shimmer-color: #f3f3f3
        );
      }
    }
  }

  &__loading {
    flex-grow: 1;
    width: 100%;
    .animation {
      width: 350px;
      min-height: 36px;
      box-shadow: 2px 3px 14px 0px rgba(74, 74, 74, 0.25);
      @include background-shimmer($base-color: white, $shimmer-color: #f3f3f3);
    }
    .title {
      margin-bottom: 15px;
      width: 100%;

      @include min-sm {
        width: 70%;
      }
    }

    .address {
      min-height: 20px;
      display: none;
      @include min-sm {
        display: block;
      }
    }
  }
}
</style>

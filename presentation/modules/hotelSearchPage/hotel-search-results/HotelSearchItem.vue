<template>
  <section class="hotel-item" @mouseover="$_getHotel">
    <div class="hotel-item__image">
      <LazyLoadBgrImage :img-url="hotelFilter.featuredImage" />
    </div>
    <div class="hotel-item__content">
      <div class="hotel-item__content__title">
        <h4>{{ hotelFilter.name }}</h4>
      </div>
      <div class="hotel-item__content__info">
        <div class="info">
          <div
            class="info__location"
            :class="{ 'info--no-score': !isShowScore }"
          >
            <span class="icon-Icon-Map-Pin" />
            <span>
              {{ hotelAddress }}
            </span>
          </div>
          <div v-if="isShowScore" class="info__rating">
            <RatingCircle :number-circle="reviewScore" />
            <span>{{ hotelFilter.numberOfReviews }} reviews</span>
          </div>
        </div>
      </div>
      <div class="hotel-item__content__price">
        <div>
          <h4 v-show="!isPriceLoading && hotelFilter.price">
            {{ hotelFilter.price | currency('YEN') }} ~
          </h4>
          <div
            :class="{
              'd-flex': !hotelFilter.price && !isPriceLoading
            }"
            class="out-of-room d-none"
          >
            <span class="icon-Icon-Time" />
            <span>{{ $t('hoteldetail.out_off_room') }}</span>
          </div>
          <LoadingSpinner
            v-show="isPriceLoading"
            style="width: 100%"
            :number-rect="6"
          />
        </div>
        <button class="m-btn m-btn__yellow" @click="$_goToHotelDetail">
          {{ $t('searchhotel.view_hotel') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'HotelSearchItem',
  props: {
    hotelDetail: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      isPriceLoading: state => state.hotel.isPriceLoading
    }),
    ...mapGetters({
      hotel: 'searchHotel/hotelDetail',
      hotelList: 'hotel/hotelFilter',
      fullLang: 'appHeader/fullLanguage'
    }),
    reviewScore() {
      return this.hotelDetail.reviewScore
    },

    isShowScore() {
      return this.hotelDetail.numberOfReviews && this.hotelDetail.reviewScore
    },

    hotelFilter() {
      const hotelID = this.hotelDetail && this.hotelDetail.triplaHotelId
      this.hotelList.forEach((hotel) => {
        if (hotel.triplaHotelId === hotelID) {
          this.hotelDetail.price = hotel.price
        }
      })

      return this.hotelDetail
    },

    hotelAddress() {
      if (
        this.hotelFilter?.address?.city &&
        this.hotelFilter?.address?.city !== this.hotelFilter.prefecture
      ) {
        const address =
          this.$i18n.locale === 'en'
            ? `${this.hotelFilter?.address?.city || ''}, ${
                this.hotelFilter.prefecture
              }`
            : `${this.hotelFilter.prefecture}, ${this.hotelFilter?.address
                ?.city || ''}`

        return address
      }

      return this.hotelFilter.prefecture
    }
  },
  methods: {
    ...mapActions({
      getHotelPosition: 'searchHotel/getHotelPosition'
    }),

    $_goToHotelDetail() {
      const hotelID = this.hotelDetail && this.hotelDetail.triplaHotelId
      if (hotelID) {
        this.$router.push({
          path: `/hotel/${hotelID}`,
          query: this.$hotelDetailQuery(this.bookingData, this.lang)
        })
      }
    },

    $_getHotel() {
      if (this.hotel.hotelName !== this.hotelDetail.name) {
        this.getHotelPosition(this.hotelDetail)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-item {
  width: 100%;
  display: flex;
  background: white;
  box-shadow: 0 5px 10px -4px rgba(37, 58, 106, 0.3);
  margin-bottom: 30px;
  cursor: pointer;
  &__image {
    background-size: cover;
    display: block;
    width: 180px;
    background-position: center center;
  }

  &__content {
    width: calc(100% - 200px);
    &__title {
      padding: 10px 0px 0 10px;
      min-height: 50px;
      h4 {
        font-size: 14px;
        font-weight: bold;
      }
    }

    &__info {
      border-top: 1px solid $border-color-gray-2;
      border-bottom: 1px solid $border-color-gray-2;
      .info {
        display: flex;
        &__location {
          padding-left: 10px;
          width: 100%;
          display: flex;
          align-items: center;
          border-right: 1px solid $border-color-gray-2;
          span {
            &:first-child {
              margin-right: 8px;
            }
            &:last-child {
              font-size: 12px;
              color: #aaabae;
            }
          }
        }

        &__rating {
          padding: 10px 0 7px 10px;
          width: 100%;
          span {
            font-size: 12px;
            color: #aaabae;
          }
        }

        &--no-score {
          padding: 16px 0 16px 10px;
        }
      }
    }

    &__price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0 15px 10px;
      h4 {
        font-size: 15px;
        font-weight: bold;
      }
      button {
        padding: 7px 15px;
        @include min-lg {
          padding: 7px 20px;
        }
      }
    }
  }

  .out-of-room {
    display: flex;
    align-items: center;
    background: #f5455a;
    border-radius: 20px;
    padding: 6px 15px 7px 10px;
    span {
      font-size: 11px;
      color: white;
      font-weight: bold;
      margin-right: 5px;
      &:first-child {
        font-size: 15px;
        font-weight: normal;
      }
    }
  }
}
</style>

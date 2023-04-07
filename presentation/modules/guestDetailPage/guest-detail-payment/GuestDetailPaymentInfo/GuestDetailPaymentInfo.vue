<template>
  <div class="guest-detail-payment info">
    <h5>{{ getLang.summary }}</h5>
    <div class="guest-detail-payment__collapse">
      <AppCollapse
        v-for="(room, index) in roomSelected"
        :key="index"
        :room-detail-info="room"
        :room-i-d="`room__${index}`"
        :guest-detail="`guestDetail`"
        :fw-bold="isUpdateBooking"
      />
    </div>
    <div v-show="promoCodeSave" class="guest-detail-payment__promo-code">
      <span>
        {{
          $t("booking.saved_money", {
            percent: percentDiscount,
            coupon: promoCode,
          })
        }}
      </span>
      <span>{{ promoCodeSave | currency("YEN") }}</span>
    </div>
    <AppCollapse :room-detail-info="tax" :room-i-d="`tax`" :fw-bold="true" />
    <div v-show="isUpdateBooking" class="guest-detail-payment__compare-price">
      <span>Original payment amount:</span>
      <span>{{ oldPrice | currency("YEN") }}</span>
    </div>
    <div v-show="isUpdateBooking" class="guest-detail-payment__compare-price">
      <span>Price difference:</span>
      <span>{{ priceDifference | currency("YEN") }}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GuestDetailPaymentInfo',
  computed: {
    ...mapState({
      promoCode: state => state.booking.bookingData.promoCode,
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking
    }),
    ...mapGetters({
      tax: 'hotelDetail/tax',
      promoCodeSave: 'hotelDetail/couponDiscount',
      roomSelected: 'hotelDetail/roomSelected',
      reservationsData: 'booking/reservationsData',
      totalPrice: 'hotelDetail/totalPrice',
      percentDiscount: 'hotelDetail/percentDiscount'
    }),

    getLang() {
      return {
        summary: this.$t('payment_detail.summary')
      }
    },

    oldPrice() {
      return this.reservationsData?.total_price
    },

    priceDifference() {
      return +(this.totalPrice - this.oldPrice)
    }
  }
})
</script>

<style lang="scss" scoped>
.guest-detail-payment {
  border: 1px solid $border-color-gray-2;
  border-radius: 2px;
  padding: 34px;
  margin-bottom: 25px;

  h5 {
    color: $text-color-blue;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 18px;
  }

  &__promo-code {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 24px 13px 0;
    border-bottom: 1px solid $border-color-gray-2;
    span {
      color: #f5455a;
      // text-transform: uppercase;
      font-weight: 600;
      &:last-child {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  &__compare-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 24px 13px 0;
    border-bottom: 1px solid $border-color-gray-2;
    span {
      font-size: 14px;
    }
  }
}
</style>

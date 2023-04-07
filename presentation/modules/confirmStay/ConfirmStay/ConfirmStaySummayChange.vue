<template>
  <section class="stay-summary-change">
    <div class="stay-summary-change__title">
      <h4>{{ getLanguage.summaryCharges }}</h4>
    </div>
    <div class="stay-summary-change__content">
      <div
        v-show="reservationsData.coupon_promotion"
        class="stay-summary-change__content__save"
      >
        <span>
          {{
            $t('booking.saved_money', {
              percent: discountPercent,
              coupon: couponCode,
            })
          }}
        </span>
        <span>{{
          -reservationsData.coupon_discount_amount | currency('YEN')
        }}</span>
      </div>
      <div class="stay-summary-change__content__collapse">
        <AppCollapse
          v-for="(item, index) in summaryCharges"
          :key="index"
          :room-detail-info="item"
          :room-i-d="`${index}`"
        />
      </div>
      <!-- <div class="stay-summary-change__content__payment-method">
        <div class="payment-method">
          {{ $t('payment_detail.payment_method') }}
        </div>
        <span>
          {{ reservationsData.payment_method }}
        </span>
      </div> -->
      <AppCollapse :room-detail-info="tax" :room-i-d="`tax`" :fw-bold="true" />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'ConfirmStaySummayChange',
  data() {
    return {
      promoCode: ''
    }
  },
  computed: {
    ...mapState({
      // tax: state => state.hotelDetail.tax,
      promotionCode: state => state.booking.bookingData.promoCode
    }),
    ...mapGetters({
      tax: 'hotelDetail/taxFromAPI',
      promoCodeSave: 'hotelDetail/couponDiscount',
      reservationsData: 'booking/reservationsData'
    }),
    // eslint-disable-next-line vue/return-in-computed-property
    getLanguage() {
      return {
        summaryCharges: this.$t('summary.summary_of_charges'),
        yourTotal: this.$t('summary.your_total'),
        night: this.$t('summary.night_extra'),
        child: this.$t('booking.child'),
        children: this.$t('booking.children'),
        adult: this.$t('booking.adult'),
        adults: this.$t('booking.adults')
      }
    },

    summaryCharges() {
      const roomDetail = this.reservationsData?.rooms?.map((room) => {
        const roomRate = room.room_rates?.map((rate, rateIdx) => {
          return {
            price: rate.day_total_rate,
            time: `${this.getLanguage.night} ${rateIdx + 1}`
          }
        })

        const totalPrice = roomRate
          .map(room => room.price)
          .reduce((a, b) => a + b)
        const roomDetailInfo = {
          title: `${room.room_type_name} , ${room.room_plan_name} `,
          totalPrice,
          detail: roomRate,
          numberAdults: room.adults,
          numberChildren: room.children
        }

        return roomDetailInfo
      })

      return roomDetail
    },

    couponCode() {
      return this.reservationsData?.coupon_promotion?.coupon_code
    },

    couponDiscountAmount() {
      return this.reservationsData?.coupon_discount_amount
    },

    totalPrice() {
      return this.reservationsData.original_price_with_tax
    },

    discountPercent() {
      const percent = (this.couponDiscountAmount / this.totalPrice) * 100
      const percentFixed = percent && percent.toFixed(0)
      return `${percentFixed}%`
    }
  },
  mounted() {
    this.promoCode = this.promotionCode
  }
})
</script>

<style lang="scss" scoped>
.stay-summary-change {
  margin-bottom: 40px;
  @include min-sm {
    padding: 27px 30px 30px 30px;
    border: 1px solid $border-color-gray-2;
    border-radius: 4px;
    margin-bottom: 30px;
  }
  &__title {
    margin-bottom: 10px;
    h4 {
      font-size: 18px;
      font-weight: 600;
    }
  }

  &__content {
    &__save {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: $text-color-pink-2;
      border-bottom: 1px solid $border-color-gray-2;
      padding: 10px 0 13px;

      span {
        // text-transform: uppercase;
        font-weight: 600;
        &:last-child {
          @include min-sm {
            margin-right: 24px;
          }
        }
      }
    }

    &__payment-method {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      border-bottom: 1px solid $border-color-gray-2;
      padding: 12px 0 13px;

      .payment-method {
        font-weight: bold;
      }
    }

    &__total {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 13px 20px 0 0;
      font-weight: bold;
      @include min-sm {
        padding-right: 24px;
      }
    }
  }
}
</style>

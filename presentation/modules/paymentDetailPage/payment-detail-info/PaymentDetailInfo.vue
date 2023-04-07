<template>
  <div class="payment-detail__info">
    <div v-if="!paymentMethod" class="payment-detail__info__title">
      <h5>
        {{ getLang.payQuestion }}
      </h5>
    </div>
    <PaymentMethod />
    <div
      v-if="!!reservationError && paymentMethod === 'on_site'"
      class="reservation-error"
    >
      <span class="icon-Icon-Info mr-2 font-weight-bold" />
      <span> {{ reservationError.error }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PaymentDetailInfo',
  props: {
    isAuthened: {
      type: Boolean
    }
  },
  data() {
    return {
      agreeWithCondition: [
        {
          value: true,
          text: ''
        }
      ],
      agreeStatus: []
    }
  },
  computed: {
    ...mapState({
      reservationError: state => state.booking.reservationError
    }),
    ...mapGetters({
      paymentMethod: 'paymentDetail/paymentMethodSelected'
    }),
    getLang() {
      return {
        payQuestion: this.$t('payment_info.pay_question'),
        agree: this.$t('payment_info.agree'),
        bookingCondition: this.$t('payment_info.booking_condition'),
        termsAndPolicy: this.$t('payment_info.terms_and_policy')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-detail {
  &__info {
    width: 100%;

    @include min-xl {
      width: 656px;
    }

    h5 {
      margin-top: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid $border-color-gray-2;

      @include min-sm {
        display: block;
      }
    }

    .login-and-payment {
      margin-top: 20px;

      @include min-sm {
        display: none;
      }
    }

    &__agree {
      margin-top: 20px;
      padding: 15px;
      background: $bg-color-gray-10;
      border-radius: 3px;

      a {
        display: inline;
        color: $text-color-blue-2;
        font-size: 14px;
        text-decoration: underline;
      }

      label {
        color: $text-color-blue;
      }
    }
  }
}

.reservation-error {
  border: 1px solid #dddee0;
  border-radius: 2px 2px 0 0;
  padding: 15px 24px;
  background: #fafafa;
  font-size: 14px;
  margin-top: 15px;
  border-radius: 0 0 2px 2px;
  font-weight: bold;

  span {
    color: red;
  }
}
</style>

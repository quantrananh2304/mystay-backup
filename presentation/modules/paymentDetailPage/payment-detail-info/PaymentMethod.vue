<template>
  <div class="payment-method">
    <b-form-radio-group
      id="radio-slots"
      v-model="paymentMethod"
      name="radio-options-slots"
      stacked
    >
      <b-form-radio
        v-for="paymentMethodItem in paymentMethodList"
        :key="paymentMethodItem.code"
        :value="paymentMethodItem.code"
        class="payment-method__item"
        :class="{
          'pl-0':
            paymentMethod === paymentMethodItem.code &&
            paymentMethod !== 'on_site',
          'hide-radio':
            paymentMethod === paymentMethodItem.code &&
            paymentMethod !== 'on_site',
          'gray-bg':
            paymentMethod === paymentMethodItem.code &&
            paymentMethod === 'on_site'
        }"
        inline
        button
        plain
      >
        <div
          v-if="paymentMethodItem.code === 'credit_card'"
          class="payment-detail__info pay-online"
        >
          <div
            v-if="paymentMethod !== 'credit_card'"
            class="pay-online__section"
          >
            <div class="pay-online__section__text">
              <h6>{{ $t('payment_info.pay_online') }}</h6>
              <p>{{ paymentMethodItem.name }}</p>
            </div>
            <button
              class="button m-btn m-btn__white"
              @click="selectPaymentMethod(paymentMethodItem.code)"
            >
              <span class="icon-Icon-Credit-Card" />
              <span>{{ getLang.addCredit }}</span>
            </button>
          </div>
          <div v-else>
            <PayOnlineBilling />
          </div>
        </div>
        <div
          v-if="paymentMethodItem.code === 'on_site_credit_card_required'"
          class="payment-detail__info pay-online"
        >
          <div
            v-if="paymentMethod !== 'on_site_credit_card_required'"
            class="pay-online__section"
          >
            <div class="pay-online__section__text">
              <h6>{{ $t('payment_info.pay_online') }}</h6>
              <p>{{ paymentMethodItem.name }}</p>
            </div>
            <button
              class="button m-btn m-btn__white"
              @click="selectPaymentMethod(paymentMethodItem.code)"
            >
              <span class="icon-Icon-Credit-Card" />
              <span>{{ getLang.addCredit }}</span>
            </button>
          </div>
          <div v-else>
            <PayOnlineBilling />
          </div>
        </div>
        <div
          v-if="paymentMethodItem.code === 'on_site'"
          class="payment-detail__info pay-online"
        >
          <div class="pay-online__section">
            <div class="pay-online__section__text">
              <h6>{{ getLang.payLater }}</h6>
              <p>{{ getLang.payLaterText }}</p>
            </div>
            <button
              class="button m-btn m-btn__blue"
              @click="selectPaymentMethod(paymentMethodItem.code)"
            >
              {{ getLang.flexPlan }}
            </button>
          </div>
        </div>
      </b-form-radio>
    </b-form-radio-group>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { BFormRadio } from 'bootstrap-vue'
import { BookingActionTypes } from '@/store/booking/types'

export default {
  name: 'PaymentMethod',
  components: {
    BFormRadio
  },
  data() {
    return {
      paymentMethod: '',
      payLater: {}
    }
  },
  computed: {
    ...mapGetters({
      paymentMethodFromStore: 'paymentDetail/paymentMethod',
      paymentMethodList: 'paymentDetail/paymentMethodList'
    }),
    getLang() {
      return {
        payOnline: this.$t('payment_info.pay_online'),
        payOnlineText: this.$t('payment_info.pay_online_text'),
        addCredit: this.$t('payment_info.add_credit'),
        payLater: this.$t('payment_info.pay_later'),
        payLaterText: this.$t('payment_info.pay_later_text'),
        flexPlan: this.$t('payment_info.flex_plan')
      }
    }
  },
  watch: {
    paymentMethod(method) {
      this.changePaymentMethod(method)

      this.$store.commit(
        `booking/${BookingActionTypes.CREATE_RESERVATIONS_FAIL}`,
        null
      )
    }
  },
  created() {
    this.resetPaymentMethod()
  },
  mounted() {
    // if (
    //   this.paymentMethodList.length === 1 &&
    //   this.paymentMethodList[0].code !== 'on_site'
    // ) {
    //   this.paymentMethod = this.paymentMethodList[0].code
    // }
  },
  methods: {
    ...mapActions({
      changePaymentMethod: 'paymentDetail/changePaymentMethod',
      resetPaymentMethod: 'paymentDetail/resetPaymentMethod'
    }),

    selectPaymentMethod(method) {
      this.paymentMethod = method
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-method {
  &__item {
    padding-left: 40px;
    border-bottom: 1px solid $border-color-gray-2;
  }
}
.payment-detail__info.pay-online {
  padding: 35px 0;

  @include min-sm {
    padding-right: 15px;
  }
  cursor: pointer;
  input[type='radio'] {
    flex: 0 1 50px;
  }

  button {
    flex: 1 1 100%;
    height: 50px;

    @include min-sm {
      flex: 0 1 270px;
      margin-top: 0;
    }
  }

  .pay-online {
    &__section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      &__text {
        flex: 1;
        margin-right: 0;
        font-size: 14px;

        @include min-sm {
          margin-right: 15px;
        }

        h6 {
          font-weight: bold;
        }
      }
    }
  }
}
.gray-bg {
  background: #fafafa;
}

::v-deep {
  label {
    display: block;

    &::before {
      width: 16px;
      height: 16px;
    }

    &::after {
      width: 20px;
      height: 20px;
    }

    &::before,
    &::after {
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #1a489c;
    background-color: #1a489c;
  }

  .hide-radio {
    label {
      &::before,
      &::after {
        display: none;
      }
    }
  }
}
</style>

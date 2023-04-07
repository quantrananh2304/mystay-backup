<template>
  <div class="guest-detail__payment">
    <div class="guest-detail__payment call-out">
      <p class="is-bold">
        {{ getLang.questions }}
      </p>
      <div class="call-out__tel">
        <a :href="`tel:${hotelDetailV2.phone}`">
          <span class="icon-Icon-Phone" />
          {{ getLang.call }} {{ hotelDetailV2.phone }}
        </a>
      </div>
    </div>
    <GuestDetailPaymentInfo />
    <div v-show="!isLogin" class="guest-detail__payment login">
      <!-- <LoginBlock /> -->
      <TotalPrcie />
    </div>
    <div class="guest-detail__receive-subscription mb-2 mb-md-3">
      <CustomCheckbox
        id="receive-subscription"
        class="mt-1"
        :is-checked="isReceiveSubscription"
        @input="onChangeReceiveSubscription"
      />
      <label for="receive-subscription" class="receive-subscription-label">
        {{ $t('guest_detail.receive_subscription_text') }}
      </label>
    </div>
    <div class="guest-detail__payment__policy">
      <GuestDetailPolicy
        :is-click-payment="isClickPayment"
        @onCheckedPolicy="onCheckedPolicy"
      />
    </div>
    <button
      class="guest-detail__payment button m-btn m-btn__yellow"
      @click="$_handleGoToPayment"
    >
      {{ getLang.continueToPayment }}
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GuestDetailPayment',
  props: {
    isAuthened: Boolean
  },
  data() {
    return {
      isCheckedPolicy: false,
      isClickPayment: false
    }
  },
  computed: {
    ...mapState({
      selectedRoom: state => state.hotelDetail.selectedRoom,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI,
      hotelID: state => state.hotel.data.hotelID,
      extrasParams: state => state.guestDetail.extrasParams
    }),

    ...mapGetters({
      isFormInvalid: 'guestDetail/isFormInValid',
      isMakingForSomeoneFormInValid:
        'guestDetail/isMakingForSomeoneFormInValid',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      roomDetailFromAPI: 'hotelDetail/roomDetailFromAPI',
      totalPrice: 'hotelDetail/totalPrice',
      totalNight: 'booking/totalNight',
      roomList: 'booking/roomList',
      numberChildren: 'booking/numberChildren',
      numberAdults: 'booking/numberAdults',
      hotelSelected: 'hotel/hotelSelected',
      hotelDetailV2: 'hotelDetail/hotelDetailV2',
      isReceiveSubscription: 'guestDetail/isReceiveSubscription'
    }),

    getLang() {
      return {
        questions: this.$t('payment_detail.questions'),
        call: this.$t('payment_detail.call'),
        continueToPayment: this.$t('payment_detail.continue_payment')
      }
    }
  },
  methods: {
    ...mapActions({
      triggerSubmitButton: 'guestDetail/triggerSubmitButton',
      saveReceiveSubscription: 'guestDetail/saveReceiveSubscription'
    }),
    $_handleGoToPayment() {
      this.triggerSubmitButton()
      this.isClickPayment = true
      this.$nuxt.$emit('on:GoToPayment', this.isCheckedPolicy)
      if (
        !this.isFormInvalid &&
        !this.isMakingForSomeoneFormInValid &&
        this.isCheckedPolicy
      ) {
        if (this.extrasParams.length) {
          this.paymentGtm()
        }
      }
    },

    paymentGtm() {
      const additionalData = {
        triggerType: 'User Interaction',
        event: 'additionalQuestions',
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        hotelID: this.hotelID,
        roomID: this.roomDetailFromAPI[0]?.roomID,
        planID: this.roomDetailFromAPI[0]?.roomPlanCode
      }
      this.$gtm.push(additionalData)
    },

    onCheckedPolicy(isChecked) {
      this.isCheckedPolicy = isChecked
    },

    onChangeReceiveSubscription(val) {
      this.saveReceiveSubscription(val)
    }
  }
})
</script>

<style lang="scss" scoped>
.guest-detail__payment {
  display: none;
  &__policy {
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    cursor: pointer;

    a {
      font-size: 14px;
      cursor: pointer;
      color: #007bff;
      display: inline-flex;
      margin-bottom: 0;
      font-weight: normal;

      &:hover {
        text-decoration: underline;
      }
    }

    .label {
      margin-top: -5px;
    }

    .checkbox-error {
      color: #ec1000;
    }

    .checbox-success {
      color: #00805b;
    }
  }
  @include min-sm {
    display: block;
    margin: 30px auto;
    @include min-xl {
      width: 388px;
      margin: 0;
    }
  }
  &.call-out {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    p {
      margin-right: 10px;
      margin-bottom: 0;
      font-size: 14px;
    }
    .call-out {
      &__tel {
        white-space: nowrap;
        font-size: 13px;
        font-weight: bold;

        a {
          color: $text-color-blue-2;
        }
        [class^='icon-'],
        [class*=' icon-'] {
          margin-right: 5px;
          font-size: 15px;
        }
      }
    }
  }
  &.total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid $border-color-gray-2;
    background: $bg-color-yellow-2;
    padding: 15px 20px;
    border-radius: 2px;
    .total {
      &__left {
        h5 {
          color: $text-color-blue;
          margin-bottom: 5px;
        }
        a {
          display: block;
          font-size: 12px;
          color: $text-color-blue-2;
          margin: 0;
        }
      }
      &__right {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        [class^='icon-'],
        [class*=' icon-'] {
          margin-left: 10px;
          font-size: 15px;
        }
      }
    }
  }
  &.login {
    margin-top: 20px;
  }
  .button {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    position: relative;
    [class^='icon-'],
    [class*=' icon-'] {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      font-size: 20px;
    }
  }

  .guest-detail__receive-subscription {
    display: flex;
    align-items: center;
  }
  .receive-subscription-label {
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
}
</style>

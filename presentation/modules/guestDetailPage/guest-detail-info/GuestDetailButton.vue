<template>
  <div class="guest-detail-policy-mobile">
    <div class="container">
      <div class="receive-subscription mb-2 mb-md-3">
        <CustomCheckbox
          id="receive-subscription"
          class="receive-subscription__checkbox"
          :is-checked="isReceiveSubscription"
          @input="onChangeReceiveSubscription"
        />
        <label for="receive-subscription" class="receive-subscription-label">
          {{ $t('guest_detail.receive_subscription_text') }}
        </label>
      </div>
      <GuestDetailPolicy
        class="mt-3 mb-2 detail-policy"
        :is-click-payment="isClickPayment"
        @onCheckedPolicy="$_onCheckedPolicy"
      />
    </div>

    <div
      key="buttons"
      class="guest-detail__button"
      :class="{ 'is-fixed': isFixed }"
    >
      <button class="button m-btn m-btn__yellow" @click="$_handleGoToPayment">
        {{ $t('payment_info.proceed_to_payment') }}
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'GuestDetailButton',
  props: {},
  data() {
    return {
      isFullText: false,
      isPopupOpen: true,
      isFixed: false,
      isClickPayment: false,
      isCheckedPolicy: false,
      isFormValid: false
    }
  },
  computed: {
    ...mapGetters({
      isReceiveSubscription: 'guestDetail/isReceiveSubscription'
    })
  },
  mounted() {
    window.addEventListener('scroll', this.$_onScroll)

    this.$nuxt.$on('send:GuestFormValid', this.getFormStatus)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.$_onScroll)
    this.$nuxt.$off('send:GuestFormValid', this.getFormStatus)
  },
  methods: {
    ...mapActions({
      saveReceiveSubscription: 'guestDetail/saveReceiveSubscription'
    }),

    $_handleGoToPayment() {
      this.isClickPayment = true
      this.$nuxt.$emit('on:GoToPayment', this.isCheckedPolicy)

      const footerOffsetTop = document.querySelector('.detail-policy')
      if (
        this.isFormValid &&
        !this.isCheckedPolicy &&
        window.pageYOffset + window.innerHeight <
          footerOffsetTop.offsetTop + 100
      ) {
        window.scrollTo({
          top: footerOffsetTop.offsetTop,
          left: 0,
          behavior: 'smooth'
        })
      }
    },

    getFormStatus(isValid) {
      this.isFormValid = isValid
    },

    $_onScroll() {
      const footerOffsetTop = document.querySelector('.detail-policy')
      if (
        footerOffsetTop &&
        window.pageYOffset + window.innerHeight >=
          footerOffsetTop.offsetTop +
            footerOffsetTop.getBoundingClientRect().height +
            73
      ) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },

    $_onCheckedPolicy(isChecked) {
      this.isCheckedPolicy = isChecked
    },

    onChangeReceiveSubscription(val) {
      this.saveReceiveSubscription(val)
    }
  }
})
</script>

<style lang="scss" scoped>
.guest-detail {
  .container {
    @include min-sm {
      display: none;
    }
  }
  &__button {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
    display: flex;
    z-index: 5;
    justify-content: space-between;
    padding: 17px 15px 10px 17px;

    @include min-sm {
      display: none;
    }

    button {
      flex: 0 1 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 1px 2px 5px 3px rgba(0, 0, 0, 0.2);

      [class^='icon-'],
      [class*=' icon-'] {
        font-size: 17px;
        margin: 0 20px 0 -10px;
      }
    }
  }

  .is-fixed {
    position: static;
  }

  &__popup {
    width: 100%;
    background: $bg-color-pink;
    color: $white;
    padding: 10px 15px;
    font-size: 12px;
    display: flex;
    align-items: center;
    position: relative;

    [class^='icon-'],
    [class*=' icon-'] {
      font-size: 17px;
      margin-right: 15px;
    }

    [class^='icon-Icon-Close'],
    [class*=' icon-Icon-Close'] {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      margin: 0;
      padding: 7px;
      background: rgba($color: #000000, $alpha: 0.5);
      font-size: 8px;
      border-radius: 3px;
    }

    @include min-sm {
      display: none;
    }
  }

  .receive-subscription {
    display: flex;
    align-items: flex-start;

    &__checkbox {
      margin-top: 2px;
    }
  }
  .receive-subscription-label {
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s;
  transform: translate3d(0, 0, 0);
}

.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
</style>

<template>
  <div class="guest-detail-policy">
    <CustomCheckbox
      v-model="isCheckedPolicy"
      :is-checked="isCheckedPolicy"
      @input="$_onChangeCheckbox"
    />

    <div
      class="label"
      :class="{
        'checkbox-error': isError,
        'checbox-success': !isError && isClickPayment
      }"
      @click="$_onTriggerCheckbox"
      v-html="$t('guest_detail.terms_label')"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GuestDetailPayment',
  props: {
    isClickPayment: {
      type: Boolean
    }
  },
  data() {
    return {
      isCheckedPolicy: false,
      isError: false
    }
  },
  computed: {
    ...mapState({
      selectedRoom: state => state.hotelDetail.selectedRoom,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI,
      hotelID: state => state.hotel.data.hotelID
    }),

    ...mapGetters({
      isFormInvalid: 'guestDetail/isFormInValid'
    })
  },
  watch: {
    isClickPayment(isClick) {
      if (isClick) {
        if (this.isCheckedPolicy) {
          this.isError = false
        } else {
          this.isError = true
        }
      }
    }
  },
  mounted() {
    const guestTerms = document.querySelectorAll('.guest-terms')
    if (guestTerms) {
      guestTerms.forEach((term) => {
        term.addEventListener('click', this.$_onClickPolicyLink)
      })
    }
  },
  methods: {
    ...mapActions({
      triggerSubmitButton: 'guestDetail/triggerSubmitButton'
    }),

    $_onChangeCheckbox(isChecked) {
      if (this.isClickPayment) {
        if (isChecked) {
          this.isError = false
        } else {
          this.isError = true
        }
      }

      this.$emit('onCheckedPolicy', this.isCheckedPolicy)
    },

    $_onTriggerCheckbox() {
      this.isCheckedPolicy = !this.isCheckedPolicy
      if (this.isClickPayment) {
        if (this.isCheckedPolicy) {
          this.isError = false
        } else {
          this.isError = true
        }
      }
      this.$emit('onCheckedPolicy', this.isCheckedPolicy)
    },

    $_onClickPolicyLink() {
      this.isCheckedPolicy = !this.isCheckedPolicy
    }
  }
})
</script>

<style lang="scss" scoped>
.guest-detail-policy {
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  cursor: pointer;

  .app-checkbox {
    margin-right: 4px;
  }
  ::v-deep {
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
  }

  ::v-deep {
    .label {
      margin-top: -2px;
    }
  }

  .checkbox-error {
    color: #ec1000;
  }

  .checbox-success {
    color: #00805b;
  }
}
</style>

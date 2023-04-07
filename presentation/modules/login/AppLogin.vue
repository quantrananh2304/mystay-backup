<template>
  <div class="app-login">
    <h2 class="mb-5">
      {{ getLang.title }}
    </h2>
    <transition name="slide-in" mode="out-in">
      <div v-if="!isForgotPassword" key="login">
        <MystaysInput
          v-for="(v, name) in $v.inputValues.$model"
          :key="name"
          v-model="v.value"
          :label="v.label"
          :icon="v.icon"
          :type="v.type"
          :value="v.value"
          :input-name="v.name"
          :name="v.name"
          :error-message="errorMessage(v.name)"
          :password="v.type === 'password'"
          :required="!!$v.inputValues[v.name].value.$params.required"
          @enter="onSignIn"
        />

        <div
          v-if="loginErrorMessage && loginErrorMessage.length"
          class="text-danger text-center mb-2"
        >
          <div class="send-email-fail text-center">
            <span
              v-for="(error, index) in loginErrorMessage"
              :key="index"
              class="error text-center"
            >
              {{ error.title }}
            </span>
          </div>
        </div>
        <div class="app-login__forgot-password" @click="$_openForgotPassword">
          {{ forgotPassword.forgotPasswordText }}
        </div>
        <AppButton
          button-type="primary"
          button-width="100%"
          :button-text="getLang.login"
          :validated="loginValid"
          :is-loading="isLoading"
          :disabled="isLoading"
          @onclick="onSignIn"
        />
        <AppButton
          :button-text="getLang.toSignup"
          button-type="secondary"
          button-width="100%"
          :validated="false"
          @onclick="$_toggleSignup(true)"
        />
        <SigninWith />
      </div>
      <div v-else key="forgotPassword">
        <AppForgotPassword
          :is-re-enter-password-step="isReEnterPasswordStep"
          :get-language="getLang"
        />
      </div>
    </transition>
  </div>
</template>

<script>
// eslint-disable-next-line node/no-deprecated-api
import { isNullOrUndefined } from 'util'
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { BRAND_ID } from '../../../shared/constants/index'
import {
  emailValidationForOneField,
  passwordValidation
} from '../../../shared/helper/vuelidate-validator'

export default Vue.extend({
  name: 'AppLogin',
  data() {
    return {
      isForgotPassword: false,
      isReEnterPasswordStep: false,
      key: process.env.CLIENT_KEY,
      secret: process.env.CLIENT_SECRETE,
      validated: true,
      loginErrorMessage: [],
      inputValues: {}
    }
  },

  computed: {
    ...mapState({
      isResetPassword: state => state.appAuthen.isResetPassword,
      isLoading: state => state.users.data.isLoading,
      hotelIdFromLoginBlock: state => state.appAuthen.hotelId
    }),

    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language'
    }),

    loginValid() {
      return this.$v.inputValues.$dirty && this.$v.inputValues.$invalid
    },

    forgotPassword() {
      return {
        forgotPasswordHref: '/',
        forgotPasswordText: this.getLang.forgotPassword
      }
    },
    getLang() {
      return {
        lastName: this.$t('forms.last_name'),
        firstName: this.$t('forms.first_name'),
        kanjiLastName: this.$t('forms.kanji_last_name'),
        kanjiFirstName: this.$t('forms.kanji_first_name'),
        phone: this.$t('forms.phone'),
        email: this.$t('forms.email'),
        addComment: this.$t('forms.add_comment'),
        required: this.$t('forms.required'),
        validPhone: this.$t('forms.valid_phone'),
        validEmail: this.$t('forms.valid_email'),
        comments: this.$t('forms.comments'),
        password: this.$t('forms.password'),
        rePassword: this.$t('forms.re_enter_password'),
        cardName: this.$t('forms.card_name'),
        cardNumber: this.$t('forms.card_number'),
        cardSecurity: this.$t('forms.card_security'),
        bookingID: this.$t('forms.booking_id'),
        title: this.$t('login_signup.title'),
        forgotPassword: this.$t('login_signup.forgot_password'),
        login: this.$t('login_signup.login'),
        toSignup: this.$t('login_signup.to_signup')
      }
    },

    loginForm() {
      return {
        emailInput: {
          name: 'emailInput',
          value: '',
          type: 'email',
          label: this.getLang.email,
          icon: '',
          required: true,
          id: 1
        },
        passwordInput: {
          name: 'passwordInput',
          value: '',
          type: 'password',
          label: this.getLang.password,
          icon: 'icon-Icon-Virtual-Tour iconOnTheRight'
        }
      }
    }
  },
  watch: {
    isResetPassword: {
      handler(newValue) {
        if (newValue) {
          this.isForgotPassword = true
        } else {
          this.isForgotPassword = false
        }
      },
      immediate: true
    },

    lang() {
      this.inputValues = this.loginForm
    }
  },
  validations: {
    inputValues: {
      emailInput: {
        value: emailValidationForOneField
      },
      passwordInput: {
        value: passwordValidation
      }
    }
  },

  mounted() {
    this.$nuxt.$on('on:goToLogin', this.goToLogin)

    this.inputValues = this.loginForm
  },

  destroyed() {
    this.$scrollBody.enable()
    this.$nuxt.$off('on:goToLogin', this.goToLogin)
  },

  methods: {
    ...mapActions({
      toggleSignup: 'appAuthen/toggleSignup',
      closeLoginForm: 'appAuthen/toggleLogin',
      handleUserLogin: 'users/loginUser',
      isLoginSuccess: 'users/loginUserSuccess'
    }),

    goToLogin() {
      this.isForgotPassword = false
    },

    checkIsExits(param) {
      return isNullOrUndefined(param)
    },
    $_toggleSignup(isOpen) {
      if (this.$nuxt.isOnline) {
        this.toggleSignup({ isSignupOpen: isOpen })
      } else {
        alert('You are Offline')
      }
    },
    $_openForgotPassword() {
      this.isForgotPassword = true
    },

    errorMessage(name) {
      if (
        this.$v.inputValues[name]?.value?.hasOwnProperty('required') &&
        !this.$v.inputValues[name]?.value?.required &&
        this.$v.inputValues[name]?.value?.$dirty
      ) {
        return this.$t('forms.required')
      }

      if (
        this.$v.inputValues[name]?.value?.hasOwnProperty('email') &&
        !this.$v.inputValues[name]?.value?.email &&
        this.$v.inputValues[name]?.value?.$dirty
      ) {
        return this.$t('forms.valid_email')
      }

      return ''
    },

    onSignIn() {
      if (this.$nuxt.isOnline) {
        this.$v.inputValues.$touch()
        const data = {
          email: this.inputValues.emailInput.value,
          password: this.inputValues.passwordInput.value,
          hotel_id: BRAND_ID,
          fullLang: this.fullLang,
          hotelIdForGetMembership: this.hotelIdFromLoginBlock
            ? Number(this.hotelIdFromLoginBlock)
            : BRAND_ID
        }
        if (!this.$v.$invalid) {
          this.handleUserLogin(data)
            .then(() => {
              this.closeLoginForm(true)
              this.loginErrorMessage = []
            })
            .catch(error => (this.loginErrorMessage = error.message))

          this.$gtm.push({
            event: 'logIn',
            pageCategory: this.$route.name,
            language: this.$langFormat(this.lang),
            triggerType: 'User Interaction'
          })
        }
      } else {
        alert('You are Offline')
      }
    }
  }
})
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app-login {
  background: linear-gradient(
    29deg,
    $white 63%,
    $bg-color-blue-4 63%,
    $bg-color-blue-4 100%
  );
  padding: 20px;
  min-height: 100%;
  h2 {
    color: $text-color-blue;
    text-align: center;
    font-size: 22px;
    padding: 50px 45px 0 45px;
    margin-bottom: 10px;
    font-weight: 300;
  }
  label {
    margin-bottom: 3px;
  }
  a {
    color: $text-color-blue-2;
    margin: 0 auto 30px auto;
    font-size: 11px;
    display: table;
  }
  & &__forgot-password {
    color: $bg-color-blue-2;
    margin: 0 auto 30px auto;
    font-size: 11px;
    display: table;
    cursor: pointer;
  }
}
</style>

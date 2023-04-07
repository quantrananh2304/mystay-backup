<template>
  <div class="app-forgot-password">
    <hr>
    <transition name="slide-in" mode="out-in">
      <div
        v-if="
          (!isReEnterPasswordStep && !isConfirmSent && !isResetPawordSuccess) ||
            errorMessage.length
        "
        key="enterEmail"
        class="app-forgot-password__form"
      >
        <h3 class="mb-4">
          {{ getLang.forgotPasswordText }}
        </h3>
        <!-- <p>{{ getLang.forgotPasswordTextConfirm }}</p> -->
        <MystaysInput
          v-model="$v.emailInput.$model.value"
          :label="$v.emailInput.$model.label"
          :icon="$v.emailInput.$model.icon"
          :type="$v.emailInput.$model.type"
          :value="$v.emailInput.$model.value"
          :input-name="$v.emailInput.$model.name"
          :error-message="getErrorMessage($v.emailInput.$model.name)"
          :required="true"
          :name="$v.emailInput.$model.name"
          @enter="$_sendVerification"
        />

        <app-button
          button-type="primary"
          button-width="100%"
          :button-text="getLang.forgotPasswordConfirm"
          :disabled="resetPasswordLoading"
          :is-loading="resetPasswordLoading"
          @onclick="$_sendVerification"
        />

        <div class="send-email-fail text-center">
          <span
            v-for="(error, index) in errorMessage"
            :key="index"
            class="error text-center"
          >
            {{ error.title }}
          </span>
        </div>
      </div>
      <div
        v-else-if="
          !isReEnterPasswordStep &&
            isConfirmSent &&
            !isResetPawordSuccess &&
            !errorMessage.length
        "
        key="confirmSent"
        class="app-forgot-password__confirm-sent text-center"
      >
        <h4>{{ getLang.emailSent }} {{ emailInput.value }}</h4>
      </div>
      <div
        v-else-if="
          isReEnterPasswordStep && isConfirmSent && !isResetPawordSuccess
        "
        key="enterPasswords"
        class="app-forgot-password__change-password"
      >
        <h3>{{ getLang.newPassword }}</h3>

        <MystaysInput
          v-for="(v, name) in $v.inputPassword.$model"
          :key="name"
          v-model="v.value"
          :label="v.label"
          :icon="v.icon"
          :type="v.type"
          :value="v.value"
          :input-name="v.name"
          :name="v.name"
          :password="v.type === 'password'"
          :error-message="getResetPasswordErrorMessage(v.name)"
          :required="!!$v.inputPassword[v.name].value.$params.required"
          @enter="$_changePassword"
        />
        <app-button
          :button-text="getLang.changePassword"
          button-type="primary"
          button-width="100%"
          :is-loading="changePasswordLoading"
          :validated="passwordValid"
          :disabled="changePasswordLoading"
          @onclick="$_changePassword"
        />
        <div class="text-center">
          <span v-if="updatePasswordErrorMsg" class="app-input__validation">
            {{ updatePasswordErrorMsg }}
          </span>
        </div>
      </div>
      <div
        v-else
        key="ressetSuccess"
        class="app-forgot-password__reset-success"
      >
        <h3 class="text-center">
          {{ 'Reset password successfully' }}
        </h3>
        <div
          class="app-login__forgot-password d-flex justify-content-center mt-4"
        >
          <button class="m-btn m-btn__yellow" @click="$_goToLogin">
            {{ getLang.login }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { required, sameAs } from 'vuelidate/lib/validators'
import { emailValidationForOneField } from '../../../shared/helper/vuelidate-validator'
export default {
  props: {
    getLanguage: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isReEnterPasswordStep: false,
      isConfirmSent: false,
      isResetPawordSuccess: false,
      emailInput: {
        name: 'emailInput',
        value: '',
        type: 'email',
        label: this.getLanguage.email,
        icon: '',
        required: true
      },
      inputPassword: {
        passwordInput: {
          name: 'passwordInput',
          value: '',
          type: 'password',
          label: this.getLanguage.password,
          icon: 'Icon-Virtual-Tour',
          required: true
        },
        rePasswordInput: {
          name: 'rePasswordInput',
          value: '',
          type: 'password',
          label: this.getLanguage.rePassword,
          icon: 'Icon-Virtual-Tour',
          required: true
        }
      },
      errorMessage: [],
      updatePasswordErrorMsg: '',
      resetPasswordLoading: false,
      changePasswordLoading: false,
      isResetPasswordSuccess: false
    }
  },
  validations: {
    emailInput: {
      value: emailValidationForOneField
    },
    inputPassword: {
      passwordInput: {
        value: { required }
      },
      rePasswordInput: {
        value: {
          required,
          sameAsPassword: sameAs(function() {
            return this.inputPassword.passwordInput.value
          })
        }
      }
    }
  },
  computed: {
    ...mapState({
      isResetPassword: state => state.appAuthen.isResetPassword,
      ressetToken: state => state.users.data.ressetPasswordToken
    }),
    ...mapGetters({
      lang: 'appHeader/language'
    }),

    passwordValid() {
      return this.$v.inputPassword.$dirty && this.$v.inputPassword.$invalid
    },
    getLang() {
      return {
        required: this.$t('forms.required'),
        validEmail: this.$t('forms.valid_email'),
        forgotPasswordText: this.$t('login_signup.forgot_password_text'),
        forgotPasswordTextConfirm: this.$t(
          'login_signup.forgot_password_text_confirm'
        ),
        forgotPasswordConfirm: this.$t('login_signup.forgot_password_confirm'),
        emailSent: this.$t('login_signup.email_sent_text'),
        newPassword: this.$t('login_signup.new_password'),
        changePassword: this.$t('login_signup.change_password_button'),
        lastName: this.$t('forms.last_name'),
        firstName: this.$t('forms.first_name'),
        kanjiLastName: this.$t('forms.kanji_last_name'),
        kanjiFirstName: this.$t('forms.kanji_first_name'),
        phone: this.$t('forms.phone'),
        email: this.$t('forms.email'),
        addComment: this.$t('forms.add_comment'),
        validPhone: this.$t('forms.valid_phone'),
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
    }
  },
  watch: {
    isResetPassword: {
      handler(newValue) {
        if (newValue) {
          this.isReEnterPasswordStep = true
          this.isConfirmSent = true
        }
      },
      immediate: true
    },
    isResetPasswordSuccess(newValue) {
      if (newValue) {
        this.isResetPawordSuccess = true
      }
    }
  },
  destroyed() {
    this.resetData()
  },
  methods: {
    ...mapActions({
      handleResetPassword: 'users/resetPassword',
      handleUpdatePassword: 'users/updatePassword',
      goToLogin: 'appAuthen/goToLogin',
      resetData: 'appAuthen/resetData'
    }),

    $_goToLogin() {
      this.$router.push('/')
      this.$nuxt.$emit('on:goToLogin')
    },

    getErrorMessage() {
      if (
        !this.$v.emailInput?.value?.required &&
        this.$v.emailInput?.value?.$dirty
      ) {
        return this.$t('forms.required')
      }

      if (
        !this.$v.emailInput?.value?.email &&
        this.$v.emailInput?.value?.$dirty
      ) {
        return this.$t('forms.valid_email')
      }

      return ''
    },

    getResetPasswordErrorMessage(name) {
      if (
        !this.$v.inputPassword[name]?.value?.required &&
        this.$v.inputPassword[name]?.value?.$dirty
      ) {
        return this.$t('forms.required')
      }

      if (
        !this.$v.inputPassword[name]?.value?.sameAsPassword &&
        this.$v.inputPassword[name]?.value?.$dirty &&
        name === 'rePasswordInput'
      ) {
        return 'RePassword not Match'
      }

      return ''
    },

    async $_sendVerification() {
      this.$v.emailInput.$touch()
      if (!this.$v.emailInput.$invalid) {
        this.resetPasswordLoading = true
        const email = this.emailInput.value
        const payload = {
          body: {
            email
          },
          hotel_id: process.env.GLOBAL_HOTEL_ID
        }

        try {
          await this.$triplaRepo.users.resetPassword(payload)
          this.isConfirmSent = true
          this.errorMessage = []
          this.resetPasswordLoading = false
        } catch (error) {
          this.errorMessage = error.message
          this.resetPasswordLoading = false
        }

        this.$gtm.push({
          event: 'forgotPassword',
          pageCategory: this.$route.name,
          language: this.$langFormat(this.lang),
          triggerType: 'User Interaction'
        })
      }
    },
    async $_changePassword() {
      this.$v.inputPassword.$touch()
      if (!this.$v.inputPassword.$invalid) {
        this.changePasswordLoading = true
        const params = {
          password: this.inputPassword.passwordInput.value,
          reset_password_token: this.$route.query.reset_password_token
        }

        try {
          const data = await this.$triplaRepo.users.updatePassword({
            hotel_id: process.env.GLOBAL_HOTEL_ID,
            body: params
          })

          if (data) {
            this.isResetPasswordSuccess = true
            this.changePasswordLoading = false
          }
        } catch (error) {
          this.changePasswordLoading = false
          this.isResetPasswordSuccess = false
          this.updatePasswordErrorMsg = error.message[0]?.title || ''
        }

        this.$gtm.push({
          event: 'updatePassword',
          pageCategory: this.$route.name,
          language: this.$langFormat(this.lang),
          triggerType: 'User Interaction'
        })
      }
    },

    inputEmails(target) {
      const obj = this.inputEmail[target.name]
      this.inputEmail = {
        ...this.inputEmail,
        [target.name]: {
          ...obj,
          value: target.value
        }
      }
      this.$v.inputEmail[target.name].value.$touch()
    },

    inputPasswords(target) {
      const obj = this.inputPassword[target.name]
      this.inputPassword = {
        ...this.inputPassword,
        [target.name]: {
          ...obj,
          value: target.value
        }
      }
      this.$v.inputPassword[target.name].value.$touch()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3,
p {
  color: $text-color-blue;
}

h3 {
  margin-top: 50px;
  font-size: 25px;
  margin-bottom: 20px;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.3s;
  transform: translate3d(0, 0, 0);
}

.slide-in-enter,
.slide-in-leave-to {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.app-login__forgot-password {
  font-size: 15px !important;

  button {
    padding: 10px 30px;
  }
}
</style>

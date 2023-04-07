<template>
  <div class="app-signup page">
    <h2 class="app-signup__title mb-4">
      {{ getLang.title }}
    </h2>
    <transition name="slide-in" mode="out-in">
      <div v-if="!signUpSuccess && !verified" key="signup">
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
          @enter="onSignUp"
        />
        <span
          v-if="error"
          class="app-input__validation mb-4 d-block text-center"
        >
          {{ error }}
        </span>
        <AppButton
          :button-text="getLang.signUp"
          button-type="primary"
          button-width="100%"
          :validated="signupValid"
          :is-loading="isLoading"
          @onclick="onSignUp"
        />
        <AppButton
          :button-text="getLang.toLogin"
          button-type="secondary"
          button-width="100%"
          :validated="false"
          @onclick="$_toggleLogin(true)"
        />
        <SigninWith />
      </div>
      <div v-else-if="signUpSuccess && !verified" key="signupEmail">
        <h2>{{ getLang.emailSent }} {{ inputValues.emailInput.value }}</h2>
      </div>
      <div
        v-else-if="!signUpSuccess && verified"
        key="verified"
        class="app-signup__verified"
      >
        <h2>{{ getLang.thankYouText }}</h2>
      </div>
    </transition>
  </div>
</template>

<script>
import { isNullOrUndefined } from 'util'
import { mapActions, mapGetters, mapState } from 'vuex'
import { required, sameAs } from 'vuelidate/lib/validators'
import { BRAND_ID } from '../../../shared/constants'
import {
  emailValidation,
  passwordValidation,
  requiredValidation,
  hiraganaValidation
} from '../../../shared/helper/vuelidate-validator'

export default {
  name: 'AppSignup',
  data() {
    return {
      verified: false,
      error: '',
      signUpSuccess: false,
      inputValues: {}
    }
  },
  validations() {
    if (this.lang === 'ja') {
      return {
        inputValues: {
          emailInput: {
            value: emailValidation
          },
          lastName: {
            value: requiredValidation
          },
          firstName: {
            value: requiredValidation
          },
          lastNameKana: {
            value: hiraganaValidation
          },
          firstNameKana: {
            value: hiraganaValidation
          },
          passwordInput: {
            value: passwordValidation
          },
          rePasswordInput: {
            value: {
              required,
              sameAsPassword: sameAs(function() {
                return this.inputValues.passwordInput.value
              })
            }
          }
        }
      }
    }

    return {
      inputValues: {
        emailInput: {
          value: emailValidation
        },
        lastName: {
          value: requiredValidation
        },
        firstName: {
          value: requiredValidation
        },
        passwordInput: {
          value: passwordValidation
        },
        rePasswordInput: {
          value: {
            required,
            sameAsPassword: sameAs(function() {
              return this.inputValues.passwordInput.value
            })
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      lang: 'appHeader/language'
    }),
    ...mapState({
      language: state => state.appHeader.data.language,
      isLoading: state => state.users.data.isLoading,
      hotelIdFromLoginBlock: state => state.appAuthen.hotelId
    }),

    isValid() {
      return !this.$v.$invalid
    },

    findOutMore() {
      return {
        findOutMoreHref: '/',
        findOutMoreText: this.getLang.findOut
      }
    },

    signupValid() {
      return this.$v.inputValues.$dirty && this.$v.inputValues.$invalid
    },

    userForm() {
      if (this.$i18n.locale === 'ja') {
        return {
          emailInput: {
            name: 'emailInput',
            value: '',
            type: 'email',
            label: this.getLang.email,
            id: 1
          },
          lastName: {
            name: 'lastName',
            value: '',
            type: 'text',
            label:
              this.language === 'ja'
                ? this.getLang.kanjiLastName
                : this.getLang.lastName
          },
          firstName: {
            name: 'firstName',
            value: '',
            type: 'text',
            label:
              this.language === 'ja'
                ? this.getLang.kanjiFirstName
                : this.getLang.firstName
          },
          lastNameKana: {
            name: 'lastNameKana',
            value: '',
            type: 'text',
            label: this.$t('forms.kana_last_name')
          },
          firstNameKana: {
            name: 'firstNameKana',
            value: '',
            type: 'text',
            label: this.$t('forms.kana_first_name')
          },
          passwordInput: {
            name: 'passwordInput',
            value: '',
            type: 'password',
            label: this.getLang.password,
            icon: 'icon-Icon-Virtual-Tour iconOnTheRight'
          },
          rePasswordInput: {
            name: 'rePasswordInput',
            value: '',
            type: 'password',
            label: this.getLang.rePassword,
            icon: 'icon-Icon-Virtual-Tour iconOnTheRight'
          }
        }
      }
      return {
        emailInput: {
          name: 'emailInput',
          value: '',
          type: 'email',
          label: this.getLang.email,
          id: 1
        },
        lastName: {
          name: 'lastName',
          value: '',
          type: 'text',
          label:
            this.language === 'ja'
              ? this.getLang.kanjiLastName
              : this.getLang.lastName
        },
        firstName: {
          name: 'firstName',
          value: '',
          type: 'text',
          label:
            this.language === 'ja'
              ? this.getLang.kanjiFirstName
              : this.getLang.firstName
        },
        passwordInput: {
          name: 'passwordInput',
          value: '',
          type: 'password',
          label: this.getLang.password,
          icon: 'icon-Icon-Virtual-Tour iconOnTheRight'
        },
        rePasswordInput: {
          name: 'rePasswordInput',
          value: '',
          type: 'password',
          label: this.getLang.rePassword,
          icon: 'icon-Icon-Virtual-Tour iconOnTheRight'
        }
      }
    },

    getLang() {
      return {
        title: this.$t('login_signup.title'),
        signUp: this.$t('login_signup.signup'),
        toLogin: this.$t('login_signup.to_login'),
        thankYouText: this.$t('login_signup.thank_you_text'),
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
        forgotPassword: this.$t('login_signup.forgot_password'),
        login: this.$t('login_signup.login'),
        toSignup: this.$t('login_signup.to_signup')
      }
    }
  },

  watch: {
    lang() {
      this.inputValues = this.userForm
    }
  },

  mounted() {
    this.inputValues = this.userForm
  },

  methods: {
    ...mapActions({
      toggleLogin: 'appAuthen/toggleLogin',
      toggleSignup: 'appAuthen/toggleSignup',
      handleSignupUser: 'users/signupUser'
    }),

    checkIsExits(param) {
      return isNullOrUndefined(param)
    },

    $_toggleLogin(isOpen) {
      this.toggleLogin({ isLoginOpen: isOpen })
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

      if (
        this.$v.inputValues[name]?.value?.hasOwnProperty(
          'hiraganaValidation'
        ) &&
        !this.$v.inputValues[name]?.value?.hiraganaValidation &&
        this.$v.inputValues[name]?.value?.$dirty
      ) {
        return this.$t('forms.hiragana_validation')
      }

      if (
        this.$v.inputValues[name]?.value?.hasOwnProperty('sameAsPassword') &&
        !this.$v.inputValues[name]?.value?.sameAsPassword &&
        this.$v.inputValues[name]?.value?.$dirty
      ) {
        return this.$t('forms.same_password_msg')
      }

      return ''
    },

    onSignUp() {
      if (this.$nuxt.isOnline) {
        this.$v.$touch()
        if (this.isValid) {
          const user = {
            first_name: this.inputValues.firstName.value,
            last_name: this.inputValues.lastName.value,
            first_name_kana:
              this.inputValues?.firstNameKana?.value ||
              this.inputValues.firstName.value,
            last_name_kana:
              this.inputValues?.lastNameKana?.value ||
              this.inputValues.lastName.value,
            email: this.inputValues.emailInput.value,
            password: this.inputValues.passwordInput.value,
            password_confirm: this.inputValues.rePasswordInput.value,
            hotel_id: this.hotelIdFromLoginBlock
              ? Number(this.hotelIdFromLoginBlock)
              : BRAND_ID,
            email_permission: true
          }

          this.handleSignupUser(user)
            .then(() => {
              this.error = ''
              this.signUpSuccess = true
            })
            .catch((err) => {
              this.error = err
              this.signUpSuccess = false
            })

          this.$gtm.push({
            event: 'signUp',
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app-signup {
  &__verified {
    text-transform: uppercase;
  }

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

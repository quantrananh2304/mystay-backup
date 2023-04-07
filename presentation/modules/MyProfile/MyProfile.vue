<template>
  <div>
    <div class="my-profile-page__content">
      <div v-if="userInfo" id="profile" class="my-profile-page__content__tab">
        <div class="title">
          <span class="title-text font-weight-bold">
            {{ $t('headers.my_profile') }}
          </span>
          <div class="title-icon" @click="editProfile">
            <span>{{ $t('my_profile.edit_profile') }} -</span>
            <BIconPencilSquare />
          </div>
        </div>
        <div
          v-for="(v, vIdx) in $v.userInfo.$model"
          :key="vIdx"
          class="my-profile-page__content__input"
          :class="{
            'mb-2': v.name !== 'birthday',
            'mb-4': v.name === 'birthday',
            hide:
              !showInput &&
              [
                'perfectureOrState',
                'streetAddress'
                // 'mulnicipality', 'city'
              ].includes(v.name)
          }"
        >
          <MystaysInput
            v-if="v.type === 'input'"
            v-model="v.value"
            :label="v.label"
            :disabled="!v.editable || !editable"
            :name="v.name"
            :error-message="
              v.name === userInfo.postalCode.name
                ? postalCodeInvalid
                : errorMessage(v.name)
            "
            :required="!!$v.userInfo[v.name].value.$params.required && editable"
            @keyup="$v.userInfo[v.name].value.$touch()"
            @keypress="e => onlyPhoneNumberInput(e, v.name)"
            @keyup.enter.prevent="e => onSearchPostalCode(e, v.name)"
            @blur.prevent="e => onSearchPostalCode(e, v.name)"
          >
            <template v-if="v.name === 'postalCode'" #spinner>
              <b-spinner
                class="spinner"
                :class="{ hide: !isSearchingPostal }"
                :style="{ top: postalCodeInvalid ? '40%' : '50%' }"
                :variant="'secondary'"
              />
            </template>
          </MystaysInput>
          <CalendarInput
            v-if="v.name === 'birthday'"
            v-model="v.value"
            :label="v.label"
            :icon="'item.icon'"
            :input-name="v.name"
            :disabled="!v.editable || !editable"
          />
          <div v-if="v.name === 'gender'">
            <label>{{ v.label }}</label>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              class="gender-group mb-2"
            >
              <b-form-radio-group
                v-model="gender"
                :aria-describedby="ariaDescribedby"
                class="mt-2"
                name="radio-inline"
                :options="genderOptions"
                :disabled="!v.editable || !editable"
                label=""
                size="lg"
                plain
              />
            </b-form-group>
          </div>
          <div v-if="v.name === 'country'">
            <label>{{ v.label }}</label>
            <AppSelectDesktop
              :list-options="countryList"
              :selected-value="v.value"
              is-auto-complete
              :is-disable="!v.editable || !editable"
              class="country-dropdown"
              @onClickItem="selectCountry"
            />
          </div>
        </div>
        <div v-if="editable" class="form-submit-button">
          <button
            class="
              app-button app-button--primary
              float-right
              cancel-button
              mr-3
              button
            "
            @click="cancelUpdate"
          >
            {{ $t('summary.cancel') }}
          </button>
          <button
            class="
              app-button app-button--primary
              float-right
              submit-button
              button
            "
            type="submit"
            :disabled="($v.$dirty && $v.$invalid) || isUpdateProfileLoading"
            @click="updateProfile"
          >
            <b-spinner v-if="isUpdateProfileLoading" class="mr-2" small />
            {{ $t('cancelreservation.submit') }}
          </button>
        </div>
      </div>
    </div>
    <MyStayPopup
      ref="submit-error"
      :modal-class="`submit-error`"
      class="popup"
      size="lg"
    >
      <div class="submit-error text-center">
        {{ errorText || 'Error' }}
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { myProfileValidation, myProfileDefault } from './utils'
import { STATIC_HOTEL_ID } from '@/shared/constants'
import { onlyPhoneNumber } from '~/utils/validations/phoneNumber'

export default {
  name: 'MyProfile',
  data() {
    return {
      editable: false,
      userInfo: {},
      errorText: '',
      countryList: [],
      isUpdateProfileLoading: false,
      isSearchingPostal: false,
      showInput: true,
      postalCodeInvalid: ''
    }
  },
  computed: {
    ...mapState({
      userData: state => state.users.data.userData,
      isUpdateSuccess: state => state.users.data.isUpdateSuccess
    }),

    ...mapGetters({
      lang: 'appHeader/language',
      users: 'users/userData'
    }),

    genderOptions() {
      return [
        { text: this.$t('confirmbooking.male'), value: 'male' },
        { text: this.$t('confirmbooking.female'), value: 'female' }
      ]
    },

    gender: {
      get() {
        return this.userInfo.gender.value
      },
      set(value) {
        this.userInfo.gender.value = value
      }
    },

    isValid() {
      return !this.$v.$invalid
    }
  },
  watch: {
    lang() {
      if (this.userData && this.userData.first_name) {
        this.userInfo = myProfileDefault(this.userData, this)
      }

      this.$v.$touch()
    }
  },

  mounted() {
    if (this.userData && this.userData.first_name) {
      this.userInfo = myProfileDefault(this.userData, this)
    }

    import(
      /* webpackChunkName: "contriesList" */ '@/shared/dataFake/contriesList'
    ).then(({ countryListAllIsoData }) => {
      this.countryList = countryListAllIsoData.map((country) => {
        return {
          text: country.name,
          value: country.code
        }
      })
    })
  },

  validations() {
    return myProfileValidation(this.editable, this.lang)
  },
  methods: {
    ...mapActions({
      handleUpdateUserInfo: 'users/updateUserInfo'
    }),
    editProfile() {
      this.editable = !this.editable
    },

    onlyPhoneNumberInput(e, name) {
      if (name === 'phoneNumber') {
        return onlyPhoneNumber(e)
      }
    },

    cancelUpdate() {
      this.$v.$reset()
      this.userInfo = myProfileDefault(this.userData, this)
      this.editable = false
      this.postalCodeInvalid = ''
    },

    updateProfile() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const user = {
          first_name: this.userInfo.firstName?.value,
          last_name: this.userInfo.lastName?.value,
          email_permission: true,
          birthday: this.userInfo.birthday?.value,
          phone: this.userInfo.phoneNumber?.value,
          street_address: this.userInfo.streetAddress?.value,
          prefecture_or_state: this.userInfo.perfectureOrState?.value,
          // mulnicipality: this.userInfo.mulnicipality?.value,
          // city: this.userInfo.city?.value,
          postal_code: this.userInfo.postalCode?.value,
          first_name_kana: this.userInfo?.firstNameKana?.value || '',
          last_name_kana: this.userInfo?.lastNameKana?.value || '',
          gender: this.userInfo.gender.value,
          hotel_id: STATIC_HOTEL_ID,
          country: this.userInfo.country.value,
          session: this.userData.session
        }
        this.isUpdateProfileLoading = true
        this.handleUpdateUserInfo(user)
          .then(() => {
            this.errorText = ''
            this.editable = false
            this.isUpdateProfileLoading = false
            this.$bvToast.toast(
              this.$t('my_profile.updated_profile_successfully'),
              {
                title: this.$t('my_profile.successfully'),
                toaster: 'b-toaster-top-center',
                solid: true,
                appendToast: true,
                variant: 'success'
              }
            )
          })
          .catch((err) => {
            this.errorText = err
            this.isUpdateProfileLoading = false
            this.$refs['submit-error'].showModal()
          })
      }
    },

    selectCountry(value) {
      this.$v.userInfo.$model.country.value = value

      if (value === 'JP') {
        this.showInput = false
      } else {
        this.showInput = true
        this.postalCodeInvalid = ''
      }

      this.$v.userInfo.$model.postalCode.value = ''
      this.$v.userInfo.$model.streetAddress.value = ''
      this.$v.userInfo.$model.perfectureOrState.value = ''
    },

    errorMessage(name) {
      if (this.editable) {
        if (
          // eslint-disable-next-line no-prototype-builtins
          this.$v.userInfo[name]?.value?.hasOwnProperty('required') &&
          !this.$v.userInfo[name]?.value?.required &&
          this.$v.userInfo[name]?.value?.$dirty
        ) {
          return this.$t('forms.required')
        }
        if (
          // eslint-disable-next-line no-prototype-builtins
          this.$v.userInfo[name]?.value?.hasOwnProperty(
            'japanLangValidation'
          ) &&
          !this.$v.userInfo[name]?.value?.japanLangValidation &&
          this.$v.userInfo[name]?.value?.$dirty
        ) {
          return this.$t('forms.japan_validation')
        }
        if (
          // eslint-disable-next-line no-prototype-builtins
          this.$v.userInfo[name]?.value?.hasOwnProperty('hiraganaValidation') &&
          !this.$v.userInfo[name]?.value?.hiraganaValidation &&
          this.$v.userInfo[name]?.value?.$dirty
        ) {
          return this.$t('forms.hiragana_validation')
        }
        if (
          // eslint-disable-next-line no-prototype-builtins
          this.$v.userInfo[name]?.value?.hasOwnProperty('kanjiValidation') &&
          !this.$v.userInfo[name]?.value?.kanjiValidation &&
          this.$v.userInfo[name]?.value?.$dirty
        ) {
          return this.$t('forms.hiragana_validation')
        }

        if (
          // eslint-disable-next-line no-prototype-builtins
          this.$v.userInfo[name]?.value?.hasOwnProperty('englishValidation') &&
          !this.$v.userInfo[name]?.value?.englishValidation &&
          this.$v.userInfo[name]?.value?.$dirty
        ) {
          return this.$t('forms.input_in_english')
        }

        return ''
      }
      return ''
    },

    onSearchPostalCode(e, inputName) {
      if (
        this.$v.userInfo.$model.country.value === 'JP' &&
        inputName === 'postalCode'
      ) {
        this.isSearchingPostal = true

        const zipCode = e.target.value

        // eslint-disable-next-line no-undef
        ZipCodeJp.setRootUrl('https://kmdsbng.github.io/zipcode_jp/')

        // eslint-disable-next-line no-undef
        ZipCodeJp.getAddressesOfZipCode(zipCode, (err, res) => {
          if (err || res.length < 1) {
            this.isSearchingPostal = false
            this.showInput = true

            this.$v.userInfo.$model.streetAddress.value = ''
            this.$v.userInfo.$model.perfectureOrState.value = ''
            // this.$v.userInfo.$model.city.value = ''
            // this.$v.userInfo.$model.mulnicipality.value = ''

            this.postalCodeInvalid = this.$t('forms.postal_code_invalid')
          } else {
            const {
              prefecture_name,
              town_name
              // , city_name
            } = res[0]

            this.showInput = true

            this.isSearchingPostal = false

            this.$v.userInfo.$model.postalCode.value = zipCode
            this.$v.userInfo.$model.streetAddress.value = town_name
            this.$v.userInfo.$model.perfectureOrState.value = prefecture_name

            this.postalCodeInvalid = ''
            // this.$v.userInfo.$model.city.value = city_name
            // this.$v.userInfo.$model.mulnicipality.value = city_name
          }
        })
      }
    }
  },

  head() {
    return {
      script: [{ src: 'https://kmdsbng.github.io/zipcode_jp/api.js' }]
    }
  }
}
</script>

<style lang="scss" scoped>
.my-profile-page {
  width: 100%;
  height: 800px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddee0;

  @include min-sm {
    flex-direction: row;
  }

  &__content {
    width: 100%;

    @include min-sm {
      padding: 30px;
    }

    &__tab {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: baseline;
      @include min-sm {
        padding: 0;
      }

      .hide {
        display: none;
      }

      .title {
        font-size: 30px;
        width: 100%;
        color: #000;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .title-icon {
        cursor: pointer;
        float: right;
        font-size: 15px;
        margin-bottom: 7px;
        &:hover {
          color: grey;
        }
      }
    }

    &__cancel-membership {
      display: flex;
      justify-content: center;
      button {
        padding: 8px 30px;
      }
    }

    &__input {
      width: 49%;

      .spinner-border {
        height: 1.5rem;
        width: 1.5rem;
        position: absolute;
        right: 3%;
      }
    }
  }
}

.country-dropdown {
  height: 50px;
}

.form-submit-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  @include min-sm {
    justify-content: flex-end;
  }

  .button {
    float: right;
    font-weight: bold;
    border: none;
    padding: 15px;
    margin-bottom: 20px;
    font-size: 14px;
    width: 48%;
    text-transform: uppercase;

    &:disabled {
      background: #ccd4da;
    }

    @include min-sm {
      width: 25%;
    }
  }
  .submit-button {
    background: #ffd25d;
    color: #232e48;
  }

  .cancel-button {
    background: #1a489c;
    color: white;
  }
}

label {
  font-size: 13px;
  color: #232e48;
  margin-bottom: 3px;
  height: 19px;
  font-weight: bold;

  .bv-no-focus-ring {
    margin-bottom: 10px;
  }
}

.submit-error {
  padding: 20px;
  color: red;
}
</style>

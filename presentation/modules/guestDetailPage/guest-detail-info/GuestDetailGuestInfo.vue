<template>
  <div class="guest-detail__guest-info-wrapper">
    <div name="fade">
      <div
        v-for="(guestInfo, index) in guestInfosLang"
        :key="guestInfo.guestId"
        class="guest-detail__guest-info"
      >
        <!-- <h3>{{ getLang.guest }} {{ index + 1 }}</h3> -->
        <div class="d-flex flex-wrap justify-content-between">
          <div
            v-if="guestInfo.guestId !== 1"
            class="guest-detail__guest-info__close"
            @click="$_deleteGuest(guestInfo.guestId)"
          >
            {{ getLang.removeGuest }} <span class="icon-Icon-Minus" />
          </div>
          <InputCustom
            v-for="(inputValue, name) in guestInfo.guestInfoInput"
            :key="name"
            :class="{ 'w-100': inputValue.name == 'textarea' }"
            :label="inputValue.label"
            :icon="inputValue.icon"
            :type="inputValue.type"
            :placeholder="inputValue.placeholder"
            :data-index="index"
            :value="inputValue.value"
            :input-name="inputValue.name"
            :validations="
              $v.guestInfos.$each[index].guestInfoInput[inputValue.name].value
            "
            @input="input"
          >
            <span class="app-input__validation">
              {{ errorText(index, inputValue.name, inputValue.validationName) }}
            </span>
          </InputCustom>
          <CustomCheckbox
            v-if="roomParamsForGetRoomSelected.length === 1"
            v-model="isMakingForSomeone"
            font-size="15px"
            color="#212529"
            :is-checked="isMakingForSomeone"
            :label-text="getLang.bookingForSomeone"
          />
        </div>
        <GuestDetailBookingForSomeone
          v-if="isMakingForSomeone && roomParamsForGetRoomSelected.length === 1"
          ref="book-for-someone-else"
          :is-making-for-someone="isMakingForSomeone"
        />
      </div>
      <div
        v-if="guestInfos.length < roomParamsForGetRoomSelected.length"
        class="guest-detail__guest-info-add-guest"
        @click="$_addGuest"
      >
        <span class="icon-Icon-Plus" />
        {{ getLang.addGuest }}
      </div>
    </div>

    <div class="payment-method">
      <p>
        <input type="hidden" value name="kameitenn_chumon_bango">
        <input id="token" type="hidden" value name="token">
      </p>
    </div>

    <AdditionalQuestions ref="addtional-forms" />
  </div>
</template>

<script>
// eslint-disable-next-line node/no-deprecated-api
import { isNullOrUndefined } from 'util'
import { mapActions, mapGetters, mapState } from 'vuex'
import { guestValidation, guestInfoInput } from '../util'

export default {
  name: 'GuestDetailGuestInfo',
  data() {
    return {
      isMakingForSomeone: false,
      currentBillingIsSameStatus: ['billing-is-same'],
      guestInfos: [],
      isMakeForSomeoneFormValid: false,
      additionalPayload: [],
      additionalQuestionValidation: []
    }
  },
  validations() {
    return guestValidation(this.language)
  },
  computed: {
    ...mapState({
      guestData: state => state.guestDetail.guest,
      isBookingForSomeoneElse: state =>
        state.guestDetail.isBookingForSomeoneElse,
      roomParamsForGetRoomSelected: state =>
        state.booking.roomParamsForGetRoomSelected
    }),
    ...mapGetters({
      language: 'appHeader/language',
      isSubmitted: 'guestDetail/isSubmitted',
      numberAdults: 'booking/numberAdults'
    }),
    ...mapState({
      additionalList: state => state.guestDetail.additionalList,
      additionalParams: state => state.guestDetail.additionalParams
    }),

    additionalListNotification() {
      return this.additionalList?.filter(
        additional => additional.question_type === 'notification'
      )
    },

    isFormInValid() {
      return this.$v.$invalid
    },

    isAdditionalValid() {
      return this.additionalQuestionValidation.every(
        additional => additional.isValid
      )
    },

    billingIsSame() {
      return [
        {
          value: 'billing-is-same',
          text: this.getLang.billingSame
        }
      ]
    },
    getLang() {
      return {
        guest: this.$t('guest_detail.guest'),
        addGuest: this.$t('guest_detail.add_guest'),
        removeGuest: this.$t('guest_detail.remove_guest'),
        billingSame: this.$t('guest_detail.billing_same'),
        required: this.$t('forms.required'),
        validEmail: this.$t('forms.valid_email'),
        lastName: this.$t('forms.last_name'),
        firstName: this.$t('forms.first_name'),
        kanjiLastName: this.$t('forms.kanji_last_name'),
        kanjiFirstName: this.$t('forms.kanji_first_name'),
        phone: this.$t('forms.phone'),
        email: this.$t('forms.email'),
        validPhone: this.$t('forms.valid_phone'),
        bookingForSomeone: this.$t('guest_detail.booking_for_someone')
      }
    },
    guestInfosLang() {
      const guestInfos = this.guestInfos
      guestInfos.forEach((item) => {
        item.guestInfoInput.lastNameInput.label = this.getLang.lastName
        item.guestInfoInput.firstNameInput.label = this.getLang.firstName
        if (this.language === 'ja') {
          item.guestInfoInput.kanjiLastName.label = this.getLang.kanjiLastName
          item.guestInfoInput.kanjiFirstName.label = this.getLang.kanjiFirstName
        }
        item.guestInfoInput.phone.label = this.getLang.phone
        item.guestInfoInput.email.label = this.getLang.email
      })
      return guestInfos
    }
  },
  watch: {
    guestData(guestData) {
      if (guestData.length) {
        this.guestInfos = guestData.map((item, index) => {
          return guestInfoInput(item, index, this.language)
        })
      }
    },

    isBookingForSomeoneElse(isMakingForSomeone) {
      this.isMakingForSomeone = isMakingForSomeone
    },

    isMakingForSomeone(isMakingForSomeone) {
      this.saveiSBookingForSomeoneElseData(isMakingForSomeone)
    }
  },
  mounted() {
    this.triggerIsFormInvalid(true)
    this.isMakingForSomeone = this.isBookingForSomeoneElse
    if (this.roomParamsForGetRoomSelected.length < this.guestData.length) {
      this.resetGuestData()
    }
    if (this.guestData.length) {
      this.guestInfos = this.guestData.map((item, index) => {
        return guestInfoInput(item, index, this.language)
      })
    } else {
      this.guestInfos = [guestInfoInput(null, 0, this.language)]
    }

    if (this.roomParamsForGetRoomSelected.length !== 1) {
      this.isMakingForSomeone = false
    }

    this.additionalPayload = this.additionalParams
    this.$nuxt.$on('on:GoToPayment', this.onGoToPaymentPage)
  },

  beforeDestroy() {
    this.$nuxt.$off('on:GoToPayment', this.onGoToPaymentPage)
  },

  methods: {
    ...mapActions({
      triggerIsFormInvalid: 'guestDetail/triggerIsFormInvalid',
      getDataGuestDetail: 'guestDetail/getDataGuestDetail',
      saveiSBookingForSomeoneElseData:
        'guestDetail/saveiSBookingForSomeoneElseData',
      saveAdditionalParams: 'guestDetail/saveAdditionalParams',
      resetGuestData: 'guestDetail/resetGuestData'
    }),

    bookForSomeoneElseValid() {
      if (this.isMakingForSomeone) {
        return !this.$refs['book-for-someone-else'][0]?.$v?.$invalid
      }

      return true
    },

    triggerProceedButton() {
      if (
        !this.$v.$invalid &&
        this.bookForSomeoneElseValid() &&
        !this.$refs['addtional-forms'].$v.$invalid
      ) {
        this.$nuxt.$emit('send:GuestFormValid', true)
      } else {
        this.$nuxt.$emit('send:GuestFormValid', false)
      }
    },

    onGoToPaymentPage(isCheckedPolicy) {
      this.$v.$touch()
      this.$refs['addtional-forms'].$v.$touch()
      this.triggerProceedButton()
      if (
        !this.$v.$invalid &&
        isCheckedPolicy &&
        this.bookForSomeoneElseValid() &&
        !this.$refs['addtional-forms'].$v.$invalid
      ) {
        this.$cookiz.set('from_guest_page', true)
        this.getDataGuestDetail({
          guestData: this.guestInfos,
          lang: this.language
        })
        this.saveAdditionalParams(
          this.$refs['addtional-forms'].additionalQuestions || []
        )
        this.$nuxt.$emit('on:saveExtrasParams')
        this.$router.push(this.$pageRoute.payment).catch(() => {})
      }
    },

    getAnswerText(index) {
      return (
        (this.additionalParams &&
          this.additionalParams.length &&
          this.additionalParams[index]?.answer?.text) ||
        ''
      )
    },

    $_addGuest() {
      if (this.guestInfos.length < this.roomParamsForGetRoomSelected.length) {
        this.guestInfos.push(
          guestInfoInput(
            null,
            this.guestInfos[this.guestInfos.length - 1].guestId,
            this.language
          )
        )
      }
    },

    errorText(index, field, validateType) {
      if (
        this.$v.guestInfos.$each[index].guestInfoInput[field].value.$dirty &&
        !this.$v.guestInfos.$each[index].guestInfoInput[field].value.required
      ) {
        return this.getLang.required
      }

      if (
        this.$v.guestInfos.$each[index].guestInfoInput[field].value.$dirty &&
        !this.$v.guestInfos.$each[index].guestInfoInput[field].value[
          validateType
        ]
      ) {
        switch (validateType) {
          case 'email':
            return this.getLang.validEmail
          case 'phoneNumberValidation':
            return this.getLang.validPhone
          case 'japanLangValidation':
            return this.$t('forms.japan_validation')
          case 'englishValidation':
            return this.$t('forms.input_in_english')
          case 'hiraganaValidation':
            return this.$t('forms.hiragana_validation')
          default:
            break
        }
      }
      return ''
    },

    validate(index, field, validateType) {
      return (
        this.$v.guestInfos.$each[index].guestInfoInput[field].value.$dirty &&
        !this.checkIsExits(
          this.$v.guestInfos.$each[index].guestInfoInput[field].value[
            validateType
          ]
        ) &&
        !this.$v.guestInfos.$each[index].guestInfoInput[field].value[
          validateType
        ]
      )
    },

    $_deleteGuest(guestId) {
      this.guestInfos = this.guestInfos.reduce((acc, cur) => {
        return cur.guestId !== guestId ? [...acc, cur] : [...acc]
      }, [])
    },

    onChangeAdditionalQuestion(target, index, additional) {
      this.additionalPayload[index] = {
        id: null,
        answer: {
          text: ''
        }
      }

      this.additionalQuestionValidation[index] = {}

      this.additionalPayload[index].id = additional.id
      this.additionalPayload[index].answer.text = target.value

      this.additionalQuestionValidation[index] = {
        isRequired: additional.isRequired,
        isValid: additional.isRequired ? !!target.value : true
      }
    },

    checkIsExits(param) {
      return isNullOrUndefined(param)
    },
    input(target) {
      const guestIndex = parseInt(target.getAttribute('data-index'))
      const guestData = this.guestInfos.filter(
        val => val.guestId === guestIndex + 1
      )
      guestData[0].guestInfoInput[target.name].value = target.value
      this.guestInfos[guestIndex] = guestData[0]
      this.$v.guestInfos.$each[guestIndex].guestInfoInput[
        target.name
      ].value.$touch()
    }
  }
}
</script>

<style lang="scss" scoped>
.guest-detail {
  &__guest-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border: 1px solid $border-color-gray-2;
    padding: 15px 15px 0 15px;
    border-radius: 2px;
    position: relative;
    margin-bottom: 15px;

    @include min-sm {
      padding: 40px 30px 30px 30px;
      margin-bottom: 20px;
    }
    .input-custom-container {
      @include min-sm {
        flex-basis: 48%;
      }
    }
    &__close {
      position: absolute;
      top: 15px;
      right: 20px;
      cursor: pointer;
      color: $text-color-blue-2;
      font-size: 12px;
      display: flex;
      align-items: center;
      font-weight: bold;
      z-index: 10;

      [class^='icon-'],
      [class*=' icon-'] {
        margin-left: 5px;
        font-size: 7px;
        font-weight: bold;
        background: $bg-color-blue-2;
        color: $white;
        padding: 3px;
        border-radius: 50%;
      }
    }

    &__checkbox {
      margin: 10px 0 30px 0;
    }

    h3 {
      width: 100%;
      margin-bottom: 10px;
    }

    label {
      font-weight: bold;
    }

    .app-input {
      flex: 0 1 100%;

      @include min-sm {
        flex-basis: 100%;
      }

      &.is-textarea {
        flex-basis: 100%;
      }
    }

    &-wrapper {
      position: relative;
      @include min-sm {
        margin-bottom: 30px;
      }
    }

    &-add-guest {
      // position: absolute;
      bottom: 0;
      height: 50px;
      width: 100%;
      background: $bg-color-gray-10;
      border: 1px solid $border-color-gray-2;
      display: flex;
      align-items: center;
      // border-top: none;
      padding: 0 25px;
      font-weight: bold;
      color: $text-color-blue-2;
      cursor: pointer;

      @include min-sm {
        padding: 0 30px;
      }

      [class^='icon-'],
      [class*=' icon-'] {
        margin-right: 20px;
        font-size: 10px;
        font-weight: bold;
        background: $bg-color-blue-2;
        color: $white;
        padding: 4px;
        border-radius: 50%;
      }
    }

    &-comment {
      display: flex;
      flex-direction: column;
      width: 100%;

      label {
        margin-bottom: 5px;
      }

      textarea {
        width: 100%;
      }
    }

    &__question {
      width: 100%;
    }
  }
  &__guest-info:not(:first-child) {
    // border-top: none;
  }

  .active {
    color: gray;
    [class^='icon-'],
    [class*=' icon-'] {
      background: gray;
    }
  }
}
</style>

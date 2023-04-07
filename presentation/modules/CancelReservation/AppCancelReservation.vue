<template>
  <div id="cancel-reservation-page" class="cancel-reservation page">
    <h1>{{ getLang.cancelReservation }}</h1>
    <div class="cancel-reservation__section">
      <app-select-hotel
        ref="selectHotel"
        :placeholder-text="$t('cancelreservation.select_hotel')"
        :validations="$v.inputValues.$each[0]['currentHotelId'].value"
        :data="allHotels"
        @changeHotelId="changeHotelId"
      />

      <div v-for="(inputValue, inputIdx) in inputValues[0]" :key="inputIdx">
        <InputCustom
          v-if="inputValue.name !== 'currentHotelId'"
          :label="inputValue.label"
          :icon="inputValue.icon"
          :type="inputValue.type"
          :placeholder="inputValue.placeholder"
          :value="inputValue.value"
          :input-name="inputValue.name"
          :validations="$v.inputValues.$each[0][inputValue.name].value"
          @input="input"
        >
          <span
            v-if="
              $v.inputValues.$each[0][inputValue.name].value.$dirty &&
                !checkIsExits(
                  $v.inputValues.$each[0][inputValue.name].value.required
                ) &&
                !$v.inputValues.$each[0][inputValue.name].value.required
            "
            class="app-input__validation"
          >
            {{ getLang.required }}</span>
          <span
            v-else-if="
              $v.inputValues.$each[0][inputValue.name].value.$dirty &&
                !checkIsExits(
                  $v.inputValues.$each[0][inputValue.name].value.email
                ) &&
                !$v.inputValues.$each[0][inputValue.name].value.email
            "
            class="app-input__validation"
          >
            {{ getLang.validEmail }}</span>
        </InputCustom>
      </div>

      <div v-if="reservationErr" class="error mb-3 text-center">
        {{ reservationErr }}
      </div>

      <app-button
        :button-text="getLang.submit"
        :is-loading="isGetReservationLoading"
        button-type="primary"
        button-width="100%"
        :validated="loginValid ? true : false"
        @onclick="submitCancelReservation"
      />

      <div v-if="errorMessage" class="text-danger text-center mb-2">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-success text-center mb-2">
        {{ successMessage }}
      </div>
      <MyStayPopup
        ref="confirmDelete"
        :modal-class="`modal-delete`"
        :is-close-icon="true"
      >
        <div class="cancel-reservation-modal">
          <div
            v-if="reservationsData.status === 'done'"
            class="cancel-booking-content form"
          >
            <div class="cancel-booking-content__title">
              <h5>{{ getLang.cancelYourBooking }}</h5>
              <p>{{ getLang.sureToCancelBooking }}?</p>
            </div>
            <div class="cancel-booking-content__room-fee mb-3">
              <div
                v-for="(reservation, index) in reservationsData.rooms"
                :key="index"
                class="cancel-booking-content__room-fee__fee mb-3"
              >
                <div class="row">
                  <div class="col-md-8 col-8">
                    {{ lang === 'en-US' || lang === 'en' ? 'Room' : '' }}
                    {{ index + 1 }} {{ getLang.feeForRoom }}:
                  </div>
                  <div class="col-md-4 col-4">
                    {{ reservation.cancellation.fee | currency('YEN') }}
                  </div>
                </div>
                <div class="cancellation">
                  <span @click="$_openCancelPolicy(reservation.room_plan_code)">
                    {{ getLang.cancellationPolicy }}
                  </span>
                </div>
              </div>
              <div class="cancel-booking-content__room-fee__total-fee row">
                <div class="col-md-8 col-8">
                  {{ getLang.totalCancellationFee }}:
                </div>
                <div class="col-md-4 col-4">
                  {{ reservationsData.cancellation.fee | currency('YEN') }}
                </div>
              </div>
            </div>
            <p>{{ getLang.provideReasonCancel }}.</p>
            <b-form-group>
              <b-form-radio-group
                v-model="selectedCancel.reason"
                :options="options"
                size="lg"
                plain
                stacked
                name="plain-stacked"
              />
            </b-form-group>
            <b-form-textarea
              v-if="selectedCancel.reason === 'other'"
              id="textarea-small"
              v-model="selectedCancel.detail"
              size="sm"
              :placeholder="getLang.provideDetail"
              rows="5"
              class="mb-4"
            />
            <div class="cancel-booking-content__button mt-3">
              <button class="button m-btn m-btn__white" @click="$_cancel">
                {{ getLang.cancel }}
              </button>
              <button class="button m-btn m-btn__yellow" @click="$_confirm">
                <b-spinner v-if="isReservationLoading" small />
                {{ getLang.cancelReservations }}
              </button>
            </div>
          </div>
          <div v-else-if="reservationsData.status === 'cancelled'">
            <div class="error text-center">
              <b>{{ reservationsData.message.title }}</b>
            </div>
          </div>
        </div>
      </MyStayPopup>

      <MyStayPopup
        ref="cancelationPolicies"
        :modal-class="`modal-cancelation`"
        :size="'lg'"
        :centered="false"
        :is-close-icon="true"
      >
        <div class="cancelation-policies">
          <h3>{{ $t('hoteldetail.cancellation_policy') }}</h3>
          <div v-if="!isLoading" class="cancelation-policies__content">
            <div
              v-for="(item, index) in cancellationPolicies"
              :key="index"
              class="cancelation-policies__content__item"
              v-html="item"
            />
          </div>
          <div v-else class="loading-item">
            <b-skeleton
              class="mb-4"
              animation="fade"
              width="90%"
              height="24px"
            />
            <b-skeleton
              class="mb-3"
              animation="fade"
              width="65%"
              height="24px"
            />
            <b-skeleton
              class="mb-3"
              animation="fade"
              width="70%"
              height="24px"
            />
            <b-skeleton
              class="mb-3"
              animation="fade"
              width="65%"
              height="24px"
            />
            <b-skeleton
              class="mb-3"
              animation="fade"
              width="70%"
              height="24px"
            />
          </div>
        </div>
      </MyStayPopup>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line node/no-deprecated-api
import { isNullOrUndefined } from 'util'
import { mapActions, mapState, mapGetters } from 'vuex'
import {
  requiredValidation,
  emailValidation
} from '../../../shared/helper/vuelidate-validator'

export default {
  name: 'AppCancelReservation',
  data() {
    return {
      isLoading: false,
      isCancelFail: false,
      options: [],
      selectedCancel: {
        reason: '',
        detail: ''
      },
      currentHotelId: '0',
      hotelId: '0',
      errorMessage: undefined,
      successMessage: undefined,
      isGetReservationLoading: false,
      reservationErr: ''
    }
  },
  validations: {
    inputValues: {
      $each: {
        currentHotelId: {
          value: requiredValidation
        },
        emailInput: {
          value: emailValidation
        },
        bookingId: {
          value: requiredValidation
        }
      }
    }
  },
  computed: {
    ...mapState({
      access_token: state => state.customer.auth.data.access_token,
      cancelReservationMessage: state => state.booking.cancelReservationMessage,
      isReservationLoading: state => state.booking.isReservationLoading,
      successReservationMessage: state =>
        state.booking.successCancelReservationMessage
    }),
    ...mapGetters({
      allHotels: 'hotel/allHotels',
      reservationsData: 'booking/reservationsData',
      reservationID: 'booking/bookingID',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      cancellationPolicies: 'hotelDetail/cancellationPolicies',
      hotelSelected: 'hotel/hotelSelected'
    }),

    inputValues: {
      get() {
        return [
          {
            currentHotelId: {
              name: 'currentHotelId',
              value: '',
              type: 'text',
              label: 'currentHotelId',
              required: true
            },
            bookingId: {
              name: 'bookingId',
              value: '',
              type: 'text',
              label: this.$t('forms.booking_id'),
              required: true
            },
            emailInput: {
              name: 'emailInput',
              value: '',
              type: 'email',
              label: this.$t('forms.email'),
              required: true,
              id: 1
            }
          }
        ]
      }
    },

    reservationParams() {
      const params = {
        hotelID: this.hotelId,
        reservationID: this.inputValues[0].bookingId.value,
        byPassToken: '',
        email: this.inputValues[0].emailInput.value
      }

      return params
    },
    isFormValidated() {
      return !!(!this.$v.$invalid && this.currentHotelId)
    },
    loginValid() {
      return (
        (this.$v.$dirty && this.$v.$invalid) ||
        this.errorMessage ||
        this.successMessage
      )
    },
    cancelOption() {
      return [
        { text: this.getLang.tripCancelled, value: 'trip_cancelled' },
        { text: this.getLang.roomIsCheaper, value: 'cheaper_price_found' },
        {
          text: this.getLang.travelChanged,
          value: 'guest_number_changed'
        },
        { text: this.getLang.anotherhHotel, value: 'hotel_changed' },
        { text: this.getLang.other, value: 'other' }
      ]
    },
    getLang() {
      return {
        cancelReservation: this.$t('cancelreservation.cancel_reservation'),
        submit: this.$t('cancelreservation.submit'),
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
        toSignup: this.$t('login_signup.to_signup'),
        summaryOfChange: this.$t('summary.summary_of_charges'),
        promoCode: this.$t('booking.promo_code'),
        sureToDelete: this.$t('summary.sure_delete_room'),
        cancel: this.$t('cancelreservation.cancel'),
        confirm: this.$t('summary.confirm'),
        confirm_cancel: this.$t('cancelreservation.confirm_cancel'),
        cancelYourBooking: this.$t('confirmbooking.cancel_your_booking'),
        sureToCancelBooking: this.$t('confirmbooking.sure_to_cancel_booking'),
        provideReasonCancel: this.$t('confirmbooking.provide_reason_cancel'),
        totalCancellationFee: this.$t('confirmbooking.total_cancellation_fee'),
        tripCancelled: this.$t('confirmbooking.trip_cancelled'),
        roomIsCheaper: this.$t('confirmbooking.room_is_chipper'),
        travelChanged: this.$t('confirmbooking.travel_changed'),
        anotherhHotel: this.$t('confirmbooking.another_hotel'),
        other: this.$t('confirmbooking.other'),
        provideDetail: this.$t('confirmbooking.provide_with_detail'),
        cancellationPolicy: this.$t('hoteldetail.cancellation_policy'),
        cancelReservations: this.$t('headers.cancel_reservation'),
        feeForRoom: this.$t('confirmbooking.fee_for_room'),
        guestName: this.$t('confirmbooking.guest_name')
      }
    }
  },
  watch: {
    cancelReservationMessage(newErrorMessage) {
      this.errorMessage = newErrorMessage
    },
    successReservationMessage(newMessage) {
      this.successMessage = newMessage
    },
    cancelOption(newOption) {
      this.options = newOption
    }
  },
  mounted() {
    this.options = this.cancelOption
  },
  methods: {
    ...mapActions({
      cancelReservations: 'booking/cancelReservations',
      getReservations: 'booking/getReservations',
      getHotelList: 'hotel/getHotelList',
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies'
    }),

    $_cancel() {
      this.$refs.confirmDelete.hideModal()
    },

    $_confirm() {
      const params = {
        hotelID: this.inputValues[0].currentHotelId.value,
        reservationID: this.inputValues[0].bookingId.value,
        email: this.inputValues[0].emailInput.value,
        lang: this.$langFormat(this.lang),
        category: this.hotelSelected.prefecture || '',
        body: {
          reason: this.selectedCancel.reason,
          details: this.selectedCancel.detail
        }
      }

      this.cancelReservations(params)
        .then((res) => {
          if (res) {
            setTimeout(() => {
              this.$refs.confirmDelete.hideModal()
            }, 200)
          }
        })
        .catch(() => {
          this.$refs.confirmDelete.hideModal()
        })
    },

    $_openCancelPolicy(roomPlanCode) {
      const params = {
        hotelID: this.inputValues[0].currentHotelId.value,
        queryString: {
          room_plan_codes: roomPlanCode
        }
      }
      this.$refs.cancelationPolicies.showModal()
      this.getCancellationPolicies(params)
    },

    changeHotelId(hotelId) {
      this.hotelId = hotelId
      this.inputValues[0].currentHotelId.value = hotelId
      this.$v.inputValues.$each[0].currentHotelId.value.$touch()
    },
    checkIsExits(param) {
      return isNullOrUndefined(param)
    },
    submitCancelReservation() {
      if (this.$nuxt.isOnline) {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.isGetReservationLoading = true
          this.getReservations(this.reservationParams)
            .then((res) => {
              if (res) {
                this.$refs.confirmDelete.showModal()
                this.isGetReservationLoading = false
                this.reservationErr = ''
              }
            })
            .catch((err) => {
              // this.$refs.confirmDelete.showModal()
              this.isGetReservationLoading = false
              this.reservationErr = err
            })
        }
      } else {
        alert('You are Offline')
      }
    },
    input(target) {
      const { value, name } = target
      this.inputValues[0][name].value = value
      this.$v.inputValues.$each[0][name].value.$touch()
    }
  }
}
</script>
<style scoped lang="scss">
.cancel-reservation-modal {
  min-height: 100px;
}

.reservation-content {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}

.cancel-reservation {
  h1 {
    margin-bottom: 40px;
    font-size: 25px;

    @include min-sm {
      font-size: 30pxapp-select-hotel;
    }
  }

  &__section {
    text-align: left;
    margin: 0 auto;

    @include min-sm {
      width: 40%;
    }

    button {
      width: 100%;
      padding: 15px;
    }
  }
}
.confirm-delete {
  text-align: center;
  padding: 20px 20px 10px 20px;

  &__title {
    margin-bottom: 30px;
  }

  &__button {
    display: flex;
    justify-content: space-between;
    button {
      padding: 10px 0;
      width: 48%;

      padding: 10px 0;
      width: 48%;
    }
  }
}

.cancel-booking-content__button {
  button {
    padding: 10px 0;
    width: 48%;

    padding: 10px 0;
    width: 48%;
  }
}

.cancellation {
  color: #1a489c;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.cancelation-policies {
  padding: 10px 0;
  font-size: 14px;

  @include min-sm {
    padding: 0 10px;
    font-size: 16px;
  }
  h3 {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }

  &__content {
    font-size: 14px;

    &__item {
      margin-bottom: 15px;
    }
  }
}
</style>

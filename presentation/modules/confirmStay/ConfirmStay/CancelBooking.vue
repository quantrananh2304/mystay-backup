<template>
  <div class="cancel-booking page">
    <div class="cancel-booking__title" @click="$_openCancelBooking">
      <span class="icon-Icon-Close" />
      <button class="m-btn m-btn__white">
        {{ getLang.cancelYourBooking }}
      </button>
    </div>
    <MyStayPopup
      ref="cancel-booking"
      :modal-class="'update-booking'"
      size=""
      :centered="true"
      :is-close-icon="true"
    >
      <div class="cancel-booking-content form">
        <div class="cancel-booking-content__title">
          <h5>{{ getLang.cancelYourBooking }}</h5>
          <p>{{ getLang.sureToCancelBooking }}?</p>
        </div>
        <div class="cancel-booking-content__room-fee mb-3">
          <div
            v-for="(reservation, index) in reservationsData.rooms"
            :key="index"
            class="cancel-booking-content__room-fee__fee"
          >
            <div class="row">
              <div class="col-md-6 col-8">
                {{
                  $t('confirmbooking.room_cancellation_fee', {
                    number: index + 1,
                  })
                }}
              </div>
              <div class="col-md-6 col-4">
                {{
                  reservation.cancellation &&
                    reservation.cancellation.fee | currency('YEN')
                }}
              </div>
            </div>
            <div class="cancellation">
              <span @click="$_openCancelPolicy(reservation.room_plan_code)">
                {{ getLang.cancellationPolicy }}
              </span>
            </div>
          </div>
          <div class="cancel-booking-content__room-fee__total-fee row">
            <div class="col-md-6 col-8">
              {{ getLang.totalCancellationFee }}:
            </div>
            <div class="col-md-6 col-4">
              {{
                reservationsData.cancellation &&
                  reservationsData.cancellation.fee | currency('YEN')
              }}
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
        <div v-if="errMessage" class="error">
          {{ errMessage }}
        </div>
        <div class="cancel-booking-content__button mt-3">
          <button class="button m-btn m-btn__white" @click="$_onClose">
            {{ getLang.cancel }}
          </button>
          <button
            class="button m-btn m-btn__yellow"
            @click="$_cancelRevervations"
          >
            <b-spinner v-if="isReservationLoading" small />
            {{ getLang.cancelReservations }}
          </button>
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
          <b-skeleton class="mb-4" animation="fade" width="90%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="65%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="70%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="65%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="70%" height="24px" />
        </div>
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { MYSTAYS_BRAND_ID } from '@/shared/constants'

export default Vue.extend({
  name: 'CancelBooking',
  data() {
    return {
      options: [],
      selectedCancel: {
        reason: '',
        detail: ''
      },
      errMessage: ''
    }
  },
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      isLoading: state => state.hotelDetail?.isLoading,
      isReservationLoading: state => state.booking.isReservationLoading
    }),
    ...mapGetters({
      reservationsData: 'booking/reservationsData',
      byPassToken: 'booking/byPassToken',
      reservationID: 'booking/bookingID',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      cancellationPolicies: 'hotelDetail/cancellationPolicies',
      hotelSelected: 'hotel/hotelSelected'
    }),

    hotelID() {
      return this.$route.query.hotel_id
    },

    getLang() {
      return {
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
        cancel: this.$t('summary.cancel'),
        feeForRoom: this.$t('confirmbooking.fee_for_room'),
        guestName: this.$t('confirmbooking.guest_name')
      }
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

    validReason() {
      if (this.selectedCancel.reason !== 'other') {
        return !!this.selectedCancel.reason
      }

      return !!this.selectedCancel.detail
    }
  },
  watch: {
    cancelOption(newOption) {
      this.options = newOption
    },

    selectedCancel: {
      handler(value) {
        if (this.validReason) {
          this.errMessage = ''
        }
      },
      deep: true
    }
  },
  mounted() {
    this.options = this.cancelOption
  },
  methods: {
    ...mapActions({
      cancelReservations: 'booking/cancelReservations',
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies'
    }),

    $_openCancelBooking() {
      this.selectedCancel = {
        reason: '',
        detail: ''
      }
      this.$refs['cancel-booking'].showModal()
    },

    $_cancelRevervations() {
      if (this.validReason) {
        this.errMessage = ''
        const params = {
          lang: this.$langFormat(this.lang),
          hotelID: this.hotelID,
          brand: MYSTAYS_BRAND_ID,
          category: this.hotelSelected.prefecture,
          byPassToken: this.byPassToken,
          reservationID: this.reservationID,
          email: this.reservationsData.email,
          body: {
            reason: this.selectedCancel.reason,
            details: this.selectedCancel.detail
          }
        }
        this.cancelReservations(params)
        this.$scrollBody.disable()
      } else {
        this.errMessage = this.$t('confirmbooking.select_cancel_booking_reason')
      }
    },

    $_openCancelPolicy(roomPlanCode) {
      const params = {
        hotelID: this.hotelID,
        queryString: {
          room_plan_codes: roomPlanCode
        },
        fullLang: this.fullLang
      }
      this.$refs.cancelationPolicies.showModal()
      this.getCancellationPolicies(params)
    },

    $_onClose() {
      this.$refs['cancel-booking'].hideModal()
    }
  }
})
</script>

<style lang="scss" scoped>
.cancel-booking {
  cursor: pointer;

  &__title {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 15px;
    &:hover {
      span {
        color: white;
      }
    }
    span {
      margin-right: 10px;
      font-weight: bold;
      position: absolute;
      left: 20px;
      color: $text-color-blue-2;

      &:first-child {
        font-size: 13px;
      }
    }

    button {
      width: 100%;
      height: 40px;
    }
  }
}
.cancel-booking-content {
  padding: 10px 0;
  @include min-sm {
    padding: 10px 20px;
  }
  h5 {
    font-weight: 600;
  }

  &__button {
    display: flex;
    justify-content: space-between;
    button {
      width: 47%;
      padding: 10px;
    }
  }

  &__room-fee {
    .cancellation {
      span {
        color: $text-color-blue-2;
        font-size: 13px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
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
.form-check {
  margin-bottom: 5px;
  input {
    width: 16px;
    height: 16px;
  }

  .form-check-label {
    margin-left: 8px;
  }
}
</style>

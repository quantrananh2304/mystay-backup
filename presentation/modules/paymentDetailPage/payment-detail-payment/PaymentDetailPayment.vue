<template>
  <div class="payment-detail__payment">
    <div class="payment-detail__payment call-out">
      <p class="is-bold mb-1">
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

    <div class="payment-detail__payment login">
      <!-- <LoginBlock v-if="!isLogin" :is-authened="isAuthened" /> -->
      <TotalPrcie />
    </div>
    <div
      class="payment-detail__payment__button"
      :class="{ 'is-fixed': isFixed }"
    >
      <b-button
        class="button m-btn m-btn__yellow"
        :disabled="buttonDisableCondition"
        @click="$_handlePayment"
      >
        <b-spinner v-if="isLoading || isUpdateLoading" small class="mr-2" />
        {{ isUpdateBooking ? 'Confirm Updates' : getLang.checkout }}
      </b-button>
    </div>
    <MyStayPopup
      ref="reservationsError"
      :modal-class="'reservations-error'"
      size="lg"
      :centered="true"
      :is-close-icon="true"
    >
      <div class="reservations-error-content">
        <span class="icon-Icon-Info mr-2 font-weight-bold" />
        <span>{{ reservationsError }}</span>
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { encodeBase64 } from '../../../../shared/helper/base64'
import { MYSTAYS_BRAND_ID } from '@/shared/constants'
import creditCardType from '@/shared/helper/checkCardType'
import { BookingActionTypes } from '@/store/booking/types'

export default Vue.extend({
  name: 'PaymentDetailPayment',
  props: {
    isAuthened: Boolean
  },
  data() {
    return {
      isReservations: false,
      isFixed: false,
      miles: 0,
      cardInfo: {}
    }
  },
  computed: {
    ...mapState({
      guestData: state => state.guestDetail.guest,
      bookingData: state => state.booking.bookingData,
      isLoading: state => state.booking.paymentState.isLoading,
      cardToken: state => state.paymentDetail.paymentState.token,
      paymentMethodSelected: state => state.paymentDetail.paymentMethodSelected,
      isFormValidated: state => state.paymentDetail.isFormValidated,
      hotelId: state => state.hotel.data.hotelID,
      reservationData: state => state.booking.reservationData,
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking,
      isUpdateLoading: state => state.booking.isUpdateLoading,
      reservationError: state => state.booking.reservationError,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI
    }),
    ...mapGetters({
      numberAdults: 'booking/numberAdults',
      numberChildren: 'booking/numberChildren',
      roomData: 'booking/roomData',
      isBillingInformationValidated:
        'paymentDetail/isBillingInformationValidated',
      roomSelectedParams: 'booking/roomSelectedParams',
      totalPriceWithoutTax: 'hotelDetail/totalPriceWithoutTax',
      numberAdultsInRoomSelected: 'booking/numberAdultsInRoomSelected',
      numberChildrenInRoomSelected: 'booking/numberChildrenInRoomSelected',
      promoCodeFromAPI: 'hotelDetail/promoCodeFromAPI',
      roomDetails: 'hotelDetail/roomDetails',
      points: 'users/points',
      hotelDetailV2: 'hotelDetail/hotelDetailV2',
      hotelSelected: 'hotel/hotelSelected',
      lang: 'appHeader/language',
      users: 'users/userData',
      additionalParams: 'guestDetail/additionalParams',
      guest: 'guestDetail/guest',
      isReceiveSubscription: 'guestDetail/isReceiveSubscription'
    }),

    getLang() {
      return {
        questions: this.$t('payment_detail.questions'),
        call: this.$t('payment_detail.call'),
        checkout: this.$t('payment_info.checkout'),
        holdReservation: this.$t('payment_detail.hold_reservation')
      }
    },

    paymentType() {
      const card_type = creditCardType(this.cardInfo?.cardno)
      switch (this.paymentMethodSelected) {
        case 'credit_card':
          return {
            type: 'credit_card',
            card_token: this.cardToken.token,
            save_card: true
          }
        case 'on_site_credit_card_required':
          return {
            type: 'on_site_credit_card_required',
            card_token: this.cardToken.token,
            card_holder: this.cardInfo?.holdername || '',
            card_type,
            card_sequence: null,
            save_card: true
          }
        case 'on_site':
          return { type: 'on_site' }
        default:
          break
      }

      return {}
    },

    getParamsReservations() {
      const payload = {
        hotelId: this.hotelId,
        brand: MYSTAYS_BRAND_ID,
        category: this.hotelSelected.prefecture,
        lang: this.$langFormat(this.lang),
        queryParam: {
          adults: this.numberAdults,
          children: this.numberChildren,
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          guest: this.guestData[0],
          payment: this.paymentType,
          rooms: this.roomData,
          spending_point: this.miles,
          extra_items: [],
          additional_questions: this.additionalParams,
          coupon_code: this.bookingData.promoCode
        }
      }
      return payload
    },

    getParamsUpdateBooking() {
      const params = {
        hotelID: this.hotelId,
        reservationID: this.reservationData.reservation_number,
        email: this.reservationData.email,
        byPassToken: this.reservationData.bypass_token,
        body: {
          ...this.getParamsReservations.queryParam
        }
      }

      return params
    },

    reservationsError() {
      const error = this.reservationError?.error

      return error
    },

    buildParams() {
      return {
        hotelID: this.hotelId,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.numberChildrenInRoomSelected,
          mode: 'standard',
          adults: this.numberAdultsInRoomSelected,
          total_price_without_tax: this.totalPriceWithoutTax,
          rooms: this.roomSelectedParams,
          coupon_code: this.promotionCode,
          spending_point: this.miles
        }
      }
    },
    buttonDisableCondition() {
      if (
        (!this.isLoading || !this.isUpdateLoading) &&
        this.paymentMethodSelected
      ) {
        return false
      }

      return true
    }
  },
  watch: {
    cardToken: {
      handler(newValue) {
        if (newValue) {
          if (this.isUpdateBooking) {
            this.updateReservations(this.getParamsUpdateBooking)
          } else {
            this.createReservations(this.getParamsReservations).then(() => {
              this.receiveSubscription()
            })
          }
        }
      },
      deep: true
    },
    reservationData: {
      handler(newValue) {
        if (newValue.reservation_number && this.isReservations) {
          this.clearRoomSelected()
          const q = {
            email: encodeBase64(newValue.guest.email),
            bypass_token: newValue.bypass_token,
            hotel_id: this.hotelId
          }
          this.$router.push({
            path: `confirm-booking/${newValue.reservation_number}`,
            query: q
          })

          this.$gtm.push({
            triggerType: 'Page Load',
            locale: this.$langFormat(this.lang),
            pageCategory: 'ConfirmStayPage'
          })
        }
      },
      deep: true
    },

    users(user) {
      if (user) {
        this.paymentDetailGtm()
      }
    },

    reservationError(error) {
      if (error) {
        // this.$refs.reservationsError.showModal()
      }
    }
  },
  mounted() {
    this.getDataPayment('')
    this.paymentDetailGtm()
    window.addEventListener('scroll', this.$_onScroll)
    this.$nuxt.$on('on:sendCardInfo', this.saveCardInfo)
  },
  beforeDestroy() {
    this.$store.commit(
      `booking/${BookingActionTypes.CREATE_RESERVATIONS_FAIL}`,
      null
    )
    window.removeEventListener('scroll', this.$_onScroll)
    this.$nuxt.$off('on:sendCardInfo', this.saveCardInfo)
  },
  methods: {
    ...mapActions({
      triggerPayment: 'paymentDetail/triggerPayment',
      createReservations: 'booking/createReservations',
      getDataPayment: 'paymentDetail/getDataPayment',
      updateReservations: 'booking/updateReservations',
      clearRoomSelected: 'hotelDetail/clearRoomSelected',
      getRoomSelected: 'hotelDetail/getRoomSelected'
    }),

    saveCardInfo(cardInfo) {
      this.cardInfo = cardInfo
    },

    $_handlePayment() {
      this.isReservations = true
      if (
        this.paymentMethodSelected === 'credit_card' ||
        this.paymentMethodSelected === 'on_site_credit_card_required'
      ) {
        this.triggerPayment()
      } else if (this.isUpdateBooking) {
        this.updateReservations(this.getParamsUpdateBooking)
      } else {
        this.createReservations(this.getParamsReservations).then(() => {
          this.receiveSubscription()
        })
      }
    },

    receiveSubscription() {
      if (this.isReceiveSubscription) {
        this.$api.$post('/api/Mystays/Booking/savesubscribedata', {
          firstname: this.guest.first_name || '',
          lastname: this.guest.last_name || '',
          email: this.guest.email || '',
          subscribe: true,
          language: this.$i18n.locale,
          brand: this.hotelSelected?.brand || '',
          prefecture: this.hotelSelected?.prefecture || '',
          hotelId: this.hotelId
        })
      }
    },

    paymentDetailGtm() {
      const products =
        this.roomSelectedFromAPI &&
        this.roomSelectedFromAPI?.rooms?.map((room) => {
          return {
            brand: MYSTAYS_BRAND_ID,
            category: this.hotelSelected.prefecture,
            checkInDate: this.roomSelectedFromAPI.checkin_date,
            checkOutDate: this.roomSelectedFromAPI.checkout_date,
            coupon: this.bookingData.promoCode,
            id: this.hotelId,
            name: this.hotelId,
            numberOfAdult: room.adults,
            numberOfChildren: room.children,
            numberOfRooms: this.roomSelectedFromAPI.rooms.length,
            numberOfDaysToCheckIn: this.roomSelectedFromAPI
              .number_of_days_to_checkin,
            price: room.total_price,
            quantity: this.roomSelectedFromAPI.nights,
            roomId: room.room_type_code,
            roomName: room.room_type_name,
            roomSize: room.room_size.value,
            roomType: room.room_type_name,
            planId: room.room_plan_code,
            planName: room.room_plan_name
          }
        })

      const gmtData = {
        triggerType: 'Page Load',
        ...(this.isPageLoaded && { event: 'virtualPageview' }),
        eeAction: 'eeCheckout',
        checkoutStep: '2',
        userId: this.users?.id || '',
        pageCategory: this.$route.name,
        products
      }

      this.$gtm.push(gmtData)
    },

    $_onScroll() {
      const paymentOffsetTop = document.querySelector('.payment-total')
      if (
        window.pageYOffset + window.innerHeight >=
        paymentOffsetTop.offsetTop +
          paymentOffsetTop.getBoundingClientRect().height +
          102
      ) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },
    onReceiveMiles(miles) {
      this.miles = miles
      this.getRoomSelected(this.buildParams)
    }
  }
})
</script>

<style lang="scss" scoped>
.payment-detail__payment {
  width: 100%;
  margin-bottom: 10px;
  @include min-sm {
    display: block;
    margin: 30px auto;

    @include min-xl {
      width: 388px;
      margin: 0;
    }
  }
  &.call-out {
    display: none;
    @include min-sm {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      p {
        margin-right: 10px;
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
  }

  &.total {
    width: 100%;
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

  &__button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 15px;
    z-index: 5;
    background: white;

    @include min-sm {
      position: static;
      padding: 0;
    }

    .button {
      width: 100%;
      padding: 15px;
      position: relative;
      box-shadow: 1px 2px 5px 3px rgba(0, 0, 0, 0.2);
      &:disabled {
        cursor: not-allowed;
      }
      [class^='icon-'],
      [class*=' icon-'] {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        font-size: 20px;
      }

      @include min-sm {
        box-shadow: none;
      }
    }
  }

  .is-fixed {
    position: static;
    padding: 0;
  }
}

.reservations-error-content {
  color: red;
  padding: 20px 10px;
}
</style>

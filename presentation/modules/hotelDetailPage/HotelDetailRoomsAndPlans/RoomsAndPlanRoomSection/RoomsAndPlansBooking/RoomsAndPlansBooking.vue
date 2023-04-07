<template>
  <div class="hotel-detail__booking">
    <div
      v-if="member"
      class="hotel-detail__booking sub-content--member-booking"
    >
      <div class="promo-code">
        <span>{{ roomInfo.promoCodeName }}</span>
      </div>

      <div class="total-rate">
        <span class="rate">
          {{ subItem && subItem.rate | currency('YEN') }}
        </span>

        <span class="discount-rate">
          {{ roomInfo.discountRate | currency('YEN') }}
        </span>
      </div>

      <p>{{ guestText }} / {{ totalNightText }}</p>

      <div v-if="roomList.length > 1" class="multiple-room">
        {{ (roomInfo.discountRate * roomList.length) | currency('YEN') }}
        <span>
          ({{ roomList.length }}
          {{ roomList.length > 1 ? $t('booking.rooms') : $t('booking.room') }})
        </span>
      </div>

      <button
        class="button m-btn m-btn__yellow"
        :class="{
          active: roomInfo && roomInfo.isBooked,
          'btn-disabled': !subItem.room_count && !bookingData.is_undated
        }"
        :disabled="disabledBookButton"
        @click="$_onShowModalBooking"
      >
        <b-spinner v-if="isRoomSelectedLoading" small />
        {{ getLanguage.book }}
      </button>

      <div v-if="subItem && subItem.roomPlanCode" class="cancellation">
        <span class="icon-Icon-Info" />

        <p
          v-if="!subItem.cancellationFreeDeadline"
          @click="$_openCancellationPolices"
        >
          {{ $t('hoteldetail.cancellation_policy') }}
        </p>

        <p v-else @click="$_openCancellationPolices">
          {{
            $t('hoteldetail.free_cancellation_util', {
              date: subItem.cancellationFreeDeadline
            })
          }}
        </p>
      </div>
    </div>

    <div
      v-else-if="!member"
      class="hotel-detail__booking sub-content--non-member-booking"
    >
      <span v-if="$nuxt.isOnline">
        {{ subItem && subItem.rate | currency('YEN') }}
      </span>

      <h4 v-if="$nuxt.isOnline">
        {{ subItem && subItem.rate | currency('YEN') }}
      </h4>

      <p>{{ guestText }} / {{ totalNightText }}</p>

      <div v-if="roomList.length > 1" class="multiple-room">
        {{ subItem && (subItem.rate * roomList.length) | currency('YEN') }}
        <span>
          ({{ roomList.length }}
          {{ roomList.length > 1 ? $t('booking.rooms') : $t('booking.room') }})
        </span>
      </div>

      <button
        v-if="roomInfo && roomInfo.planId"
        class="button m-btn m-btn__yellow"
        :class="{
          active: roomInfo && roomInfo.isBooked,
          'btn-disabled': !subItem.room_count && !bookingData.is_undated
        }"
        :disabled="disabledBookButton"
        @click="$_onShowModalBooking"
      >
        <b-spinner v-if="isRoomSelectedLoading" small />
        {{ getLanguage.book }}
      </button>

      <button
        v-else-if="roomInfo && !roomInfo.planId && roomInfo.discountRate"
        class="button m-btn m-btn__yellow"
      >
        <span class="icon-Icon-Amenity-Safety-Box" />
        {{ getLanguage.join }}
      </button>

      <button
        v-else
        class="button m-btn m-btn__yellow"
        :class="{
          active: roomInfo && roomInfo.isBooked,
          'btn-disabled': !subItem.room_count && !bookingData.is_undated
        }"
        :disabled="disabledBookButton"
        @click="$_onShowModalBooking"
      >
        <b-spinner v-if="isRoomSelectedLoading" small />
        {{ getLanguage.book }}
      </button>

      <div v-if="subItem && subItem.roomPlanCode" class="cancellation">
        <span class="icon-Icon-Info" />

        <p
          v-if="!subItem.cancellationFreeDeadline"
          @click="$_openCancellationPolices"
        >
          {{ $t('hoteldetail.cancellation_policy') }}
        </p>

        <p v-else @click="$_openCancellationPolices">
          {{
            $t('hoteldetail.free_cancellation_util', {
              date: subItem.cancellationFreeDeadline
            })
          }}
        </p>
      </div>
    </div>

    <div
      v-if="isShowCalendar && disabledBookButton"
      v-click-outside="clickOutside"
      class="hotel-detail__booking__calendar"
    >
      <LazyCalendar
        :invalid-date="invalidDate"
        :minimum-stay="minimumStay"
        :container="'room-plan__calendar'"
        :sub-container="'room-plan__calendar__bottom'"
        :q="q"
        :room-plan-code="subItem.roomPlanCode"
        @clickDoneBtn="onHide"
        @on:doneSetDate="onDoneSetDate"
        @on:doneSetDateUndecided="onDoneSetDateUndecided"
      />
      <span class="close-icon icon-Icon-Close" @click="onHideCalendar" />
    </div>

    <MyStayPopup
      ref="get-price-error"
      modal-class="get-price-error"
      class="popup"
      size="md"
    >
      <div class="get-price-error text-center">
        {{ errorMsg }}
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import getGuestText from '~/mixins/guestText'
export default {
  name: 'RoomsAndPlansBooking',
  directives: {
    ClickOutside
  },
  mixins: [getGuestText],
  props: {
    subItem: {
      type: Object,
      default: () => {}
    },
    subContentIsOpen: {
      type: Boolean
    },
    // eslint-disable-next-line
    member: {
      type: Number || Boolean
    }
  },
  data() {
    return {
      isActive: false,
      isError: false,
      isShowCalendar: false,
      invalidDate: [
        { start: new Date(2020, 5, 22), end: new Date(2020, 5, 24) }
      ],
      minimumStay: [{ d: new Date(2020, 5, 4) }, { d: new Date(2020, 5, 5) }],
      q: {},
      isRoomSelectedLoading: false,
      errorMsg: ''
    }
  },
  computed: {
    ...mapState({
      selectedRoom: state => state.hotelDetail.selectedRoom,
      alertModel: state => state.hotelDetail.alertModel,
      bookingData: state => state.booking.bookingData
    }),
    ...mapGetters({
      totalGuest: 'booking/totalGuest',
      totalNight: 'booking/totalNight',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      roomStatus: 'hotelDetail/roomStatus',
      roomList: 'booking/roomList',
      roomDataDefault: 'hotelDetail/roomDataDefault'
    }),

    totalNightText() {
      let text = ''
      if (this.totalNight) {
        text = `${
          this.totalNight > 1
            ? this.$t('customhtmlcalendar.numner_nights', {
                night: this.totalNight
              })
            : this.$t('customhtmlcalendar.numner_night', {
                night: this.totalNight
              })
        }`
      } else {
        text = 1 + ' ' + this.$t('hoteldetail.day')
      }
      return text
    },

    roomInfo() {
      const planCode = this.subItem && this.subItem.planCode
      const planCodeList = this.selectedRoom.map((s) => {
        return s.plan.planCode
      })
      if (planCode) {
        planCodeList.forEach((code) => {
          if (planCode === code && !this.isError) {
            this.subItem.isBooked = true
          } else {
            this.subItem.isBooked = false
          }
        })
      }

      return this.subItem
    },

    guestText() {
      const numberAdult = this.roomDataDefault
        ? this.roomDataDefault.adults
        : this.roomStatus && this.roomStatus.adults.number
      const numberChildren = this.roomDataDefault
        ? this.roomDataDefault.children
        : this.roomStatus && this.roomStatus.children.childrenList.length

      return this.getGuestText(numberAdult, numberChildren)
    },
    getLanguage() {
      return {
        earn: this.$t('hoteldetail.earn'),
        miles: this.$t('hoteldetail.miles'),
        book: this.$t('hoteldetail.book'),
        booked: this.$t('hoteldetail.booked'),
        perNight: this.$t('hoteldetail.per_night'),
        seePlan: this.$t('hoteldetail.see_plan'),
        seeRoom: this.$t('hoteldetail.see_room'),
        plan: this.$t('hoteldetail.plan'),
        close: this.$t('hoteldetail.close'),
        joinToUnlock: this.$t('hoteldetail.join_to_unlock'),
        rateFrom: this.$t('hoteldetail.rate_from'),
        join: this.$t('hoteldetail.join'),
        night: this.$t('customhtmlcalendar.night'),
        nights: this.$t('customhtmlcalendar.nights'),
        guest: this.$t('booking.guest'),
        guests: this.$t('booking.guests'),
        children: this.$t('booking.children'),
        child: this.$t('booking.child'),
        adult: this.$t('booking.adult'),
        adults: this.$t('booking.adults')
      }
    },

    disabledBookButton() {
      return this.isShowCalendar || this.roomDataDefault
    }
  },
  watch: {
    alertModel(error) {
      if (error) {
        this.isError = true
      }
    }
  },
  methods: {
    ...mapActions({
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies',
      saveRoomParamsForGetRoomSelected:
        'booking/saveRoomParamsForGetRoomSelected',
      closeAll: 'booking/closeAll'
    }),

    onHide() {
      this.isShowCalendar = false
      this.setDateToRouter()
    },

    onHideCalendar() {
      this.isShowCalendar = false
    },

    onDoneSetDate() {
      this.isShowCalendar = false
      if (!this.bookingData.is_undated) {
        this.setDateToRouter()
      }
    },

    setDateToRouter() {
      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },

    clickOutside() {
      if (this.isShowCalendar) {
        this.isShowCalendar = false
      }
    },

    onDoneSetDateUndecided() {
      this.$emit('saveRoomSelected', this.subItem)
      // if (this.subItem.room_count >= this.roomList.length) {
      //   this.isRoomSelectedLoading = true
      //   setTimeout(() => {
      //     this.isActive = true
      //     this.$emit('saveRoomSelected', this.subItem)
      //     this.saveRoomParamsForGetRoomSelected()
      //     setTimeout(() => {
      //       this.$store.commit('hotelDetail/[Hotel Detail] SEARCH_ROOM')
      //     }, 50)
      //   }, 20)

      //   return
      // }

      // if (this.subItem.room_count < this.roomList.length) {
      //   this.errorMsg = this.$t(
      //     'hoteldetail.room_book_greater_than_room_left_message',
      //     {
      //       room_left: this.subItem.room_count
      //     }
      //   )
      //   this.$refs['get-price-error'].showModal()
      // }
    },

    $_onShowModalBooking() {
      if (this.subItem.room_count >= this.roomList.length) {
        this.isRoomSelectedLoading = true
        setTimeout(() => {
          this.isActive = true
          this.$emit('saveRoomSelected', this.subItem)
          this.saveRoomParamsForGetRoomSelected()
          setTimeout(() => {
            this.$store.commit('hotelDetail/[Hotel Detail] SEARCH_ROOM')
          }, 50)
        }, 20)

        return
      }

      if (!this.subItem.room_count) {
        setTimeout(() => {
          this.isShowCalendar = !this.isShowCalendar
        })

        const rooms = this.roomList.map((room) => {
          return {
            ...room,
            room_plan_code: this.subItem.roomPlanCode
          }
        })
        const q = {
          cache: true,
          nights: this.totalNight,
          room_plan_code: this.subItem.roomPlanCode,
          rooms: rooms.slice(0, 1),
          isRoom: true
        }

        this.q = q

        return
      }

      if (this.subItem.room_count < this.roomList.length) {
        this.errorMsg = this.$t(
          'hoteldetail.room_book_greater_than_room_left_message',
          {
            room_left: this.subItem.room_count
          }
        )
        this.$refs['get-price-error'].showModal()
      }
    },
    $_openCancellationPolices() {
      const hotelID = this.$route.params.hotelID
      const params = {
        hotelID,
        queryString: {
          room_plan_codes: this.subItem.roomPlanCode
        },
        fullLang: this.fullLang
      }
      if (this.subItem && this.subItem.roomPlanCode) {
        this.$nuxt.$emit('on:ShowCancellationPoliciesPopup')
        this.getCancellationPolicies(params)
      }

      const gtmData = {
        event: 'cancellationPolicyInfoClick',
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        hotelID: this.$route.params.hotelID,
        roomID: this.subItem && this.subItem.roomId,
        planID: this.subItem && this.subItem.roomPlanCode,
        triggerType: 'User Interaction'
      }

      this.$gtm.push(gtmData)
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-detail__booking {
  position: relative;
  flex: 0 1 100px;

  @include min-sm {
    flex: 0 1 170px;
  }

  &.booking-top {
    display: none;

    @include min-sm {
      flex: 0 1 170px;
      display: block;
    }
  }

  &.no-plan {
    display: block;
    margin-top: 10px;

    @include min-sm {
      margin-top: 0;
    }
  }

  &__calendar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    > div {
      box-shadow: 2px 3px 14px 0px rgba(74, 74, 74, 0.25);
    }

    .close-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 15px;
      background: #232e48;
      color: white;
      font-size: 12px;

      @include min-sm {
        display: none;
      }
    }

    @include min-sm {
      position: absolute;
      top: 140px;
      right: 0;
      width: 800px;
      z-index: 100;
    }
  }

  &.sub-content--member,
  &.sub-content--non-member {
    &-booking {
      .button {
        width: 100%;
        font-size: 14px;
        padding: 7px;
        display: flex;
        justify-content: center;
        align-items: center;

        @include min-sm {
          padding: 10px;
          margin-top: 10px;
        }
      }

      h6 {
        font-size: 10px;
        font-weight: bold;
        margin: 0;
        display: none;
        text-transform: uppercase;

        @include min-sm {
          display: block;
        }
      }

      span {
        font-size: 20px;
        font-weight: bold;
        margin-right: 6px;

        &[class^='icon-'],
        &[class*=' icon-'] {
          display: inline-block;
          font-weight: normal;
          font-size: 17px;
          margin-right: 5px;
        }

        @include min-sm {
          display: inline;
        }
      }

      .spinner-border {
        display: block;
      }

      .spinner-border-sm {
        width: 13px;
        height: 13px;
        border-width: 2px;
      }

      span.per-night-rate {
        font-size: 11px;
        font-weight: normal;
      }

      h4 {
        font-size: 18px;
        font-weight: bold;

        @include min-sm {
          display: none;
        }
      }

      p {
        margin-bottom: 5px;
      }
    }
  }

  &.sub-content--non-member {
    &-booking {
      span {
        display: none;

        @include min-sm {
          display: inline;
        }
      }
    }
  }

  .promo-code {
    margin-top: 8px;
    margin-bottom: 5px;
    display: none;

    @include min-sm {
      display: block;
    }

    span {
      font-size: 11px;
      display: inline;
      padding: 5px 7px 5px 3px;
      border-radius: 5px;
      background: #e6ee9c;
    }
  }

  .total-rate {
    @include min-sm {
      padding: 4px 0;
    }
  }

  &.sub-content--member {
    &-booking {
      .button {
        [class^='icon-'],
        [class*=' icon-'] {
          display: inline-block;
          margin-right: 5px;
          font-weight: normal;
          font-size: 17px;
        }

        &--desktop {
          display: none;

          @include min-sm {
            display: flex;
          }
        }

        &--mobile {
          display: flex;

          @include min-sm {
            display: none;
          }
        }
      }

      span.rate {
        text-decoration: line-through;
        color: $text-color-gray-6;
        font-size: 16px;
        font-weight: normal;
      }

      span.discount-rate {
        color: $text-color-pink;
        font-size: 18px;
        font-weight: bold;

        @include min-sm {
          font-size: 20px;
        }
      }
    }
  }

  &.sub-content--non-member {
    &-booking {
      h6 {
        color: $text-color-pink;

        @include min-sm {
          margin-bottom: 5px;
        }
      }
    }
  }

  &.top-booking {
    font-size: 11px;
    color: $text-color-blue;

    .button {
      width: 100%;
      font-size: 14px;
      padding: 10px;
      margin-top: 5px;
    }

    h6 {
      font-size: 10px;
      font-weight: bold;
      margin: 0;
      text-transform: uppercase;
    }

    span {
      font-size: 20px;
      font-weight: bold;
      margin-right: 6px;
    }

    p {
      margin-bottom: 0;
    }
  }

  .multiple-room {
    font-size: 14px;
    font-weight: bold;
    color: #1a489c;

    @include min-sm {
      font-size: 18px;
    }

    span {
      font-size: 12px !important;
      text-transform: lowercase;
      display: block !important;
      margin-bottom: 3px;

      @include min-sm {
        display: inline !important;
        font-size: 13px !important;
        margin-bottom: 0;
      }
    }
  }
}

.cancellation {
  margin-top: 10px;
  display: none;
  align-items: center;
  @include min-sm {
    display: flex;
  }
  span {
    font-size: 12px !important;
    color: #c0900cf7;
    margin-right: 10px;
  }
  p {
    font-size: 12px;
    color: #c0900cf7;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 0 !important;
    &:hover {
      text-decoration: underline;
    }
  }
}

.active {
  background: #232e48;
  color: #ffd25d;
  border-color: #232e48;
}

.btn-disabled {
  background: lightgray;
  border: 1px solid lightgray;

  &:hover {
    color: white;
  }
}

.get-price-error {
  color: red;
  padding: 15px;
}
</style>

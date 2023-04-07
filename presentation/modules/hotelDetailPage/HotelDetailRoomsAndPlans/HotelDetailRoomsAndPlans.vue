<template>
  <section id="plan" class="hotel-detail-rooms-and-plans">
    <div class="container">
      <div
        v-if="$nuxt.isOnline"
        class="hotel-detail-rooms-and-plans__actions-top mb-2"
        :class="{ 'flex-column': $i18n.locale === 'ja' && isMobile }"
      >
        <CustomCheckbox
          v-model="is_day_use"
          :is-checked="is_day_use"
          :label-text="$t('hoteldetail.day_use_only')"
          :disabled="isPlanLoading || isRoomLoading || isUndated"
          :color="isUndated ? '#6c757d' : ''"
          @input="$_onSwitchUseDay"
        />
        <CustomCheckbox
          v-if="undatedSearch"
          v-model="isUndated"
          :is-checked="isUndated"
          :label-text="'Undecided date'"
          :disabled="isPlanLoading || isRoomLoading"
          @input="$_onSwitchUndated"
        />
        <CustomCheckbox
          v-model="isAvailable"
          :is-checked="isAvailable"
          :label-text="$t('hoteldetail.show_only_available')"
          :disabled="isPlanLoading || isRoomLoading || isUndated"
          :color="isUndated ? '#6c757d' : ''"
          @input="$_onChangeAvailable"
        />
      </div>
      <HotelDetailRoomsAndPlansTop
        :rooms-length="roomsLength"
        :plans-length="plansLength"
      />

      <div class="mb-4 d-flex flex-wrap">
        <div
          v-for="room in roomTypes"
          :key="room.code"
          class="hotel-detail-rooms-and-plans__room-type"
        >
          <span>{{ room.name }}</span>
          <span class="icon-Icon-Close" @click="onDeleteRoomTypes(room)" />
        </div>
      </div>

      <RoomsAndPlansSection
        @getRoomsLength="roomsLength = $event"
        @getPlansLength="plansLength = $event"
      />
      <div
        v-show="isShowNoRoomAvailable"
        class="hotel-detail-rooms-and-plans__no-room"
      >
        <span class="icon-Icon-Info" />
        <span>{{ $t('hoteldetail.no_room_available') }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'HotelDetailRoomsAndPlans',
  data() {
    return {
      roomsLength: 0,
      plansLength: 0,
      is_day_use: false,
      isAvailable: true,
      isUndated: false,
      errorMsg: ''
    }
  },
  computed: {
    ...mapGetters({
      hotelReviews: 'hotelDetail/hotelReviews',
      isKidsTierSupport: 'hotel/isKidsTierSupport',
      roomLeftFilter: 'hotelDetail/roomLeftFilter',
      planLeftFilter: 'hotelDetail/planLeftFilter',
      roomDetails: 'hotelDetail/roomDetails',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      roomSelectedParams: 'booking/roomSelectedParams',
      totalPriceWithoutTax: 'hotelDetail/totalPriceWithoutTax',
      numberAdultsInRoomSelected: 'booking/numberAdultsInRoomSelected',
      numberChildrenInRoomSelected: 'booking/numberChildrenInRoomSelected',
      roomTypes: 'hotelDetail/roomTypes',
      roomTypeCodes: 'booking/roomTypeCodes',
      totalNight: 'booking/totalNight'
    }),
    ...mapState({
      selectedRoom: state => state.hotelDetail.selectedRoom,
      hotelID: state => state.hotel.data.hotelID,
      bookingData: state => state.booking.bookingData,
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking,
      roomSelect: state => state.booking.bookingData.roomList,
      roomIndex: state => state.hotelDetail.roomIndex,
      roomType: state => state.hotel.data.roomType,
      useDay: state => state.booking.bookingData.is_day_use,
      isPlanLoading: state => state.hotelDetail.isPlanLoading,
      isRoomLoading: state => state.hotelDetail.isRoomLoading,
      allowedSelectOneDay: state => state.booking.bookingData.is_day_use,
      is_undated: state => state.booking.bookingData.is_undated,
      is_including_occupied: state =>
        state.booking.bookingData.is_including_occupied,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI,
      undatedSearch: state => state.hotelDetail.hotelDetailV2.undatedSearch
    }),
    getGuestNumber() {
      if (this.roomIndex >= 0) {
        return this.roomSelect[this.roomIndex]?.adults?.number
      }
      return null
    },

    isShowNoRoomAvailable() {
      return (
        !this.roomLeftFilter.length &&
        !this.planLeftFilter.length &&
        (!this.isPlanLoading || !this.isRoomLoading)
      )
    },

    roomPlanCode() {
      if (this.roomDetails && this.roomDetails.length) {
        return this.roomDetails && this.roomDetails[0].roomPlanCode
      }

      return ''
    },

    isDiscount() {
      return (
        Boolean(this.selectedRoom[0]?.plan?.discountRate) ||
        Boolean(this.selectedRoom[0]?.room?.discountRate)
      )
    }
  },
  watch: {
    selectedRoom(selectedRoom) {
      if (selectedRoom?.length) {
        if (!this.isDiscount) {
          this.getPromoCode('')
        }

        this.$router.push(this.$pageRoute.hotelReview).catch(() => {})

        //   this.getRoomSelected(this.buildParams(this.fullLang))
        //     .then(() => {
        //       this.errorMsg = ''
        //       this.$router.push(this.$pageRoute.hotelReview).catch(() => {})
        //     })
        //     .catch((err) => {
        //       this.clearRoomSelected()
        //     })
      }
    },
    fullLang(lang) {
      const params = {
        hotelID: this.hotelID,
        queryString: {
          room_plan_codes: this.roomPlanCode
        },
        fullLang: lang
      }
      if (this.roomPlanCode) {
        this.getCancellationPolicies(params)
        if (!this.isUpdateBooking) {
          this.getRoomSelected(this.buildParams(lang))
        }
      }
    },

    allowedSelectOneDay(is_day_use) {
      this.is_day_use = is_day_use
    },

    roomSelectedFromAPI(roomSelected) {
      if (roomSelected.rooms && roomSelected.rooms.length) {
        this.$router.push(this.$pageRoute.hotelReview).catch(() => {})
      }
    },

    is_undated(isUndated) {
      this.isUndated = isUndated
    }
  },

  mounted() {
    this.is_day_use = this.allowedSelectOneDay
    this.isAvailable = !this.is_including_occupied
    this.isUndated = this.is_undated
    this.setCalendar(this.is_day_use)
  },
  methods: {
    ...mapActions({
      saveRoomInfo: 'hotelDetail/a_saveRoomInfo',
      saveUseDayParams: 'hotelDetail/saveUseDayParams',
      setCalendar: 'booking/setCalendar',
      getRoomSelected: 'hotelDetail/getRoomSelected',
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies',
      clearRoomSelected: 'hotelDetail/clearRoomSelected',
      saveUseDayParamsFromBooking: 'booking/saveUseDayParamsFromBooking',
      saveIsUndated: 'booking/saveIsUndated',
      deleteRoomTypeCodes: 'booking/deleteRoomTypeCodes',
      saveIsRoomAvailable: 'booking/saveIsRoomAvailable',
      getPromoCode: 'booking/getPromoCode',
      setSearchType: 'booking/setSearchType'
    }),

    onDeleteRoomTypes(room) {
      this.deleteRoomTypeCodes(room.code)

      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },

    $_onChangeAvailable(isAvailable) {
      this.saveIsRoomAvailable(!isAvailable)
      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },
    $_onSwitchUseDay(is_day_use) {
      this.saveUseDayParamsFromBooking(is_day_use)
      this.setCalendar(is_day_use)

      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },
    $_onSwitchUndated(isUndated) {
      if (
        !this.is_day_use &&
        this.bookingData.checkIn === this.bookingData.checkOut
      ) {
        this.is_day_use = true
        // this.saveUseDayParamsFromBooking(false)
        // this.$_onSwitchUseDay(false)
      } else {
        this.is_day_use = false
      }

      if (this.isAvailable) {
        this.isAvailable = false
        // this.saveIsRoomAvailable(false)
        // this.$_onChangeAvailable(false)
      }

      this.saveIsUndated(isUndated)

      if (isUndated) {
        this.setSearchType('undated')
      } else {
        this.setSearchType('')
      }

      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },
    buildParams(lang) {
      return {
        hotelID: this.hotelID,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.numberChildrenInRoomSelected,
          mode: 'standard',
          adults: this.numberAdultsInRoomSelected,
          total_price_without_tax: this.totalPriceWithoutTax,
          rooms: this.roomSelectedParams,
          coupon_code: this.isDiscount ? this.bookingData.promoCode : ''
        },
        fullLang: lang
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail-rooms-and-plans {
  background: $bg-color-gray-8;
  padding: 30px 0 20px 0;

  @include min-sm {
    padding: 60px 0 50px 0;
  }

  &__no-room {
    width: 100%;
    text-align: center;
    border: 1px solid #dddee0;
    border-radius: 5px;
    padding: 50px 0;
    span {
      display: block;
      color: #767677;
      font-size: 14px;

      @include min-sm {
        font-size: 16px;
      }

      &:first-child {
        margin-bottom: 10px;
        font-size: 25px;
      }
    }
  }

  &__actions-top {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    @include min-sm {
      justify-content: flex-start;
      flex-direction: row;

      .app-checkbox {
        margin-right: 25px;
      }
    }
  }

  &__room-type {
    border: 1px solid #dddee0;
    border-radius: 25px;
    margin-right: 10px;
    padding: 6px 10px;
    background: white;
    width: fit-content;
    flex-wrap: wrap;
    margin-top: 5px;
    margin-bottom: 5px;

    span {
      font-size: 14px;
    }

    span.icon-Icon-Close {
      font-size: 12px;
      cursor: pointer;
      padding: 5px;
    }
  }
}
.error-popup {
  font-size: 18px;
  text-align: center;
  color: rgb(70, 70, 70);
  background-color: white;
  padding: 20px 0;
  &__title {
    font-weight: bold;
    color: red;
    margin-bottom: 20px;
    font-size: 14px;

    @include min-sm {
      font-size: 15px;
    }
  }
  &__message {
    font-size: 15px;
    margin-bottom: 20px;
  }
  &__button {
    padding: 10px 30px;
  }
}
.error {
  background-color: white;
}
</style>

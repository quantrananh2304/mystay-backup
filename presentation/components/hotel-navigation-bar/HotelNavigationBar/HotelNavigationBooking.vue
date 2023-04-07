<template>
  <form @submit.prevent>
    <div class="hotel-booking">
      <div v-show="isShowSearchBox" class="hotel-booking__search-box">
        <span class="icon-Icon-Search" />
        <!-- eslint-disable-next-line -->
        <input
          v-model="searchValue"
          type="text"
          :placeholder="$t('booking.search_hotels_destinations')"
          readonly
          @click="$_openHeaderSearchBox"
        />
        <span
          v-show="searchValue"
          class="icon-Icon-Close"
          @click="$_clearSearchBox"
        />
      </div>
      <div v-show="!isUndated" class="hotel-booking__calendar">
        <div
          class="hotel-booking__calendar__top hotel-booking-block"
          :class="{ 'active-calender': bookingState.checking }"
          @click="showChecking"
        >
          <span class="icon-Icon-Calendar hotel-booking-icon" />
          <span>
            {{
              bookingData.checkIn
                ? getCheckinDate
                : '' | datetime($langFormat(language))
            }}
            -
            {{
              bookingData.checkOut
                ? getCheckoutDate
                : '' | datetime($langFormat(language))
            }}
          </span>
        </div>
        <div
          class="hotel-booking__calendar__bottom"
          :class="{ 'hotel-calendar': !isShowSearchBox }"
        >
          <div v-if="bookingState.checking">
            <LazyCalendar
              container="hotel-booking__calendar"
              sub-container="hotel-booking__calendar__bottom"
              :invalid-date="invalidDate"
              :minimum-stay="minimumStay"
              :page="page"
              @clickDoneBtn="closeAll"
            />
          </div>
        </div>
      </div>
      <div v-show="isUndated" class="hotel-booking__night-select">
        <div
          v-click-outside="clickOutsideNightSelect"
          class="hotel-booking__night-select__top hotel-booking-block"
          @click="showNightSelect"
        >
          <span class="icon-Icon-Group hotel-booking-icon" />
          <span>{{ totalNight }} nights</span>
        </div>
        <div
          v-if="bookingState.nightSelect"
          class="hotel-booking__night-select__bottom sort-by-night"
        >
          <ul>
            <li
              v-for="night in 9"
              :key="night"
              :class="{ active: false }"
              @click="$_selectNumberNight(night)"
            >
              {{ night }} nights
            </li>
          </ul>
        </div>
      </div>
      <div class="hotel-booking__room-select">
        <div
          class="hotel-booking__room-select__top hotel-booking-block"
          @click="showRoomSelect"
        >
          <span class="icon-Icon-Group hotel-booking-icon" />
          <span>
            {{ language !== 'ja' ? numberOfRooms : '' }}
            {{
              numberOfRooms > 1
                ? this.$t('booking.rooms')
                : this.$t('booking.room')
            }}{{ language === 'ja' ? `: ${numberOfRooms}` : '' }},
            {{ language !== 'ja' ? totalGuest : '' }}
            {{
              totalGuest > 1
                ? this.$t('booking.guests')
                : this.$t('booking.guest')
            }}{{ language === 'ja' ? `: ${totalGuest}` : '' }}
          </span>
        </div>
        <div class="hotel-booking__room-select__bottom">
          <div v-if="bookingState.roomSelect" class="room-select-container">
            <RoomSelectContent
              v-show="bookingState.roomSelect"
              @on:close="$_onClose"
              @on:apply="$_onApply"
              @on:showRoom="$_onShowRoom"
            />
          </div>
        </div>
      </div>
      <div v-show="!hidePromo" class="hotel-booking__promo-code">
        <div
          class="hotel-booking__promo-code__top hotel-booking-block promo-code"
        >
          <span class="icon-Icon-Promo-Codes hotel-booking-icon" />
          <!-- eslint-disable-next-line -->
          <input
            v-model="promoCodeValue"
            type="text"
            :placeholder="$t('hoteldetail.add_promo')"
            maxlength="10"
            @input="$_savePromoCode"
            @click="onShowOverlay"
          />
          <span
            v-show="promoCodeValue.length > 0"
            class="icon-Icon-Close close-icon"
            @click="$_clearPromoCode"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import ClickOutside from 'vue-click-outside'
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import RoomSelectContent from '../../booking/RoomSelect/RoomSelectContent.vue'

export default Vue.extend({
  name: 'HotelNavigationBooking',
  directives: {
    ClickOutside
  },
  components: {
    RoomSelectContent
  },
  props: {
    roomSelect: {
      type: Array
    },
    isShowSearchBox: {
      type: Boolean,
      default: () => false
    },
    hidePromo: {
      type: Boolean,
      default: () => false
    },
    page: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      promoCodeValue: '',
      calendarContainer: '.hotel-booking__calendar',
      data: { checkIn: null, checkOut: null },
      invalidDate: [
        { start: new Date(2020, 5, 22), end: new Date(2020, 5, 24) }
      ],
      minimumStay: [{ d: new Date(2020, 5, 4) }, { d: new Date(2020, 5, 5) }],
      searchValue: ''
    }
  },
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      bookingState: state => state.booking.bookingState,
      bookingStorate: state => state.general.data.booking,
      location: state => state.booking.bookingData.location,
      isUndated: state => state.booking.bookingData.is_undated
    }),
    ...mapGetters({
      totalGuest: 'booking/totalGuest',
      language: 'appHeader/language',
      getCheckinDate: 'booking/getCheckinDate',
      getCheckoutDate: 'booking/getCheckoutDate',
      rooms: 'booking/roomList',
      totalNight: 'booking/totalNight',
      lang: 'appHeader/language'
    }),

    calendarDate() {
      const checkIn = this.bookingData.checkIn
      const checkOut = this.bookingData.checkOut
      const calendarDate = [checkIn, checkOut]
      return calendarDate
    },

    numberOfRooms() {
      return this.bookingData && this.bookingData.roomList.length
    }
  },
  watch: {
    bookingData(data) {
      this.promoCodeValue = data.promoCode || ''
      this.searchValue = data.location
    },
    location(newData) {
      this.searchValue = newData
    }
  },
  mounted() {
    this.promoCodeValue = this.bookingData.promoCode || ''
    this.searchValue = this.bookingData.location
  },
  methods: {
    ...mapActions({
      showChecking: 'booking/showChecking',
      showRoomSelect: 'booking/showRoomSelect',
      showNightSelect: 'booking/showNightSelect',
      showTotalGuest: 'booking/showTotalGuest',
      showPromoCode: 'booking/showPromoCode',
      closeAll: 'booking/closeAll',
      getCheckin: 'booking/getCheckin',
      getCheckout: 'booking/getCheckout',
      openHeaderSearchBox: 'searchHotel/openHeaderSearchBox',
      getHotelPosition: 'searchHotel/getHotelPosition',
      getBooking: 'booking/getInitialBooking',
      setBooking: 'booking/setInitialBooking',
      searchRoom: 'hotelDetail/searchRoom',
      getPromoCode: 'booking/getPromoCode',
      toggleHeaderSearchBox: 'appAuthen/toggleHeaderSearchBox',
      filterHotelListForSearchBox: 'hotel/filterHotelListForSearchBox',
      setTotalNight: 'booking/setTotalNight'
    }),
    $_onClose() {
      this.closeAll()
      this.$nuxt.$emit('hotet-detail-submit-calendar')
    },

    $_onApply() {
      this.closeAll()
      this.setBooking(this.bookingData)
      this.$emit('on:applyRoom')
    },

    $_selectNumberNight(numberNight) {
      // this.closeAll()
      this.setTotalNight(numberNight)
      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.lang
          )
        })
        .catch(() => {})
    },

    $_onShowRoom() {
      // this.showTotalGuest();
      this.showRoomSelect()
    },

    $_onShowNight() {
      this.showNightSelect()
    },

    $_clearPromoCode() {
      this.promoCodeValue = ''
      this.$_savePromoCode()
      this.$router
        .push({
          query: this.$paramsHotelDetailFromWidget(
            { ...this.bookingData, nights: this.totalNight },
            this.language
          )
        })
        .catch(() => {})
    },

    $_clearSearchBox() {
      this.promoCodeValue = ''
      this.$_openHeaderSearchBox()
    },

    $_openHeaderSearchBox() {
      this.toggleHeaderSearchBox(true)
      this.closeAll()
      this.filterHotelListForSearchBox(this.searchValue)
      this.$scrollBody.disable()
    },

    $_savePromoCode() {
      this.getPromoCode(this.promoCodeValue)
    },

    onShowOverlay() {
      this.showPromoCode()
    },

    clickOutsideNightSelect() {
      if (this.bookingState.nightSelect) {
        this.closeAll()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-booking {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  position: relative;

  @include min-md {
    padding: 0;
    color: #000;
    justify-content: center;
  }

  &__search-box {
    position: relative;
    display: none;
    @include min-sm {
      display: block;
      margin-right: 15px;
      width: 43%;
      cursor: pointer;
      input {
        width: 100%;
        height: 43px;
        padding-left: 42px;
        padding-right: 20px;
        outline: none;
        border-radius: 3px;
        font-size: 14px;
        color: $text-color-blue-2;
        border: none;
        font-weight: bold;
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &::placeholder {
          color: $text-color-blue-2;
        }

        @include min-lg {
          padding-right: 42px;
        }
      }
      span {
        position: absolute;
        &:first-child {
          font-size: 18px;
          left: 10px;
          top: 12px;
          color: $text-color-blue-2;
        }

        &:last-child {
          position: absolute;
          right: 10px;
          top: 13px;
          font-size: 7px;
          width: 16px;
          height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          border-radius: 10px;
          background: #8a92a3;
          cursor: pointer;
          @include min-sm {
            right: 10px;
          }
        }
      }
    }

    @include min-lg {
      width: 370px;
    }
  }

  .hotel-booking-block {
    cursor: pointer;
    width: 100%;
    color: $bg-color-blue-2;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 17px;
    background: #fff;
    border: 1px solid #dddee0;
    border-radius: 2px;
    padding: 8px 5px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    @include min-sm {
      position: relative;
      font-size: 14px;
    }

    @include min-lg {
      justify-content: stretch;
    }

    .hotel-booking-icon {
      display: none;
      @include min-sm {
        display: block;
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }

  &__calendar {
    width: 31%;
    @include min-sm {
      position: relative;
    }

    @include min-lg {
      width: 210px;
    }

    &__top {
      &::after {
        content: '';
        opacity: 0;
        visibility: hidden;
        right: 50%;
        width: 20px;
        height: 20px;
        background: #fff;
        top: calc(100% + 25px);
        position: absolute;
        -webkit-transform: translateX(50%) rotate(-45deg);
        transform: translateX(50%) rotate(-45deg);
      }
    }

    &__bottom {
      @include min-sm {
        display: block;
        position: absolute;
        top: calc(100% + 20px);
        left: -230px;
        min-width: 750px;
      }

      @include min-lg {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .active-calender {
    &::after {
      top: calc(100% + 15px);
      z-index: 1;
      opacity: 1;
      visibility: visible;
      transition: 0.2s ease-in-out;
      transition-delay: 0.3s;
    }
  }

  &__night-select {
    width: 90px;

    @include min-sm {
      width: 210px;
    }

    &__bottom {
      position: absolute;
      top: 75px;
      left: 0;
      background: white;
      box-shadow: -7px 11px 18px -1px rgba(37, 58, 106, 0.5);
      z-index: 1;
      width: 90px;

      @include min-sm {
        z-index: 10;
        top: 70px;
        width: 210px;
      }

      ul {
        li {
          color: #000;
          padding: 10px 10px 10px 20px;
          border-bottom: 1px solid #cccccc;
          font-size: 13px;
          cursor: pointer;

          &:hover {
            background: #1a489c;
            color: white;
            border-bottom: 1px solid #1a489c;
          }

          @include min-sm {
            font-size: 14px;
          }
        }

        .active {
          background: #1a489c;
          color: white;
          border-bottom: 1px solid #1a489c;
        }
      }

      &::before {
        content: '';
        position: absolute;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        top: -10px;
        left: 45%;
      }
    }
  }

  &__room-select {
    width: 35%;

    @include min-lg {
      width: 180px;
    }
    &__bottom {
      @include min-sm {
        position: relative;
        width: 100%;
        .room-select-container {
          transition: 0.3s ease;
          animation-name: mbsc-anim-p-in;
          animation-duration: 0.3s;
          top: 100%;
          left: -55%;
          position: absolute;
          background: #fff;
          z-index: 10000;
        }
      }
    }
    @include min-sm {
      margin: 0 15px;
    }
  }
  &__promo-code {
    width: 30%;
    @include min-lg {
      width: 150px;
    }
    cursor: pointer;
    &__top {
      input {
        width: 100%;
        height: 100%;
        padding: 0;
        border: none;
        outline: none;
        color: $text-color-blue-2;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        margin-left: -5px;
        &::placeholder {
          padding-left: -5px;
          text-transform: capitalize;
          color: $text-color-blue-2;
          font-weight: bold;
        }
        @include min-sm {
          padding: 3px 4px 4px;
          margin-right: 20px;
        }
      }
    }
  }
  .close-icon {
    position: absolute;
    right: 5px;
    font-size: 7px;
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 1px;
    color: #fff;
    border-radius: 10px;
    background: #8a92a3;
    cursor: pointer;
    @include min-sm {
      right: 10px;
    }
  }

  .room-select-wrapper {
    &::before {
      left: 50%;
    }
  }
}
.hotel-calendar {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  .calendar-desktop::after {
    left: 12%;
  }

  @include min-sm {
    position: absolute;
    top: calc(100% + 20px);
    transform: translateX(0);
  }
}
</style>

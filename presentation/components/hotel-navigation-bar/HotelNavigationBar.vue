<template>
  <div class="hotel-navigation-bar">
    <AppSticky
      :class-name="'hotel-navigation'"
      :z-index="1000"
      :no-sticky="isMobile ? true : false"
    >
      <section
        :class="{
          'hotel-navigation-bar': true,
          active:
            bookingState.checking ||
            bookingState.roomSelect ||
            bookingState.promoCode
        }"
      >
        <!-- <HeaderNavTop @changeLanguage="changeLanguage" /> -->

        <AppSticky :z-index="2">
          <BackToPage v-if="isShowBackToSearchResult" />
        </AppSticky>

        <div ref="navigationBar" class="container">
          <div class="hotel-navigation-bar__icon">
            <NuxtLink to="/" class="navbar-brand" aria-label="mystays-logo">
              <img :src="require('@/assets/images/Logo.svg')" alt>
            </NuxtLink>
          </div>

          <HotelNavigationBarInfo />

          <div class="hotel-navigation-bar__booking-block">
            <HotelNavigationBooking
              v-if="!isSelectedHotel"
              :room-select="roomSelect"
              page="hotel-detail-page"
              @on:applyRoom="$_applyRoom"
            />
            <!-- eslint-disable -->
            <div
              v-if="isSelectedHotel"
              class="hotel-navigation-bar__booking-block__room-selected"
              v-html="roomSelectedText"
            />
          </div>
        </div>

        <HotelNavigationBarStep :current-step="currentStep" />
      </section>
    </AppSticky>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import moment from 'moment'
export default Vue.extend({
  name: 'HotelNavigationBar',
  props: {
    isSelectedHotel: {
      type: Boolean
    },
    currentStep: {
      type: Number,
      default: () => 0
    },
    isShowBackToSearchResult: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      bookingState: state => state.booking.bookingState,
      isOpenSearchBox: state => state.searchHotel.openHeaderSearchBox,
      roomSelect: state => state.booking.bookingData.roomList,
      hotelName: state => state.hotelDetail.hotelDetail.data.name,
      roomParamsForGetRoomSelected: state =>
        state.booking.roomParamsForGetRoomSelected
    }),

    ...mapGetters({
      checkinDate: 'booking/getCheckinDate',
      checkoutDate: 'booking/getCheckoutDate',
      lang: 'appHeader/language',
      numberAdultsInRoomSelected: 'booking/numberAdultsInRoomSelected',
      numberChildrenInRoomSelected: 'booking/numberChildrenInRoomSelected'
    }),

    totalGuest() {
      return this.numberAdultsInRoomSelected + this.numberChildrenInRoomSelected
    },

    getLanguage() {
      return {
        selected: this.$t('summary.you_have_selected'),
        on: this.$t('summary.on'),
        for: this.$t('summary.for'),
        room: this.$t('booking.room'),
        rooms: this.$t('booking.rooms'),
        guest: this.$t('booking.guest'),
        guests: this.$t('booking.guests')
      }
    },

    bookingDate() {
      const checkin = this.$dateTime(
        this.checkinDate,
        this.$langFormat(this.$i18n.locale),
        true
      )

      const checkout = this.$dateTime(
        this.checkoutDate,
        this.$langFormat(this.$i18n.locale),
        true
      )

      return `${checkin} - ${checkout}`
    },

    totalGuestText() {
      return `${this.totalGuest} ${
        this.totalGuest > 1
          ? this.$t('hoteldetail.peoples')
          : this.$t('hoteldetail.people')
      }`
    },

    roomSelectedText() {
      return this.$t('booking.you_have_selected', {
        hotel_name: `<span>${this.hotelName}</span>` || '',
        booking_date: `<span>${this.bookingDate}</span>`,
        number_guest: `<span>${this.totalGuestText}</span>`
      })
    }
  },
  watch: {
    lang(lang) {
      moment.locale(lang)
    }
  },
  destroyed() {
    this.$_closeSearchBox()
  },
  methods: {
    ...mapActions({
      toggleHeaderSearchBox: 'searchHotel/toggleHeaderSearchBox',
      openHeaderSearchBox: 'searchHotel/openHeaderSearchBox',
      closeHeaderSearchBox: 'searchHotel/closeHeaderSearchBox'
    }),

    $_applyRoom() {
      this.$emit('on:Apply')
    },

    $_closeSearchBox() {
      this.toggleHeaderSearchBox(false)
      this.$scrollBody.enable()
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-navigation {
  top: 0 !important;
}
.hotel-navigation-bar {
  display: flex;
  flex-direction: column;
  background: $bg-color-nav;
  position: relative;
  padding-bottom: 5px;

  @include min-sm {
    padding-bottom: 0;
  }
  &__icon {
    text-align: center;
    .navbar-brand {
      margin: 0;
    }
    @include min-sm {
      padding: 0;
    }
  }

  &__booking-block {
    color: white;
    font-size: 15px;
    margin-bottom: 2px;
    ::v-deep {
      span {
        font-weight: bold;
      }
    }

    @include min-md {
      margin-right: 20px;
      margin-left: 20px;
      margin-bottom: 0;
      flex-basis: 50%;
    }

    @include min-xl {
      flex-basis: auto;
    }

    @include min-xxl {
      margin-left: 0;
    }

    &__room-selected {
      display: none;
      max-width: 550px;
      @include min-sm {
        display: block;
        padding: 5px 0 5px 20px;
      }
    }
  }

  .container {
    @include min-sm {
      min-height: 90px;
    }
    @include min-md {
      display: flex;
      align-items: center;
      padding: 18px 10px;
      justify-content: space-around;
    }

    @include min-xl {
      padding: 18px 0;
      justify-content: space-between;
    }
  }

  &--sticky {
    .back-page {
      position: fixed;
      top: 0;
      z-index: 11;
    }
    @include min-sm {
      .back-page {
        position: relative;
        // top: 0;
        // z-index: 11;
      }
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 500;
    }
    .hotel-navigation-bar__icon {
      @include min-md {
        display: block;
      }
    }
  }
}
.active {
  z-index: 500;
}
</style>

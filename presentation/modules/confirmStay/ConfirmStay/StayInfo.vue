<template>
  <div class="stay-info">
    <div class="stay-info__title">
      <h4>{{ getLanguage.yourStay }}</h4>
    </div>
    <div class="stay-info__address">
      <div class="stay-info__address__name">
        <p class="font-weight-bold">
          {{ hotelName }}
        </p>
        <span>{{ address }}</span>
      </div>
      <div class="stay-info__address__icon">
        <span class="icon-Icon-Map-Pin" />
      </div>
    </div>
    <div class="stay-info__block">
      <div class="stay-info__block__icon">
        <span class="icon-Icon-Calendar" />
      </div>
      <div class="stay-info__block__text">
        <span>{{ getChecInOutText }}</span>
        <span class="block">/</span>
        <span>
          {{ reservationsData.nights }}
          {{
            reservationsData.nights > 1 ? getLanguage.nights : getLanguage.night
          }}
        </span>
      </div>
    </div>
    <div class="stay-info__block">
      <div class="stay-info__block__icon">
        <span class="icon-Icon-Group" />
      </div>
      <div class="stay-info__block__text">
        <span> {{ guestAndRoomText }}</span>
      </div>
    </div>
    <div>
      <div
        v-for="(room, index) in roomSelected"
        :key="index"
        class="stay-info__block"
      >
        <div class="stay-info__block__icon">
          <span class="icon-Icon-Bed" />
        </div>
        <div class="stay-info__block__text">
          <span>
            {{ getLanguage.room }} {{ index + 1 }} / {{ room.room_type_name }} x
            {{ room.guestCountText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import getGuestText from '~/mixins/guestText'
export default Vue.extend({
  name: 'StayInfo',
  mixins: [getGuestText],
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      roomList: state => state.booking.bookingData.roomList,
      isHotelDetailLoading: state => state.hotelDetail.isHotelDetailLoading
    }),
    ...mapGetters({
      reservationsData: 'booking/reservationsData',
      hotelDetail: 'hotelDetail/hotelDetail',
      lang: 'appHeader/language'
    }),
    getLanguage() {
      return {
        room: this.$t('booking.room'),
        rooms: this.$t('booking.rooms'),
        guest: this.$t('booking.guest'),
        guests: this.$t('booking.guests'),
        yourStay: this.$t('summary.your_stay'),
        night: this.$t('summary.night'),
        nights: this.$t('customhtmlcalendar.nights'),
        child: this.$t('booking.child'),
        children: this.$t('booking.children'),
        adult: this.$t('booking.adult'),
        adults: this.$t('booking.adults')
      }
    },

    guestAndRoomText() {
      const totalGuest =
        this.reservationsData.adults + this.reservationsData.children
      return `${this.getLanguage.room}: ${this.reservationsData.room_count} , ${this.getLanguage.guest}: ${totalGuest}`
    },

    roomSelected() {
      const rooms = this.reservationsData?.rooms?.map((room) => {
        const guestCountText = this.getGuestText(room.adults, room.children)

        return {
          ...room,
          guestCountText
        }
      })

      return rooms
    },

    hotelName() {
      return this.hotelDetail?.name
    },

    getChecInOutText() {
      const checkin = this.$dateTime(
        this.reservationsData.checkin_date,
        this.$langFormat(this.$i18n.locale),
        true
      )
      const checkout = this.$dateTime(
        this.reservationsData.checkout_date,
        this.$langFormat(this.$i18n.locale),
        true
      )

      return `${checkin} - ${checkout}`
    },

    address() {
      if (this.hotelDetail) {
        return `${this.hotelDetail?.address?.full_address}, ${this.hotelDetail?.address?.country}`
      }
      return ''
    }
  }
})
</script>

<style lang="scss" scoped>
.stay-info {
  background: #ffffff;
  margin-bottom: 20px;
  @include min-sm {
    padding: 27px 30px 30px 30px;
    border: 1px solid $border-color-gray-2;
    border-radius: 0 0 4px 4px;
  }

  &__address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px 18px 18px;
    border: 1px solid $border-color-gray-2;
    border-radius: 3px;
    margin-bottom: 20px;
    @include min-sm {
      display: none;
    }
    &__name {
      p {
        font-size: 14px;
        margin: 0;
        @include min-sm {
          font-size: 16px;
        }
      }
      span {
        font-size: 11px;
        color: $text-color-blue-2;
        @include min-sm {
          font-weight: 700;
        }
      }
    }
    &__loading {
      width: 100%;
    }
    &__icon {
      @include min-sm {
        span {
          font-size: 22px;
        }
      }
    }
  }

  &__title {
    h4 {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 20px;
      @include min-sm {
        margin-bottom: 13px;
        font-size: 18px;
      }
    }
  }
  &__block {
    display: flex;
    align-items: center;
    padding: 13px 0;
    border-bottom: 1px solid $border-color-gray-2;
    &__icon {
      margin-right: 12px;
      color: #9196a3;
      font-size: 17px;
    }

    &__text {
      font-size: 12px;
      color: $text-color-blue;
      font-weight: bold;
      .block {
        padding: 0 10px;
      }
      @include min-sm {
        font-size: 14px;
      }
    }
  }
}
</style>

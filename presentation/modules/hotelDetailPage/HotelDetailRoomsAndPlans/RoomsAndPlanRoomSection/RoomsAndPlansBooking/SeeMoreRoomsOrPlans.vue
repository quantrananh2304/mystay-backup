<template>
  <div class="see-more-room-or-plan">
    <div
      v-if="mainCardInfo.promoCodeName"
      class="see-more-room-or-plan top-booking"
    >
      <p class="rate-from">
        {{ getLanguage.rateFrom }}
      </p>
      <div class="promo-code">
        <span>{{ mainCardInfo.promoCodeName }}</span>
      </div>
      <div class="total-rate">
        <span v-if="$nuxt.isOnline" class="rate">
          {{
            mainCardInfo && mainCardInfo.rateBeforeDiscount | currency('YEN')
          }}
        </span>
        <span class="discount-rate">
          {{ mainCardInfo && mainCardInfo.rate | currency('YEN') }}
        </span>
      </div>
      <p>{{ guestText }} / {{ totalNightText }}</p>
      <div v-if="roomList.length > 1" class="multiple-room py-1">
        {{
          mainCardInfo &&
            (mainCardInfo.rate * roomList.length) | currency('YEN')
        }}
        <span>
          ({{ roomList.length }}
          {{ roomList.length > 1 ? $t('booking.rooms') : $t('booking.rooms') }})
        </span>
      </div>
      <button
        v-if="mainCardInfo.subContent.length !== 0 && !subContentIsOpen"
        class="button m-btn m-btn__yellow"
        @click="$_togglePlans"
      >
        {{ mainCardInfo.roomId ? getLanguage.seePlan : getLanguage.seeRoom }}
      </button>
      <button
        v-else-if="mainCardInfo.subContent.length !== 0 && subContentIsOpen"
        class="button m-btn m-btn__gray"
        @click="$_togglePlans"
      >
        {{ getLanguage.close }}
      </button>
    </div>

    <div v-else class="see-more-room-or-plan top-booking">
      <p class="rate-from">
        {{ getLanguage.rateFrom }}
      </p>
      <span v-if="$nuxt.isOnline">
        {{ mainCardInfo && mainCardInfo.rate | currency('YEN') }}
      </span>

      <p>{{ guestText }} / {{ totalNightText }}</p>

      <div v-if="roomList.length > 1" class="multiple-room py-1">
        {{
          mainCardInfo &&
            (mainCardInfo.rate * roomList.length) | currency('YEN')
        }}
        <span>
          ({{ roomList.length }}
          {{ roomList.length > 1 ? $t('booking.rooms') : $t('booking.rooms') }})
        </span>
      </div>
      <button
        v-if="mainCardInfo.subContent.length !== 0 && !subContentIsOpen"
        class="button m-btn m-btn__yellow"
        @click="$_togglePlans"
      >
        {{ mainCardInfo.roomId ? getLanguage.seePlan : getLanguage.seeRoom }}
      </button>
      <button
        v-else-if="mainCardInfo.subContent.length !== 0 && subContentIsOpen"
        class="button m-btn m-btn__gray"
        @click="$_togglePlans"
      >
        {{ getLanguage.close }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import getGuestText from '~/mixins/guestText'
export default {
  name: 'SeeMoreRoomsOrPlans',
  mixins: [getGuestText],
  props: {
    mainCardInfo: {
      type: Object,
      default: () => {}
    },
    subContentIsOpen: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters({
      totalGuest: 'booking/totalGuest',
      totalNight: 'booking/totalNight',
      cancellationPolicies: 'hotelDetail/cancellationPolicies',
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

    guestText() {
      const numberAdult = this.roomDataDefault
        ? this.roomDataDefault.adults
        : this.roomStatus && this.roomStatus.adults.number
      const numberChildren = this.roomDataDefault
        ? this.roomDataDefault.children
        : this.roomStatus && this.roomStatus.children.childrenList.length

      return this.getGuestText(numberAdult, numberChildren)
    },
    isHasNoPlanRoom() {
      return this.mainCardInfo && this.mainCardInfo.subContent.length === 0
    },
    getLanguage() {
      return {
        earn: this.$t('hoteldetail.earn'),
        perNight: this.$t('hoteldetail.per_night'),
        seePlan: this.$t('hoteldetail.see_plan'),
        seeRoom: this.$t('hoteldetail.see_room'),
        close: this.$t('hoteldetail.close'),
        joinToUnlock: this.$t('hoteldetail.join_to_unlock'),
        rateFrom: this.$t('hoteldetail.rate_from'),
        guest: this.$t('booking.guest'),
        guests: this.$t('booking.guests'),
        children: this.$t('booking.children'),
        child: this.$t('booking.child'),
        adult: this.$t('booking.adult'),
        adults: this.$t('booking.adults')
      }
    }
  },
  methods: {
    $_togglePlans() {
      this.$emit('togglePlans')
    }
  }
}
</script>

<style lang="scss" scoped>
.see-more-room-or-plan {
  flex: 0 1 100px;
  display: none;

  @include min-sm {
    display: block;
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

  &.top-booking {
    font-size: 11px;
    color: $text-color-blue;

    .button {
      width: 100%;
      font-size: 14px;
      padding: 10px;
      margin-top: 5px;
    }

    .rate-from {
      font-size: 10px;
      font-weight: bold;
      margin: 0;
      text-transform: uppercase;
      color: #e02d47;
    }

    span {
      font-size: 20px;
      font-weight: bold;
      margin-right: 6px;
    }

    span.rate {
      text-decoration: line-through;
      color: $text-color-gray-6;
      font-size: 16px;
      font-weight: normal;
    }

    span.discount-rate {
      color: $text-color-pink;
      font-size: 20px;
      font-weight: bold;
    }

    p {
      margin-bottom: 0;
    }
  }

  .promo-code {
    margin-top: 8px;
    margin-bottom: 5px;
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

.active {
  background: #232e48;
  color: #ffd25d;
  border-color: #232e48;
}
</style>

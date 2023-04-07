<template>
  <div class="booking-item">
    <div class="booking-item__facility-name mb-3">
      <h5 class="font-weight-bold">
        {{ bookingData.hotel && bookingData.hotel.name }}
      </h5>
    </div>
    <div class="booking-item__checkin-out mb-3 pl-1">
      <h6>{{ bookingTime }}</h6>
    </div>
    <div class="booking-item__rooms pb-4">
      <div
        v-for="item in bookingData.rooms"
        :key="item.id"
        class="mb-4"
        @click="onRouteConfirmBooking"
      >
        <RoomItem
          :room-item="item"
          :status="bookingItem.status"
          :is-past="isPast"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { encodeBase64 } from '../../../../shared/helper/base64'

export default {
  name: 'MyBookingItem',
  props: {
    bookingItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      bookingData: this.bookingItem
    }
  },

  watch: {
    bookingItem(bookingItem) {
      this.bookingData = bookingItem
    }
  },
  computed: {
    ...mapGetters({
      lang: 'appHeader/language'
    }),
    bookingTime() {
      const checkin = this.$dateTime(
        this.bookingData?.checkin_date,
        this.$langFormat(this.lang),
        true
      )
      const checkout = this.$dateTime(
        this.bookingData?.checkout_date,
        this.$langFormat(this.lang),
        true
      )

      return `${checkin} - ${checkout}`
    },
    isPast() {
      return moment().isAfter(this.bookingData?.checkout_date)
    }
  },

  methods: {
    onRouteConfirmBooking() {
      const query = {
        email: encodeBase64(this.bookingData.email),
        hotel_id: this.bookingData?.hotel?.id
      }
      this.$router.push({
        path: `/profile${this.$pageRoute.comfirmBooking}/${this.bookingData.reservation_number}`,
        query
      })

      this.$gtm.push({
        event: 'clickBooking',
        pageCategory: this.$route.name,
        language: this.$langFormat(this.lang),
        bookingId: this.bookingData.reservation_number,
        triggerType: 'User Interaction'
      })
    }
  }
}
</script>

<style></style>

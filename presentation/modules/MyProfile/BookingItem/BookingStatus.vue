<template>
  <div class="booking-status" :style="{ background }">
    <BIconX v-if="status === 'cancelled'" scale="1.5" />
    <BIconCheck v-if="status === 'done'" scale="2" class="mr-1" />

    <span v-if="status === 'coming_up'" class="icon-travel-walk" />
    <span>{{ statusText }}</span>
  </div>
</template>

<script>
import { BIconX, BIconCheck } from 'bootstrap-vue'

export default {
  name: 'BookingStatus',
  components: {
    BIconCheck,
    BIconX
  },
  props: {
    status: {
      type: String,
      default: ''
    },
    isPast: {
      type: Boolean,
      default: ''
    }
  },
  computed: {
    background() {
      if (this.status === 'cancelled') {
        return '#dc3545'
      }

      if (this.status === 'done') {
        return '#28A745'
      }

      if (this.status === 'coming_up') {
        return '#17a2b8'
      }
    },

    statusText() {
      if (this.status == 'coming_up') {
        return this.$t('my_profile.coming_up')
      }

      if (this.status === 'cancelled') {
        return this.$t('my_profile.cancelled')
      }

      if (this.status == 'done') {
        return this.$t('my_profile.completed')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-status {
  border: 1px solid;
  border-radius: 4px;
  color: white;
  padding: 2px 10px 3px 10px;

  .icon-travel-walk {
    margin-top: 5px;
  }
}
</style>

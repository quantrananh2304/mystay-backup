<template>
  <div class="booking-item">
    <div class="booking-item__image">
      <LazyLoadBgrImage
        :img-url="roomData.room_type_image || defaultBackgroundImage"
      />
    </div>
    <div class="booking-item__info">
      <div class="mb-2 font-weight-bold booking-item__info__room-name">
        {{ roomData.room_type_name }}
      </div>
      <div class="mb-2 booking-item__info__room-plan">
        {{ roomData.room_plan_name }}
      </div>
      <div class="booking-item__info__status text-capitalize d-flex">
        <BookingStatus :status="status" :is-past="isPast" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BookingItem',
  props: {
    roomItem: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: ''
    },
    isPast: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      roomData: this.roomItem,
      defaultBackgroundImage:
        'https://s3-ap-northeast-1.amazonaws.com/triplabot-production/assets/placeholder.jpg'
    }
  },
  computed: {
    ...mapState({
      userData: state => state.users.data.userData
    })
  },
  watch: {
    roomItem(roomItem) {
      this.roomData = roomItem
    }
  }
}
</script>

<style lang="scss" scoped>
.booking-item {
  padding: 15px;
  box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
  border-radius: 5px;
  background: white;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;

  @include min-sm {
    padding: 10px;
    flex-direction: row;
  }

  &__image {
    width: 100%;
    background-size: cover;
    background-position: bottom;
    margin-right: 25px;
    margin-bottom: 20px;

    @include min-sm {
      height: initial;
      margin-bottom: 0;
      width: 180px;
      height: 120px;
    }
  }

  &__info {
    flex: 1;
    &__room-name {
      font-size: 19px;
    }

    &__room-plan {
      font-size: 14px;
    }

    &__status {
      padding: 10px 0;
      justify-content: flex-end;

      @include min-sm {
        justify-content: flex-start;
        padding: 0;
        position: static;
      }
    }
  }

  &__price {
    position: absolute;
    left: 200px;
    top: 60px;

    @include min-sm {
      position: static;
    }
  }
}
</style>

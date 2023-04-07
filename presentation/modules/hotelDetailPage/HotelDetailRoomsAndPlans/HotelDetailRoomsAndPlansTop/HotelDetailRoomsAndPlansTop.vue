<template>
  <div class="hotel-detail-rooms-and-plans-top d-flex">
    <div class="hotel-detail-rooms-and-plans-top__title">
      <h2>{{ roomsAndPlansText }}</h2>
    </div>
    <div class="hotel-detail-rooms-and-plans-top__filters">
      <HotelDetailSortBy class="d-none d-lg-block" />
      <HotelDetailRoomsAndPlansFilter @changeFilter="onChangeFilter()" />
      <RoomsAndPlansFilterSection />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    roomsLength: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    ...mapGetters({
      plansList: 'hotelDetail/planLeftFilter',
      roomList: 'hotelDetail/roomLeftFilter',
      lang: 'appHeader/language'
    }),
    roomsAndPlansText() {
      if (!this.roomList.length && !this.plansList.length) {
        return ''
      }

      if (this.$i18n.locale === 'en') {
        return `${this.roomText} & ${this.planText}`
      }

      return `${this.roomText} / ${this.planText}`
    },
    roomText() {
      if (this.roomList.length > 1) {
        return this.$t('booking.number_rooms', {
          number: this.roomList.length
        })
      }

      return this.$t('booking.number_room', {
        number: this.roomList.length
      })
    },
    planText() {
      if (this.roomList.length > 1) {
        return this.$t('hoteldetail.number_plans', {
          number: this.plansList.length
        })
      }

      return this.$t('hoteldetail.number_plan', {
        number: this.plansList.length
      })
    }
  },
  methods: {
    ...mapActions({
      saveSortRoomBy: 'hotelDetail/saveSortRoomBy'
    }),
    onChangeFilter(filterType) {
      this.$emit('changeFilter', filterType)
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-detail-rooms-and-plans-top {
  flex-direction: column;
  margin-bottom: 26px;

  @include min-md {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  &__title {
    flex-grow: 1;
    h2 {
      color: $text-color-blue;
      font-size: 18px;
      font-weight: 650;
      margin-bottom: 26px;

      @include min-md {
        font-size: 30px;
        margin-bottom: 0;
      }
    }
  }

  &__filter-button {
    position: relative;
    display: none;
    @include min-sm {
      display: block;
    }
    .filter-button {
      margin-right: 20px;
      border: 1px solid #cccccc;
      padding: 5px 13px;
      height: 38px;
      cursor: pointer;
      border-radius: 5px 0 0 5px;
      display: flex;
      align-items: center;
      background: white;
      span {
        margin-right: 5px;
        color: $text-color-blue-2;
        font-size: 13px;
      }

      @include min-sm {
        border-radius: 5px;
      }
    }
  }

  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

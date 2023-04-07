<template>
  <RoomsAndPlansCard>
    <RoomsAndPlansCardImage :info="roomItem" is-slider />
    <div ref="card" class="rooms-and-plans__room-card card__info">
      <div class="card__info-top">
        <h2>{{ roomItem.roomTitle }}</h2>
        <div
          class="card__info-top__toggle-amenities"
          @click="$_toggleAmenities"
        >
          {{ getLang.details }}
          <span
            class="icon-Arrow-xSmall-Up"
            :class="{
              'rotate-arrow-up': amenitiesIsOpen,
              'rotate-arrow-down': !amenitiesIsOpen
            }"
          />
        </div>
        <div class="card__info-top__amenities">
          <div
            v-for="roomAmenity in roomAmenities"
            :key="roomAmenity.type"
            class="card__info-top__amenities-card"
          >
            <span :class="roomAmenity.icon" />
            {{ roomAmenity.text }}
          </div>
        </div>
        <dropdown-transition>
          <div v-if="amenitiesIsOpen" class="card__info-top__amenities-sp">
            <div
              v-for="roomAmenity in roomAmenities"
              :key="roomAmenity.type"
              class="card__info-top__amenities-card"
            >
              <span :class="roomAmenity.icon" />
              {{ roomAmenity.text }}
            </div>
          </div>
        </dropdown-transition>
        <SeeMoreRoomsOrPlans
          top-booking
          :main-card-info="roomItem"
          :sub-content-is-open="planIsOpen"
          @togglePlans="$_togglePlans"
        />
      </div>
      <PlansListInRoom
        :room-info="roomItem"
        :plan-is-open="planIsOpen"
        :plans-list-in-room="roomItem.subContent"
        @togglePlan="$_togglePlans"
        @saveRoom="$_saveRoom"
      />
      <button
        v-if="planIsOpen && shouldRenderToggleButton"
        class="button m-btn m-btn__yellow card__info__toggle"
        @click="$_togglePlans"
      >
        {{ getLang.seeLess }}
        <span class="icon-Arrow-Small-Up" />
      </button>
      <button
        v-else-if="!planIsOpen && shouldRenderToggleButton"
        class="button m-btn m-btn__yellow card__info__toggle see-more-btn"
        @click="$_togglePlans"
      >
        {{ getLang.seeMore }}
        <span class="icon-Arrow-Small-Down" />
      </button>
    </div>
  </RoomsAndPlansCard>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState, mapActions } from 'vuex'
export default Vue.extend({
  name: 'RoomCard',
  props: {
    // eslint-disable-next-line
    roomInfo: {
      type: Object
    }
  },
  data() {
    return {
      planIsOpen: false,
      amenitiesIsOpen: false,
      planInRoom: {},
      roomItem: this.roomInfo
    }
  },
  computed: {
    ...mapGetters({
      hotelReviews: 'hotelDetail/hotelReviews',
      isKidsTierSupport: 'hotel/isKidsTierSupport',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      numberOfDaysToCheckIn: 'booking/numberOfDaysToCheckIn',
      numberAdults: 'booking/numberAdults',
      numberChildren: 'booking/numberChildren'
    }),
    ...mapState({
      selectedRoom: state => state.hotelDetail.selectedRoom,
      roomSelect: state => state.booking.bookingData.roomList,
      roomIndex: state => state.hotelDetail.roomIndex,
      roomType: state => state.hotel.data.roomType,
      checkIn: state => state.booking.bookingData?.checkIn,
      checkOut: state => state.booking.bookingData?.checkOut
    }),

    amenitiesIcon() {
      return this.roomAmenities.map((amenitity) => {
        switch (amenitity.type) {
          case 'person':
            return 'Icon-Group'
          case 'roomSize':
            return 'Icon-Hotel'
          case 'bed':
            return 'Icon-Bed'
          case 'bedSize':
            return 'Icon-Bed'
          case 'wifi':
            return 'Icon-Amenity-Wifi'
          case 'TV':
            return 'Icon-Amenity-Flat-TV'
        }
      })
    },

    roomAmenities() {
      const bedTypes = this.roomInfo.beds.map((bed, index) => {
        return {
          type: `bed_${index}`,
          text: `${bed.bed_type} ${
            bed.bed_count ? `: ${bed.bed_count} beds` : ''
          }`,
          icon: 'icon-Icon-Bed',
          value: bed.bed_type
        }
      })
      const listAmenities = [
        {
          type: 'person_min',
          text: this.$t('hoteldetail.person_min', {
            number: this.roomInfo?.min_people
          }),
          icon: 'icon-Icon-Group',
          value: this.roomInfo?.min_people
        },
        {
          type: 'person_max',
          text: this.$t('hoteldetail.person_max', {
            number: this.roomInfo?.max_people
          }),
          icon: 'icon-Icon-Group',
          value: this.roomInfo?.max_people
        },
        ...bedTypes,
        {
          type: 'roomSize',
          text: `${this.$t('hoteldetail.room_is')} ${
            this.roomInfo.room_size?.value
          }m²`,
          icon: 'icon-Icon-Business',
          value: this.roomInfo.room_size?.value
        },
        {
          type: 'smoking',
          text: `${this.$t('hoteldetail.smoking')}`,
          icon: 'icon-Smoking',
          value: this.roomInfo.is_smoking
        },
        {
          type: 'bathroom',
          text: `${this.$t('hoteldetail.bathroom')}`,
          icon: 'icon-Bathroom',
          value: this.roomInfo.bathroom
        },
        {
          type: 'toilet',
          text: `${this.$t('hoteldetail.toilet')}`,
          icon: 'icon-Toilet_2',
          value: this.roomInfo.toilet
        }
      ]

      return listAmenities.filter(item => item.value)
    },

    shouldRenderToggleButton() {
      return this.roomItem.subContent.length > 2
    },

    getLang() {
      return {
        details: this.$t('hoteldetail.details'),
        seeMore: this.$t('hoteldetail.see_more_plan'),
        seeLess: this.$t('hoteldetail.see_less_plan')
      }
    }
  },
  watch: {
    roomInfo(newVal) {
      this.roomItem = newVal
    }
  },
  methods: {
    ...mapActions({
      saveRoomInfo: 'hotelDetail/a_saveRoomInfo'
    }),
    $_togglePlans() {
      this.planIsOpen = !this.planIsOpen
      const hotelID = this.$route.params?.hotelID
      if (this.planIsOpen) {
        this.$gtm.push({
          event: 'viewAllPlansClick',
          language: this.$langFormat(this.lang),
          pageCategory: this.$route.name,
          hotelID,
          roomID: this.roomInfo.roomId,
          planID: '',
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          numberOfAdults: this.numberAdults,
          numberOfChildren: this.numberChildren,
          numberOfDaysToCheckIn: this.numberOfDaysToCheckIn,
          triggerType: 'User Interaction'
        })
      }
    },

    $_toggleAmenities() {
      this.amenitiesIsOpen = !this.amenitiesIsOpen
    },

    $_saveRoom(plan) {
      this.planInRoom = plan && plan.rate ? plan : { ...this.roomItem }
      const selectByRoom = {
        room: this.roomItem,
        plan: this.planInRoom
      }

      if (this.selectedRoom.length < this.roomSelect.length) {
        const roomListSelected = this.roomSelect.map(() => selectByRoom)

        this.saveRoomInfo(roomListSelected)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.rooms-and-plans__room-card.card__info {
  min-height: 140px;

  @include min-sm {
    flex: 1;
  }

  .card__info {
    @include min-sm {
      flex-basis: 800px;
    }

    &-top {
      display: flex;
      flex-direction: column;
      padding: 0 15px;
      position: relative;

      @include min-sm {
        flex-direction: row;
        align-items: flex-start;
        padding: 35px 0 0 220px;
      }

      @include min-md {
        padding: 5px 0;
        padding-bottom: 20px;
      }

      h2 {
        font-size: 14px;
        line-height: 17px;
        color: $text-color-blue;
        font-weight: bold;
        padding-right: 60px;

        @include min-sm {
          font-size: 18px;
          line-height: 24px;
          position: absolute;
          top: 5px;
        }

        @include min-md {
          margin-right: 20px;
          // flex: 0 1 250px;
          width: 250px;
          padding-right: 0;
          position: static;
        }
      }

      &__amenities {
        display: none;

        &-sp {
          @include min-sm {
            display: none;
          }
        }

        @include min-sm {
          flex: 1 1 320px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-right: 40px;
        }

        &-card {
          font-size: 12px;
          flex: 0 1 48%;
          padding: 7px 0;
          border-bottom: 1px solid $border-color-gray-2;
          display: flex;
          align-items: center;
          text-transform: capitalize;
          [class^='icon-'],
          [class*=' icon-'] {
            font-size: 17px;
            margin-right: 12px;
          }

          @include min-sm {
            padding: 9px 0;
          }
        }
      }

      &__toggle-amenities {
        position: absolute;
        margin: 0;
        right: 20px;
        font-size: 11px;
        color: $text-color-blue-2;
        display: block;

        @include min-sm {
          display: none;
        }

        [class^='icon-'],
        [class*=' icon-'] {
          font-size: 8px;
        }

        .rotate-arrow-up {
          transform: rotate(360deg);
          transition: 0.3s;
        }

        .rotate-arrow-down {
          transform: rotate(180deg);
          transition: 0.3s;
        }
      }
    }

    &__toggle {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 27px;
      border-radius: 0;

      @include min-sm {
        display: none;
      }

      [class^='icon-'],
      [class*=' icon-'] {
        font-size: 10px;
        margin-left: 5px;
      }
    }
  }
}
</style>

<template>
  <div class="hotel-detail-rooms-and-plans__room">
    <div v-show="!isRoomLoading">
      <RoomCard
        v-for="roomInfo in currentCards"
        :key="roomInfo.roomId"
        ref="roomCards"
        :room-info="roomInfo"
      />
    </div>
    <RoomCardLoader v-show="isRoomLoading" />
    <RoomsAndPlansLoadMore
      v-show="currentItemsCount < roomLength"
      @loadMore="$_loadMore"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'RoomsList',
  props: {
    info: Array,
    default: () => []
  },
  data() {
    return {
      currentItemsCount: 8,
      roomData: {}
    }
  },
  computed: {
    ...mapState({
      isRoomLoading: state => state.hotelDetail.isRoomLoading
    }),
    ...mapGetters({
      currentTab: 'hotelDetail/currentTab'
    }),

    roomLength() {
      return this.info && this.info.length
    },

    currentCards() {
      return this.info && this.info.slice(0, this.currentItemsCount)
    }
  },
  methods: {
    scrollIntoCard(cardIndex = 0) {
      this.$nextTick(() => {
        const currentFocusedCard = this.$refs.roomCards[cardIndex]
        currentFocusedCard.planIsOpen = true
        currentFocusedCard.$refs.card.scrollIntoView()
      })
    },

    $_loadMore(currentItemsCount) {
      this.currentItemsCount = currentItemsCount
    },

    activated() {
      if (this.currentTab.currentId.toString()) {
        let roomIndex = 0
        this.info.some((room, id) => {
          if (room.roomId.toString() === this.currentTab.currentId.toString()) {
            return (roomIndex = id + 1)
          }
        })
        if (roomIndex > this.currentItemsCount) {
          this.currentItemsCount = roomIndex
        }
        this.scrollIntoCard(roomIndex - 1)
      }
    }
  }
})
</script>

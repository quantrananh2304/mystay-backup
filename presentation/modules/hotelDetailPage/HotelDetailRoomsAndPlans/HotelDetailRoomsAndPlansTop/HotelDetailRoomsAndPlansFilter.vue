<template>
  <div class="hotel-detail-rooms-and-plans__filter">
    <div
      class="hotel-detail-rooms-and-plans__filter-type d-inline-flex"
      :class="'current-filter--' + currentFilter.currentTab"
    >
      <span
        id="filter-by-room"
        @click="$_onChangeFilter(filterTypes.filterByRoom)"
      >
        {{ getLanguage.byRoom }}
      </span>
      <span
        id="filter-by-plan"
        @click="$_onChangeFilter(filterTypes.filterByPlan)"
      >
        {{ getLanguage.byPlan }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const FilterType = {
  filterByRoom: 'room',
  filterByPlan: 'plan'
}

export default {
  name: 'HotelDetailRoomsAndPlansFilter',
  data() {
    return {
      filterTypes: FilterType
    }
  },
  computed: {
    ...mapGetters({
      currentFilter: 'hotelDetail/currentTab',
      lang: 'appHeader/language'
    }),

    getLanguage() {
      return {
        byRoom: this.$t('hoteldetail.by_room'),
        byPlan: this.$t('hoteldetail.by_plan')
      }
    }
  },
  watch: {
    currentFilter(currentFilter) {
      const tab = currentFilter.currentTab
      this.saveCurrentTab(tab === 'room' ? 'rooms' : 'plans')
    }
  },
  methods: {
    ...mapActions({
      changeFilter: 'hotelDetail/changeTab',
      saveCurrentTab: 'booking/saveCurrentTab'
    }),

    $_onChangeFilter(filterType) {
      this.changeFilter({ currentTab: filterType, currentId: '' })
      this.$gtm.push({
        event: 'roomsPlansTab',
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        roomsPlansTab: filterType === 'room' ? 'rooms' : 'plan',
        triggerType: 'User Interaction'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-detail-rooms-and-plans__filter {
  &-type {
    border: 1px solid $border-color-gray-4;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    color: $text-color-blue-2;

    span {
      margin: 0;
      padding: 9px 8px;
      min-width: 80px;
      font-size: 12px;
      text-align: center;
      color: $text-color-blue-2;

      @include min-sm {
        padding: 9px 13px;
        min-width: 90px;
      }
    }

    &.current-filter--room {
      #filter-by-room {
        background: $bg-color-blue-2;
        color: $white;
      }
    }

    &.current-filter--plan {
      #filter-by-plan {
        background: $bg-color-blue-2;
        color: $white;
      }
    }
  }
}
</style>

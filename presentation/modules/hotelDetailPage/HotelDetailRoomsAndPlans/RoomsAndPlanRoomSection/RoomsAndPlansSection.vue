<template>
  <div
    v-if="pageLoaded"
    class="hotel-detail-rooms-and-plans__room-section demo-class"
  >
    <transition name="fade" mode="out-in">
      <keep-alive>
        <component
          :is="currentFilterSection.component"
          :info="currentSectionData"
        />
      </keep-alive>
    </transition>

    <MyStayPopup
      ref="cancelationPolicies"
      :modal-class="`modal-cancelation`"
      :size="'lg'"
      :centered="false"
      :is-close-icon="true"
    >
      <div class="cancelation-policies">
        <h3>{{ $t('hoteldetail.cancellation_policy') }}</h3>
        <div v-if="!isLoading" class="cancelation-policies__content">
          <div
            v-for="(item, index) in cancellationPolicies"
            :key="index"
            class="cancelation-policies__content__item"
            v-html="item"
          />
        </div>
        <div v-else class="loading-item">
          <b-skeleton class="mb-4" animation="fade" width="90%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="65%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="70%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="65%" height="24px" />
          <b-skeleton class="mb-3" animation="fade" width="70%" height="24px" />
        </div>
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import RoomsList from './RoomsCard/RoomsList.vue'
import PlansList from './PlansCard/PlansList.vue'

const FilterType = {
  filterByRoom: 'room',
  filterByPlan: 'plan'
}

const filterSections = {
  room: {
    name: 'RoomsList',
    component: RoomsList
  },
  plan: {
    name: 'PlansList',
    component: PlansList
  }
}

export default Vue.extend({
  name: 'RoomsAndPlansSection',
  data() {
    return {
      filterSection: filterSections,
      pageLoaded: false
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.hotelDetail?.isLoading
    }),
    ...mapGetters({
      currentFilter: 'hotelDetail/currentTab',
      plansInfo: 'hotelDetail/planLeftFilter',
      roomsInfo: 'hotelDetail/roomLeftFilter',
      cancellationPolicies: 'hotelDetail/cancellationPolicies'
    }),
    currentFilterSection() {
      return this.currentFilter.currentTab === FilterType.filterByRoom
        ? this.filterSection.room
        : this.filterSection.plan
    },
    currentSectionData() {
      return this.currentFilter.currentTab === FilterType.filterByRoom
        ? this.roomsInfo
        : this.plansInfo
    }
  },
  mounted() {
    this.pageLoaded = true
    this.$emit('getRoomsLength', this.roomsInfo && this.roomsInfo.length)
    this.$emit('getPlansLength', this.plansInfo && this.plansInfo.length)
    this.$nuxt.$on(
      'on:ShowCancellationPoliciesPopup',
      this.showCancelationPolicies
    )
  },
  beforeDestroy() {
    this.$nuxt.$off(
      'on:ShowCancellationPoliciesPopup',
      this.showCancelationPolicies
    )
  },

  methods: {
    showCancelationPolicies() {
      // eslint-disable-next-line no-unused-expressions
      this.$refs?.cancelationPolicies?.showModal()
    }
  }
})
</script>

<style lang="scss" scoped>
.cancelation-policies {
  padding: 10px 0;
  font-size: 14px;

  @include min-sm {
    padding: 0 10px;
    font-size: 16px;
  }
  h3 {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }

  &__content {
    font-size: 14px;

    &__item {
      margin-bottom: 15px;
    }
  }
}
</style>

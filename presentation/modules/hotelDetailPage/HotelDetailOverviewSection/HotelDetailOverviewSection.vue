<template>
  <div class="hotel-detail-overview">
    <div v-for="(item, index) in overviewData" :key="index">
      <div
        v-if="!item.clickable"
        class="hotel-detail-overview hotel-detail-overview--block"
      >
        <span :class="item.icon" />
        <span>
          {{ isDynamicText ? $t(`hoteldetail.${item.name}`) : item.name }}
        </span>
        <span>{{ item.title }}</span>
      </div>
      <a
        v-if="item.clickable"
        :href="`${item.name === 'call_to_back' ? 'tel' : 'mailto'}:${
          item.title
        }`"
        class="hotel-detail-overview hotel-detail-overview--block"
        @click="onClickItem(item.name)"
      >
        <span :class="item.icon" />
        <span>
          {{ isDynamicText ? $t(`hoteldetail.${item.name}`) : item.name }}
        </span>
        <span>{{ item.title }}</span>
      </a>
    </div>
  </div>
</template>

<script >
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
export default Vue.extend({
  name: 'HotelDetailOverviewSection',
  props: {
    overviewData: {
      type: Array
    },
    isDynamicText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      overviews: this.overviewData
    }
  },
  computed: {
    ...mapState({
      hotelId: state => state.hotel.data.hotelID
    }),
    ...mapGetters({
      lang: 'appHeader/language'
    }),

    formatOverviewData() {
      return this.overviews
    }
  },
  watch: {
    overviewData(newData) {
      this.overviews = newData
    }
  },
  methods: {
    onClickItem(name) {
      this.$gtm.push({
        event: name === 'call_to_back' ? 'clickCall' : 'contactUs',
        hotelId: this.hotelId,
        pageCategory: this.$route.name,
        language: this.$langFormat(this.lang),
        triggerType: 'User Interaction'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail-overview {
  a {
    color: #232e48;

    &:hover {
      color: #1a489c;
    }
  }

  &--block {
    display: flex;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #d1d1d1;
    @include min-sm {
      flex-wrap: wrap;
    }
    @include min-xl {
      flex-wrap: nowrap;
    }
    span:first-child {
      margin-right: 15px;
      margin-top: 2px;
    }
    span:nth-child(2) {
      font-size: 12px;
      font-weight: bold;
      width: 130px;
      flex: 1;
      @include min-sm {
        font-size: 14px;
        flex-basis: 70%;
      }
      @include min-xl {
        flex: 1;
        width: fit-content;
      }
    }
    span:last-child {
      font-size: 12px;
      @include min-sm {
        font-size: 13px;
        margin-left: 30px;
      }
    }
  }
}
</style>

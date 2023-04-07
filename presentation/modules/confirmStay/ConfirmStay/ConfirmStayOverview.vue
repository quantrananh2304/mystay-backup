<template>
  <div class="confirm-stay-overview">
    <div v-for="(item, index) in overviewData" :key="index">
      <div
        v-if="!item.clickable"
        class="confirm-stay-overview confirm-stay-overview--block"
      >
        <span :class="item.icon" />
        <span>
          {{ isDynamicText ? $t(`hoteldetail.${item.name}`) : item.name }}
        </span>
        <span>{{ item.title }}</span>
      </div>
      <a
        v-if="item.clickable"
        :href="`${item.name === 'call_to_inquire' ? 'tel' : 'mailto'}:${
          item.title
        }`"
        class="confirm-stay-overview confirm-stay-overview--block"
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

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ConfirmStayOverview',
  props: {
    overviewData: {
      type: Array,
      required: true
    },
    isDynamicText: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
.confirm-stay-overview {
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
    span:first-child {
      margin-right: 15px;
    }
    span:nth-child(2) {
      font-size: 12px;
      font-weight: bold;
      flex: 1;
      @include min-sm {
        font-size: 12px;
      }
    }
    span:last-child {
      font-size: 12px;
      @include min-sm {
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <div :class="getCustomClass">
    <ul :class="`${getCustomClass}__item`">
      <li
        v-for="value in listCircle"
        :key="value"
        class="item"
        :class="{
          active: active(value),
          'half active': halfActive(value),
        }"
      />
    </ul>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import Vue from 'vue'

export default Vue.extend({
  name: 'RatingCircle',
  components: {},
  props: {
    numberCircle: {
      type: Number,
      default: 3
    },
    customCircle: {
      type: String
    }
  },
  data() {
    return {
      listCircle: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    getCustomClass() {
      return this.customCircle ? 'custom-circle' : 'rating-circle'
    },

    roundStar() {
      return Math.floor(this.numberCircle)
    },

    halfStar() {
      const value = this.numberCircle - this.roundStar

      if (value < 0.25) {
        return 0
      }

      if (value >= 0.25 && value < 0.5) {
        return 0.5
      }

      if (value >= 0.5 && value < 0.75) {
        return 0.5
      }

      if (value >= 0.75) {
        return 1
      }

      return 0
    }
  },

  methods: {
    active(value) {
      return (
        value <= this.numberCircle ||
        (this.halfStar === 1 && value === this.roundStar + 1)
      )
    },

    halfActive(value) {
      return (
        this.halfStar === 0.5 &&
        this.numberCircle < value &&
        value === this.roundStar + 1
      )
    }
  }
})
</script>

<style lang="scss" scoped>
.rating-circle {
  &__item {
    display: flex;
    .item {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 2px;
      border: 1px solid $border-dark-green;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .active {
      &::before {
        content: "";
        width: 8px;
        height: 8px;
        background: $border-dark-green;
        position: absolute;
        border-radius: 50%;
      }
    }

    .half {
      &:after {
        content: "";
        width: 3px;
        height: 8px;
        background: white;
        position: absolute;
        left: 6px;
      }
    }
  }
}

.custom-circle {
  &__item {
    display: flex;
    .item {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      margin-right: 2px;
      border: 1px solid $border-dark-green;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      &::before {
        content: "";
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: $border-dark-green;
      }
    }

    .active {
      &::before {
        width: 0;
        height: 0;
      }
    }
  }
}
</style>

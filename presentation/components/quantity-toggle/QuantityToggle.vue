<template>
  <div class="quantity-toggle">
    <button
      class="quantity-toggle__minus center m-btn__blue"
      :disabled="quantity === 0"
      @click="$_minus"
    >
      <span class="icon-Icon-Minus" />
    </button>
    <input
      class="quantity-toggle__total-count center"
      type="text"
      readonly
      :value="milesCount"
      @input="$_input"
    >
    <button
      class="quantity-toggle__plus m-btn__blue"
      :disabled="quantity * unit >= maxMiles"
      @click="$_plus"
    >
      <span class="icon-Arrow-Plus" />
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  name: 'QuantityToggle',
  props: {
    maxMiles: {
      type: Number,
      default: 2560
    },
    unit: {
      type: Number,
      default: 100
    },
    usageUnit: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      quantity: this.usageUnit
    }
  },
  computed: {
    milesCount() {
      const totalMiles = this.quantity * this.unit
      if (totalMiles > this.maxMiles) {
        return this.maxMiles
      }

      return totalMiles
    }
  },
  watch: {
    milesCount(miles) {
      this.$emit('on:ChangeMiles', miles)
    }
  },
  methods: {
    $_minus() {
      this.quantity -= 1
    },
    $_plus() {
      this.quantity += 1
    }
  }
})
</script>
<style lang="scss" scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-toggle {
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
  align-items: center;
  height: 45px;

  button {
    height: 100%;
    width: 35px;
  }

  &__minus {
    border-radius: 2px 0 0 2px;
  }
  &__total-count {
    width: 80px;
    border: 1px solid #e4e4e7;
    font-size: 16px;
    height: 100%;
    outline: none;
    text-align: center;
  }
  &__plus {
    border-radius: 0 2px 2px 0;
  }

  .icon-Arrow-Plus,
  .icon-Icon-Minus {
    font-size: 10px;
    font-weight: bold;
  }
}
</style>

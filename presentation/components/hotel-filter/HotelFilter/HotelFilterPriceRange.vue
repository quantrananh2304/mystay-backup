<template>
  <section
    v-if="hotelPrice.length && value[0] != value[1]"
    class="hotel-filter-price-range"
  >
    <div class="hotel-filter-price-range__title">
      <h4>
        {{ $t("searchhotel.price_range") }}
      </h4>
    </div>
    <div
      v-if="minPrice <= maxPrice && minPrice <= value[0]"
      class="hotel-filter-price-range__slider"
    >
      <div class="slider">
        <vue-slider
          v-model="value"
          tooltip="none"
          :min="minPrice"
          :max="maxPrice"
          @change="$_onChangeSlider"
        />
        <div class="slider__price">
          {{ value[0] | currency("YEN") }}
        </div>
        <div class="slider__price-current">
          {{ value[1] | currency("YEN") }}
          <!-- <span>per person</span> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable vue/require-default-prop */

import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
const VueSlider = require('vue-slider-component/dist-css/vue-slider-component.umd.min.js')

export default Vue.extend({
  name: 'HotelFilterPriceRange',
  components: {
    VueSlider
  },
  props: {
    filterMobile: {
      type: String
    }
  },
  data() {
    return {
      value: [10, 100]
    }
  },
  computed: {
    ...mapGetters({
      hotelFilter: 'hotel/hotelFilter',
      maxPrice: 'hotel/expensivePrice',
      minPrice: 'hotel/cheapestPrice'
    }),
    ...mapState({
      isPriceLoading: state => state.hotel.isPriceLoading,
      filterModel: state => state.hotel.data.filterModel,
      hotelPrice: state => state.hotel.data.hotel_price,
      priceRange: state => state.hotel.data.filterModel.price
    })
  },
  watch: {
    minPrice(minPrice) {
      if (Number.isInteger(minPrice)) {
        this.value = [minPrice, this.maxPrice]
        this.$emit('on:ChangeSlider', this.value)
      }
    },
    maxPrice(maxPrice) {
      if (Number.isInteger(maxPrice)) {
        this.value = [this.minPrice, maxPrice]
        this.$emit('on:ChangeSlider', this.value)
      }
    },

    priceRange(priceRange) {
      if (priceRange.minPrice && priceRange.maxPrice) {
        this.value = [priceRange.minPrice, priceRange.maxPrice]
      } else {
        this.value = [this.minPrice, this.maxPrice]
      }
    },

    value() {
      this.$emit('on:ChangeSlider', this.value)
    }
  },
  mounted() {
    if (this.filterModel.price && this.filterModel.price.maxPrice) {
      this.value = [
        this.filterModel.price.minPrice,
        this.filterModel.price.maxPrice
      ]
    } else {
      this.value = [this.minPrice, this.maxPrice]
    }
    this.$emit('on:ChangeSlider', this.value)
  },
  methods: {
    $_onChangeSlider() {
      this.$emit('on:ChangeSlider', this.value)
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-filter-price-range {
  padding: 24px 22px 30px 20px;
  border-bottom: 1px solid $border-color-gray-2;
  &__title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    h4 {
      font-size: 16px;
      font-weight: 600;
    }

    p {
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 3px;
      border: 1px solid;
    }
  }

  &__text {
    font-size: 12px;
    margin-bottom: 27px;
    max-width: 204px;
  }
  &__slider {
    position: relative;
    z-index: 0;
  }
  .slider {
    position: relative;
    padding-top: 40px;
    width: 100%;
    &__price {
      position: absolute;
      top: 5px;
      font-size: 14px;
      left: 0;
      color: $text-color-blue;
      font-weight: bold;
    }
    &__price-current {
      position: absolute;
      top: 5px;
      right: 0;
      font-size: 14px;
      font-weight: bold;
      color: $text-color-blue;
      span {
        font-weight: normal;
        font-size: 10px;
        color: #656565;
      }
    }
  }
}
</style>

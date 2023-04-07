<template>
  <div class="search-box-top">
    <div class="search-box-top__title">
      {{ title }}
    </div>
    <div
      class="search-box-top__container"
      :class="{ active: isShowLocation, error: locationError.msg }"
    >
      <span class="icon-Icon-Search" @click="clearSearchText" />
      <input
        ref="input"
        v-model="searchText"
        class="search-city-input booking"
        type="text"
        :placeholder="placeholder"
        @focus="$_onFocus"
        @input="$_onInput($event)"
        @keyup.enter="onEnter"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
      >
      <span
        v-if="searchText"
        class="icon-Icon-Close"
        @click="clearSearchText"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      required: true,
      default: 'Title is null'
    },
    placeholder: {
      type: String,
      required: true,
      default: 'Placeholder is null'
    },
    showArea: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchText: '',
      currentItem: 0
    }
  },
  computed: {
    ...mapState({
      locationError: state => state.booking.bookingError.location,
      isShowLocation: state => state.booking.bookingState.location,
      location: state => state.booking.bookingData.location,
      recentSearchFromStore: state => state.hotel.data.recentSearch
    }),
    ...mapGetters({
      hotelDisplayList: 'hotel/hotelsDisplayList',
      citySearch: 'hotel/citySearch',
      districtList: 'hotel/districtListFilterGetter'
    }),

    isShowArea() {
      return Boolean(this.showArea && (this.citySearch || this.districtList))
    }
  },
  watch: {
    location(newValue) {
      this.searchText = newValue
    },
    searchText(text) {
      if (text) {
        this.getError({ key: 'location', msg: null })
      }
    },

    isShowLocation() {
      this.searchText = this.location
    },

    currentItem(currentItem) {
      this.$nuxt.$emit('on:sendCurrentItem', currentItem)
    }
  },
  mounted() {
    this.searchText = this.location
  },
  methods: {
    ...mapActions({
      getLocation: 'booking/getLocation',
      getError: 'booking/getError',
      saveSearchData: 'booking/saveSearchData'
    }),

    clearSearchText() {
      this.$refs.input.focus()
      this.searchText = ''
      this.getLocation('')
      this.$emit('on:input', { searchText: this.searchText })
      this.saveSearchData({
        location: '',
        searchType: ''
      })
    },

    $_onInput() {
      this.currentItem = 0
      this.$emit('on:input', { searchText: this.searchText })
    },

    $_onFocus() {
      this.$emit('on:focus')
    },

    onEnter() {
      this.$emit('on:enter', { searchText: this.searchText || this.location })
      this.$refs.input.blur()
    },

    onArrowDown() {
      if (this.searchText) {
        this.currentItem += 1

        const length = this.isShowArea
          ? this.hotelDisplayList.slice(0, 5).length
          : this.hotelDisplayList.slice(0, 5).length - 1

        const lengthWithoutRecent = this.isShowArea
          ? this.hotelDisplayList.length
          : this.hotelDisplayList.length - 1

        if (this.recentSearchFromStore.length) {
          if (this.currentItem > length) {
            this.currentItem = 0
          }
        } else if (this.currentItem > lengthWithoutRecent) {
          this.currentItem = 0
        }
      }
    },

    onArrowUp() {
      if (this.searchText) {
        this.currentItem -= 1

        const length = this.isShowArea
          ? this.hotelDisplayList.slice(0, 5).length
          : this.hotelDisplayList.slice(0, 5).length - 1

        const lengthWithoutRecent = this.isShowArea
          ? this.hotelDisplayList.length
          : this.hotelDisplayList.length - 1

        if (this.recentSearchFromStore.length) {
          if (this.currentItem < 0) {
            this.currentItem = length
          }
        } else if (this.currentItem < 0) {
          this.currentItem = lengthWithoutRecent
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box-top {
  position: relative;
  &__title {
    font-size: 13px;
    margin-bottom: 12px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: 0;
    @include min-md {
      padding: 2px 0;
      line-height: 15px;
      color: $bg-color-blue;
      font-weight: normal;
      text-align: center;
      width: 100%;
      text-align: center;
    }
  }
  &__container {
    width: 100%;
    border: 2px solid $border-color-light-gray;
    background-color: $bg-color-white;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    &::before {
      content: "";
      z-index: 1;
      right: 3px;
      bottom: 3px;
      position: absolute;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top: 5px solid #ffd25d;
      border-right: 5px solid #ffd25d;
      -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    .icon-Icon-Close {
      background: #7b7b85;
      border-radius: 20px;
      color: #fff;
      padding: 5px;
      font-size: 7px;
      cursor: pointer;
    }
    @include min-md {
      padding: 5px 15px;
      &::before {
        display: none;
      }
      .icon-Icon-Search {
        display: none;
      }
    }
    input {
      height: 46px;
      border: 2px solid #ddd;
      outline: none;
      border: none;
      padding: 0 30px 0 15px;
      width: 100%;
      font-size: 14px;
      line-height: 17px;
      color: #232e48;
      @include min-sm {
        font-weight: bold;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        font-size: 14px;
        letter-spacing: 0;
        font-weight: 500;
        line-height: 17px;
        color: #232e48;
        @include min-md {
          font-size: 12px;
          letter-spacing: 0;
          font-weight: normal;
          line-height: 15px;
          opacity: 0.75;
          color: $text-color-gray-6;
        }
      }
    }
  }
  .active {
    border: 2px solid $text-color-yellow;
    &::before {
      display: block;
    }
  }
  .error {
    border: 2px solid red;
  }
}
</style>

<template>
  <div
    v-click-outside="hide"
    class="hotel-detail-rooms-and-plans-top__filter-button"
  >
    <div class="filter-button" @click="$_openSortPopUp">
      <span class="icon-Icon-Sort" />
      <span>{{ getLang.sortBy }}</span>
    </div>
    <div v-if="isShowSortPopUp" class="sort-by-popup">
      <ul>
        <li
          v-for="(sortBy, index) in sortByList"
          :key="index"
          :class="{ active: currentSort === sortBy.value }"
          @click="$_selectSortValue(sortBy.value)"
        >
          {{ sortBy.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'HotelDetailSortBy',
  directives: {
    ClickOutside
  },
  props: {
    roomsLength: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      currentSort: '',
      isShowSortPopUp: ''
    }
  },
  computed: {
    ...mapGetters({
      lang: 'appHeader/language'
    }),
    ...mapState({
      sortByValue: state => state.hotelDetail.sortBy
    }),

    sortByList() {
      return [
        { name: this.getLang.recommended, value: 'recommended' },
        { name: this.getLang.lowestToHighest, value: 'price_low_to_high' },
        { name: this.getLang.highestToLowest, value: 'price_high_to_low' }
      ]
    },

    getLang() {
      return {
        sortBy: this.$t('searchhotel.sort_by'),
        lowestToHighest: this.$t('searchhotel.lowest_to_highest'),
        highestToLowest: this.$t('searchhotel.highest_to_lowest'),
        recommended: this.$t('hoteldetail.recommended')
      }
    }
  },
  watch: {
    sortByValue(value) {
      this.currentSort = value
    }
  },
  mounted() {
    this.currentSort = this.sortByValue
  },
  methods: {
    ...mapActions({
      saveSortRoomBy: 'hotelDetail/saveSortRoomBy'
    }),
    $_selectSortValue(value) {
      this.isShowSortPopUp = false
      this.currentSort = value
      this.saveSortRoomBy(value)

      let sortOption = ''
      switch (value) {
        case 'price_low_to_high':
          sortOption = 'Price Lowest to Highest'
          break
        case 'price_high_to_low':
          sortOption = 'Price Highest to Lowest'
          break
        case 'recommended':
          sortOption = 'Recommended'
          break
        default:
          break
      }

      const gtmData = {
        event: 'sortBy',
        language: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        sortOption,
        triggerType: 'User Interaction'
      }

      this.$gtm.push(gtmData)
    },
    $_openSortPopUp() {
      this.isShowSortPopUp = true
    },
    hide() {
      this.isShowSortPopUp = false
    }
  }
}
</script>

<style lang="scss" scoped>
.hotel-detail-rooms-and-plans-top {
  &__filter-button {
    position: relative;
    @include min-sm {
      display: block;
    }
    .filter-button {
      border: 1px solid #cccccc;
      padding: 5px 5px;
      height: 38px;
      cursor: pointer;
      border-radius: 5px 0 0 5px;
      display: flex;
      align-items: center;
      background: white;
      min-width: 85px;
      display: flex;
      justify-content: space-evenly;

      span {
        margin-right: 5px;
        color: $text-color-blue-2;
        font-size: 13px;
      }

      @include min-sm {
        margin-right: 20px;
        padding: 5px 13px;
        border-radius: 5px;
      }
    }
    .sort-by-popup {
      position: absolute;
      top: 55px;
      left: -90%;
      width: 250px;
      background: white;
      box-shadow: -7px 11px 18px -1px rgba(37, 58, 106, 0.5);
      z-index: 10;

      @include min-sm {
        left: -55%;
      }
      ul {
        li {
          padding: 10px 10px 10px 20px;
          border-bottom: 1px solid #cccccc;
          font-size: 13px;
          cursor: pointer;
          &:hover {
            background: #1a489c;
            color: white;
            border-bottom: 1px solid #1a489c;
          }

          @include min-sm {
            font-size: 14px;
          }
        }

        .active {
          background: #1a489c;
          color: white;
          border-bottom: 1px solid #1a489c;
        }
      }

      &::before {
        content: '';
        position: absolute;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        top: -10px;
        left: 45%;
      }
    }
  }

  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

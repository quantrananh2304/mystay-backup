<template>
  <div class="hotel-search-content">
    <div class="container">
      <div class="hotel-search-content__hotel-list">
        <div class="hotel-list">
          <div v-show="!isHotelLoading" class="row">
            <div
              v-for="(hotel, index) in hotelHasPrice"
              :key="hotel.triplaHotelId + index + 1"
              class="col-sm-6 col-md-6 col-lg-4 has-price"
            >
              <HotelSearchResults
                v-if="index < getItemPage(hotelHasPrice)"
                :hotel-detail="hotel"
              />
            </div>
            <div
              v-for="(hotel, index) in hotelNonePrice"
              :key="hotel.triplaHotelId + index"
              class="col-sm-6 col-md-6 col-lg-4 none-price"
            >
              <HotelSearchResults
                v-if="
                  index < getItemPage(hotelNonePrice) &&
                    currentPage >= totalHasPricePage
                "
                :hotel-detail="hotel"
              />
            </div>
          </div>
          <div v-show="isHotelLoading" class="row">
            <div
              v-for="(item, index) in hotelItem"
              :key="index"
              class="col-sm-6 col-md-6 col-lg-4"
            >
              <div class="hotel-item">
                <b-card>
                  <b-skeleton
                    animation="wave"
                    width="100%"
                    height="160px"
                    class="mb-5"
                  />
                  <b-skeleton animation="throb" width="55%" class="mb-3" />
                  <b-skeleton animation="throb" width="55%" class="mb-3" />
                  <b-skeleton animation="throb" width="75%" />
                </b-card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hotel-search-content__filter-section">
        <HotelFilter v-if="viewType === 'List View'" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'HotelSearchContent',
  data() {
    return {
      currentPage: 1,
      itemPerPage: 9
    }
  },
  computed: {
    ...mapState({
      isHotelLoading: state => state.hotel.isHotelLoading,
      isPriceLoading: state => state.hotel.isPriceLoading,
      viewType: state => state.searchHotel.viewType
    }),
    ...mapGetters({
      hotelList: 'hotel/hotelFilter'
    }),

    hotelItem() {
      const hotelItem = []
      let i = 0
      while (i < 9) {
        hotelItem.push(i)
        i++
      }

      return hotelItem
    },

    hotelHasPrice() {
      return this.hotelList.filter(h => h.price)
    },

    hotelNonePrice() {
      return this.hotelList.filter(h => !h.price)
    },

    totalHasPricePage() {
      return Math.ceil(this.hotelHasPrice.length / this.itemPerPage)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.$_onScroll)
  },
  methods: {
    getItemPage(hotelList) {
      let itemInPage = this.currentPage * this.itemPerPage
      if (itemInPage > hotelList.length) {
        itemInPage = hotelList.length
      }
      return itemInPage
    },

    $_onLoadMore() {
      this.currentPage += 1
      const totalPage = Math.ceil(this.hotelList.length / this.itemPerPage)
      if (this.currentPage > totalPage) {
        this.currentPage = totalPage
      }
    },

    $_onScroll() {
      const pageHeight = document.getElementById('__nuxt').clientHeight
      const bottomPadding = 300

      if (
        window.innerHeight + window.pageYOffset >
        pageHeight - bottomPadding
      ) {
        this.$_onLoadMore()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-search-content {
  background: #f3f3f3;

  @include min-sm {
    padding-bottom: 50px;
  }

  .container {
    display: flex;
    justify-content: space-between;
  }

  &__hotel-list {
    width: 100%;
    @include min-sm {
      width: 60%;
    }
    @include min-lg {
      width: 74.6%;
    }
    .row {
      margin: 0 -10px;

      [class*='col-'] {
        padding-left: 10px;
        padding-right: 10px;
      }
    }

    .load-more {
      margin-top: 10px;
      button {
        width: 100%;
        padding: 15px 0;
        font-weight: bold;
        border: 1px solid $border-color-gray-2;
        background: #f3f3f3;
        outline: none;
        color: $text-color-blue;
        font-size: 14px;
      }
    }
  }

  &__filter-section {
    display: none;
    @include min-sm {
      display: block;
      width: 35%;
    }

    @include min-lg {
      display: block;
      width: 23.8%;
    }
  }
}

.hotel-item {
  min-height: 350px;
  width: 100%;
  margin-bottom: 30px;
  background: white;

  .card {
    border: none;
  }

  &__img {
    height: 167px;
    box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
    @include background-shimmer($base-color: white, $shimmer-color: #f3f3f3);
  }

  &__name {
    box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
    padding: 10px;
    @include background-shimmer($base-color: white, $shimmer-color: #f3f3f3);
  }
}
</style>

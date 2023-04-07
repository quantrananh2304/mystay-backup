<template>
  <div class="back-page" @click="backPage">
    <span class="icon-Icon-Arrow" />
    <span>{{ getLang.backTo }} {{ backText }}</span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'BackToSearchResults',
  data() {
    return {
      backLink: ''
    }
  },
  computed: {
    ...mapState({
      fullPath: state => state.hotel.data.fullPath,
      fullPathHotelDetail: state => state.hotel.data.fullPathHotelDetail,
      hotelID: state => state.hotel.data.hotelID,
      bookingData: state => state.booking.bookingData
    }),

    ...mapGetters({
      hotelDetailRouteParams: 'booking/hotelDetailRouteParams',
      fullLang: 'appHeader/fullLanguage',
      totalNight: 'booking/totalNight'
    }),

    backText() {
      let backText = ''
      switch (this.$route.path) {
        case this.$pageRoute.hotelReview: {
          backText = this.getLang.hotelDetail
          break
        }
        case this.$pageRoute.guestDetail: {
          this.backLink = this.$pageRoute.hotelReview
          backText = this.getLang.review
          break
        }
        case this.$pageRoute.payment: {
          this.backLink = this.$pageRoute.guestDetail
          backText = this.getLang.guestDetail
          break
        }
        default:
          break
      }

      if (this.$route.path.includes(`${this.$pageRoute.hotelDetail}/`)) {
        if (this.fullPath) {
          backText = this.getLang.searchResult
        } else {
          backText = this.getLang.homePage
        }
      }

      return backText
    },

    getLang() {
      return {
        backTo: this.$t('summary.back_to_search_results'),
        homePage: this.$t('summary.home_page'),
        searchResult: this.$t('summary.search_result'),
        hotelDetail: this.$t('summary.hotel_detail'),
        review: this.$t('summary.review'),
        guestDetail: this.$t('summary.guest_detail')
      }
    }
  },
  methods: {
    backPage() {
      this.$nuxt.$emit('on:ChangePage')
      if (
        this.$router.history.current.path.includes(
          `${this.$pageRoute.hotelDetail}/`
        )
      ) {
        if (this.fullPath) {
          this.$router.push({
            path: this.$pageRoute.hotelsList,
            query: this.$hotelSearchQuery(this.bookingData, this.fullLang)
          })
        } else {
          this.$router.push('/').catch(() => {})
        }
      } else {
        this.$router.push(this.backLink).catch(() => {})
      }

      if (this.$route.path === this.$pageRoute.hotelReview) {
        if (this.fullPathHotelDetail) {
          let path = this.fullPathHotelDetail
          if (this.fullPathHotelDetail.includes('&from=mystays')) {
            path = this.fullPathHotelDetail.replace('&from=mystays', '')
          }
          this.$router.push(path)
        } else {
          this.$router
            .push({
              path: `${this.$pageRoute.hotelDetail}/${this.hotelID}`,
              query: this.$paramsHotelDetailFromWidget(
                { ...this.bookingData, nights: this.totalNight },
                this.fullLang
              )
            })
            .catch(() => {})
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.back-page {
  width: 100%;
  background: $bg-color-blue-2;
  padding: 8px 15px;
  color: white;
  display: flex;
  align-items: center;
  // margin-top: 3px;
  cursor: pointer;
  margin-bottom: 10px;
  @include min-sm {
    padding: 12px;
    margin-top: 0;
    margin-bottom: 10px;
  }
  span {
    &:first-child {
      font-size: 15px;
      margin-right: 10px;
      cursor: pointer;
      font-weight: bold;
    }
    &:last-child {
      font-size: 11px;
      @include min-sm {
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <div v-if="pageLoaded" class="show-full-map">
    <VueGoogleMap
      v-if="!isBaiduMap"
      class="show-full-map__map"
      :markers="[hotelPosition]"
      :init-map-markers="[hotelPosition]"
      :hotel-id="hotelId"
    />

    <BaiduMaps
      v-if="isBaiduMap"
      class="show-full-map__map"
      :markers="[hotelPosition]"
      :init-map-markers="[hotelPosition]"
      :hotel-id="hotelId"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ShowFullMap',
  data() {
    return {
      hotelPosition: {
        latitude: 0,
        longitude: 0
      },
      pageLoaded: false,
      hotelId: 0
    }
  },
  computed: {
    ...mapGetters({
      hotelDetail: 'hotelDetail/hotelDetail',
      hotelList: 'hotel/allMarkers',
      fullLang: 'appHeader/fullLanguage',
      lang: 'appHeader/language',
      users: 'users/userData'
    }),

    isBaiduMap() {
      return this.fullLang === 'zh-CN'
    }
  },
  mounted() {
    this.pageLoaded = true
    this.hotelId = this.$route.params.hotelId
    this.hotelPosition = {
      latitude: this.hotelDetail.latitude,
      longitude: this.hotelDetail.longitude
    }
    this.gtmData()
  },
  methods: {
    gtmData() {
      this.$gtm.push({
        ...(this.isPageLoaded && { event: 'virtualPageview' }),
        triggerType: 'Page Load',
        locale: this.$langFormat(this.lang),
        pageCategory: this.$route.name,
        userId: this.isLogin ? this.users.id : '',
        loginStatus: this.isLogin
      })
    }
  }
}
</script>

<style scoped lang="scss">
.show-full-map {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100000;
  width: 100%;
  height: 100vh;
  background: white;
  &__map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>

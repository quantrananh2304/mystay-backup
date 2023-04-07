<template>
  <div class="not-found-page">
    <AppHeader />
    <div class="container">
      <NotFound />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import getGtmData from '../plugins/gtm'
export default Vue.extend({
  name: 'NotFoundComponent',
  computed: {
    ...mapGetters({
      lang: 'appHeader/language',
      users: 'users/userData'
    })
  },
  mounted() {
    getGtmData({
      triggerType: 'Page Load',
      locale: this.$langFormat(this.lang),
      pageCategory: 'NotFoundPage'
    })
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
})
</script>

<style lang="scss" scoped>
.not-found-page {
  flex: 1;
  text-align: center;
  position: relative;
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -15%);

    @include min-sm {
      transform: translate(-50%, -38%);
    }
  }
}
</style>

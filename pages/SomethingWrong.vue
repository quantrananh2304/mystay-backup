<template>
  <div class="something-wrong">
    <AppHeader />
    <div class="container">
      <p>Something wrong with get token or client session</p>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import getGtmData from '../plugins/gtm'
export default Vue.extend({
  name: 'SomethingWrong',
  middleware: 'routeToHomePage',
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
      pageCategory: 'SomethingWrong'
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
.something-wrong {
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

    p {
      font-size: 18px;
      color: red;
    }
  }
}
</style>

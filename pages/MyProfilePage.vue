<template>
  <section class="my-profile-page">
    <!-- <Aside /> -->
    <AppHeader />
    <div class="container">
      <LazyProfile />
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { pageTitle } from '../shared/constants/pageTitle'

export default Vue.extend({
  name: 'MyProfile',
  middleware: 'authenticate',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      userData: state => state.users.data.userData
    }),
    ...mapGetters({
      lang: 'appHeader/language'
    })
  },

  watch: {
    isLogin(isLogin) {
      if (!isLogin) {
        this.$router.push('/')
      }
    }
  },

  mounted() {
    this.gtmData()

    this.$triplaRepo.users.getUserCard(89)
  },
  methods: {
    gtmData(userData) {
      if (userData) {
        this.$gtm.push({
          ...(this.isPageLoaded && { event: 'virtualPageview' }),
          triggerType: 'Page Load',
          locale: this.$langFormat(this.lang),
          pageCategory: 'MyProfilePage',
          userId: userData.id,
          loginStatus: true
        })
      }
    }
  },
  head() {
    return {
      title: pageTitle.myProfilePage,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mystays Hotel'
        }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.my-profile-page {
  min-height: 100vh;
  .container {
    padding: 1px 0 40px 0;

    @include min-sm {
      padding: 40px 0;
    }
  }
}
</style>

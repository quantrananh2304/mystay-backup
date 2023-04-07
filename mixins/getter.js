import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isMobile: 'general/isMobile',
      loggedIn: 'users/isLogin',
      isLogin: 'users/isLogin',
      isPageLoaded: 'general/isPageLoaded'
    })
  }
}

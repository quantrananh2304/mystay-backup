<template>
  <section id="cancel-reservation-page" class="cancel-reservation-page">
    <AppHeader />
    <div class="container">
      <AppCancelReservation />
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CancelReservation',
  computed: {
    ...mapGetters({
      lang: 'appHeader/language',
      users: 'users/userData'
    })
  },
  mounted() {
    this.gtmData()
  },
  methods: {
    ...mapActions({
      showCancelReservation: 'appAuthen/showCancelReservation'
    }),
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
  },
  head() {
    return {
      title: this.$t('general.cancellation_page_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mystays Hotel'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.cancel-reservation-page {
  background: $white;
  text-align: center;
  flex: 1;

  .container {
    background: white;
    padding-top: 25px;
    padding-bottom: 20px;
    text-align: center;
    flex: 1;

    @include min-sm {
      padding-top: 75px;
      padding-bottom: 220px;
    }
  }
}
</style>

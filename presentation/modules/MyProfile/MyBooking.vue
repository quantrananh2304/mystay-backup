<template>
  <section class="my-booking container">
    <div class="my-booking__title">
      <h3 class="font-weight-bold">
        {{ $t('headers.my_reservations') }}
      </h3>
    </div>
    <div v-if="!isGetReservationsListLoading" class="my-booking__content mt-4">
      <MyBookingItem
        v-for="item in reservationsList"
        :key="item.id"
        :booking-item="item"
      />
    </div>

    <div v-if="isGetReservationsListLoading && isMobile">
      <div v-for="item in 5" :key="item" class="py-3">
        <b-skeleton-img card-img="top" aspect="3:1" />
        <div class="mt-2">
          <b-skeleton animation="throb" width="55%" />
          <b-skeleton animation="throb" width="35%" />
          <b-skeleton animation="throb" width="75%" height="25px" />
        </div>
      </div>
    </div>

    <div v-if="isGetReservationsListLoading && !isMobile">
      <div v-for="item in 5" :key="item" class="py-3 d-flex">
        <div class="mr-3">
          <b-skeleton-img card-img="top" width="200px" />
        </div>
        <div class="mt-2 w-75">
          <b-skeleton class="mb-2" animation="throb" width="55%" />
          <b-skeleton class="mb-3" animation="throb" width="35%" />
          <b-skeleton class="mb-2" animation="throb" width="90%" height="25px" />
        </div>
      </div>
    </div>

    <div
      v-if="!reservationsList.length && !isGetReservationsListLoading"
      class="my-booking__no-data"
    >
      {{ $t('my_profile.no_data_found') }}
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'MyBooking',
  computed: {
    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      reservationsList: 'users/reservationsList',
      lang: 'appHeader/language',
      users: 'users/userData',
      isGetReservationsListLoading: 'users/isGetReservationsListLoading'
    })
  },

  mounted() {
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
})
</script>

<style lang="scss" scoped>
.my-booking {
  padding: 15px;
  color: #232e48;

  @include min-sm {
    padding: 30px;
    max-height: 80vh;
    overflow: auto;
    @include scrollbar();
  }

  &__loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .loader {
      border: 6px solid #f3f3f3; /* Light grey */
      border-top: 6px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <section class="rewards container">
    <div class="rewards__title mb-4">
      <h3 class="font-weight-bold">
        {{ $t("headers.my_reward") }}
      </h3>
    </div>
    <div class="rewards__content">
      <div v-for="item in rewards" :key="item.id">
        <RewardsItem class="mb-3" :rewards-item="item" />
      </div>
    </div>
    <div v-if="!rewards.length" class="rewards__no-data">
      {{ $t("my_profile.no_data_found") }}
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'Rewards',
  computed: {
    ...mapGetters({
      lang: 'appHeader/language',
      rewards: 'users/myRewards',
      users: 'users/userData'
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
.rewards {
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

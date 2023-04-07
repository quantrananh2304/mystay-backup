<template>
  <div class="member-confirmation">
    <HotelNavigationBar />
    <div class="container">
      <div v-if="confirmedData" class="member-confirmation__confirmed">
        <div class="member-confirmation__confirmed__content">
          <div class="title mb-4">
            <h4>{{ $t("login_signup.email_authentication") }}</h4>
          </div>
          <div class="success mb-2">
            <BIconCheck scale="2" class="mr-3" />
            <span>{{ $t("login_signup.successfully_registered") }}</span>
          </div>
        </div>
      </div>
      <div v-if="errorData" class="member-confirmation__error">
        <span class="error mb-4">{{ errorMessage }}</span>
      </div>

      <div class="member-confirmation__login mt-4">
        <button
          v-if="!errorData"
          class="m-btn m-btn__yellow"
          @click="goToLogin"
        >
          {{ $t("login_signup.login") }}
        </button>
        <button v-else class="m-btn m-btn__yellow" @click="goToHomePage">
          {{ $t("login_signup.go_to_home_page") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { BIconCheck } from 'bootstrap-vue'

export default Vue.extend({
  name: 'MemberConfirmation',
  components: {
    BIconCheck
  },
  data() {
    return {
      confirmedData: null,
      errorData: null
    }
  },

  watch: {
    '$i18n.locale'() {
      setTimeout(() => {
        this.getMemberConfimation()
      })
    }
  },

  mounted() {
    this.getMemberConfimation()
  },

  computed: {
    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      hotelDetail: 'hotelDetail/hotelDetail'
    }),
    errorMessage() {
      return this.errorData?.message?.[0]?.title || ''
    }
  },

  methods: {
    ...mapActions({
      getHotelDetail: 'hotelDetail/getHotelDetail',
      toggleLogin: 'appAuthen/toggleLogin'
    }),

    getMemberConfimation() {
      const { confirmation_token, program_id, hotel_id, code } =
        this.$route.query

      this.$triplaRepo.users
        .getMemberConfimation({
          confirmation_token,
          program_id,
          hotel_id
        })
        .then((res) => {
          this.confirmedData = res.data
        })
        .catch((err) => {
          this.errorData = err
        })
    },

    goToLogin() {
      this.$router.push('/').then(() => {
        this.toggleLogin({ isLoginOpen: true })
      })
    },

    goToHomePage() {
      this.$router.push('/')
    }
  }
})
</script>

<style lang="scss" scoped>
.member-confirmation {
  flex: 1;
  text-align: center;
  position: relative;
  .container {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -15%);

    @include min-sm {
      transform: translate(-50%, -38%);
    }
  }

  button {
    padding: 8px 15px;
  }

  .m-btn {
    cursor: pointer;
    border: none;
    padding: 15px 40px;
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: bold;
  }

  .success {
    color: seagreen;
  }

  &__confirmed {
    margin-top: 30px;

    @include min-sm {
      margin-top: 0;
    }
  }
}
</style>

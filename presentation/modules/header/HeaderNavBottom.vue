<template>
  <div class="navbar-nav w-100 align-items-center navbar-nav__main">
    <NuxtLink to="/" aria-label="mystays-logo">
      <img :src="require('@/assets/images/Logo.svg')" alt="" />
    </NuxtLink>
    <div v-show="isMobile" class="w-100">
      <div class="nav-list-item w-100" :class="{ 'user-login': userInfo }">
        <div
          v-if="!userInfo && !hideSignInUp"
          class="nav-item"
          @click="handelLogin"
        >
          <i class="icon-Icon-Profile" />
          <span>{{ getTextString.login }}</span>
        </div>
        <AppDropdownBox
          v-if="userInfo && !hideSignInUp"
          :is-show-backdrop="true"
          is-header-dropdown="true"
          :is-open="isShowUserMenu"
          @toggleBox="$_toggleSideBox"
        >
          <template v-slot:dropdown__button>
            <div v-if="!userInfo" class="nav-item" @click="handelLogin">
              <i class="icon-Icon-Profile" />
              <span>{{ getTextString.login }}</span>
            </div>
            <div v-else class="nav-item">
              <i class="icon-Icon-Profile" />
              <span class="text-capitalize">
                {{
                  $t('login_signup.hi_user', {
                    username:
                      userInfo && lang === 'en'
                        ? userInfo.first_name
                        : userInfo.last_name
                  })
                }}
              </span>
              <span class="icon-Arrow-Small-Down" />
            </div>
          </template>
          <template v-slot:dropdown__box>
            <div
              v-for="(option, optionIdx) in userMenu"
              :key="optionIdx"
              class="user-menu-item"
              @click="handelClickMenu(option)"
            >
              {{ option.name }}
            </div>
          </template>
        </AppDropdownBox>

        <div
          class="nav-item"
          :class="{ 'call-us': isLogin }"
          @click="onClickPhoneNumber"
        >
          <a :href="'tel:+81-3-3434-3939'" @click="onClickPhoneNumber">
            <i class="icon-Icon-Phone" />
            <span>{{ getTextString.call_us }}</span>
          </a>
        </div>
        <div class="nav-item" @click="openNavMoblie">
          <i class="icon-Icon-Menu" />
          <span>{{ getTextString.menu }}</span>
        </div>
      </div>
    </div>
    <div v-show="!isMobile" class="nav-desktop">
      <div class="nav-desktop__list-item">
        <div
          class="nav-item d-flex align-items-center"
          @click="$_openHeaderSearchBox"
        >
          <i class="icon-Icon-Search" />
          <span>{{ getTextString.find_a_hotel }}</span>
        </div>
        <div v-show="isLogin" class="nav-item" @click="onRouteMyReservations">
          <span>{{ getTextString.my_reservations }}</span>
        </div>
      </div>
      <div class="nav-desktop__user-info">
        <div v-if="!hideSignInUp">
          <div v-if="!isLogin && $nuxt.isOnline" class="nav-item">
            <i class="icon-Icon-Profile" />
            <span @click="handelLogin">
              {{ getTextString.login }} {{ getTextString.or }}
            </span>
            <b @click="handelSignUp">{{ getTextString.join_mystays_elite }}</b>
          </div>
          <div v-if="isLogin && $nuxt.isOnline" class="nav-item">
            <app-dropdown-box
              :is-show-backdrop="!false"
              is-header-dropdown="true"
              :is-open="isShowUserMenu"
              @toggleBox="$_toggleSideBox"
            >
              <template v-slot:dropdown__button>
                <div>
                  <i class="icon-Icon-Profile" />
                  <span
                    class="mr-3 text-capitalize"
                    @click="isShowUserMenu = !isShowUserMenu"
                  >
                    {{
                      $t('login_signup.hi_user', {
                        username:
                          userInfo && lang === 'en'
                            ? userInfo.first_name
                            : userInfo.last_name
                      })
                    }}
                  </span>
                  <!-- <b class="text-lowercase">
                    {{ getMemberRankWithLanaguague }}
                    {{
                      points &&
                      (points.total_point * points.usage_unit) | currency
                    }}
                    {{ getTextString.miles }}
                  </b> -->
                  <span class="icon-Arrow-Small-Down" />
                </div>
              </template>
              <template v-slot:dropdown__box>
                <div
                  v-for="(option, optionIdx) in userMenu"
                  :key="optionIdx"
                  class="user-menu-item"
                  @click="handelClickMenu(option)"
                >
                  {{ option.name }}
                </div>
              </template>
            </app-dropdown-box>
          </div>
        </div>
        <div class="nav-item">
          <a
            :href="
              isConfirmBookingPage
                ? `tel:${phoneNumber}`
                : 'tel:+81-3-3434-3939'
            "
            @click="onClickPhoneNumber"
          >
            <i class="icon-Icon-Phone mr-2" />
            <span v-if="isConfirmBookingPage">{{ phoneNumber }}</span>
            <span v-else>{{
              lang === 'ja' ? '03-3434-3939' : '+81-3-3434-3939'
            }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

import AppDropdownBox from '../../components/app-dropdown-box/AppDropdownBox.vue'
export default Vue.extend({
  name: 'HeaderNavBottom',
  components: {
    AppDropdownBox
  },
  data() {
    return {
      isShowUserMenu: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.users.data.userData
    }),
    ...mapGetters({
      points: 'users/points',
      memberRank: 'users/memberRank',
      lang: 'appHeader/language',
      phoneNumber: 'hotelDetail/phoneNumber',
      hideSignInUp: 'users/hideSignInUp'
    }),

    getMemberRankWithLanaguague() {
      const translateItem = this.memberRank?.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem?.name
    },

    userMenu() {
      return [
        {
          name: `${this.getTextString.my_profile}`,
          index: 0,
          route: '/profile/my-profile'
        },
        {
          name: this.$t('headers.my_reservations'),
          index: 1,
          route: '/profile/my-booking'
        },
        { name: `${this.getTextString.logout}`, index: 2, route: '' }
      ]
    },
    getTextString() {
      return {
        my_reservations: this.$t('headers.my_reservations'),
        find_a_hotel: this.$t('headers.search_text'),
        login: this.$t('headers.login'),
        join_mystays_elite: this.$t('headers.join_mystays_elite'),
        or: this.$t('headers.or'),
        my_profile: this.$t('headers.my_profile'),
        logout: this.$t('headers.logout'),
        call_us: this.$t('confirmbooking.call_us'),
        login_mobile: this.$t('headers.login_mobile'),
        menu: this.$t('headers.menu_mobile'),
        miles: this.$t('hoteldetail.miles')
      }
    },

    isConfirmBookingPage() {
      return this.$route.path.includes('/confirm-booking/')
    }
  },
  methods: {
    ...mapActions({
      logoutUser: 'users/logoutUser',
      toggleLogin: 'appAuthen/toggleLogin',
      toggleSignup: 'appAuthen/toggleSignup'
    }),
    openNavMoblie() {
      this.$emit('onClickMenuItem', true)
    },
    handelLogin() {
      this.toggleLogin({ isLoginOpen: true })
    },
    handelSignUp() {
      this.toggleSignup({ isSignupOpen: true })
    },
    $_toggleSideBox(isShowUserMenu) {
      if (this.isShowUserMenu) {
        this.isShowUserMenu = false
        this.$scrollBody.enable()
      }
      this.isShowUserMenu = isShowUserMenu
    },
    $_openHeaderSearchBox() {
      this.$emit('onClickFindHotel')
    },

    onRouteMyReservations() {
      this.$router.push('/profile/my-booking')
    },

    handelClickMenu(option) {
      if (option.route) {
        this.$router.push(option.route)
      } else {
        this.logoutUser()
      }

      this.$_toggleSideBox(false)
    },

    onClickPhoneNumber() {
      this.$gtm.push({
        event: 'clickCall',
        hotelId:
          this.$route.path === this.$pageRoute.comfirmBooking
            ? this.$route.query?.hotel_id
            : '297',
        pageCategory: this.$route.name,
        language: this.$langFormat(this.lang),
        triggerType: 'User Interaction'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.navbar-nav__main {
  flex-direction: column;
  position: relative;
  @include min-md {
    flex-direction: row;
  }
  .nav-list-item {
    display: flex;
    width: 100%;
    margin-top: 38px;
    justify-content: space-between;
    align-items: center;
    .nav-item {
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      span {
        font-size: 14px;
        text-transform: uppercase;
        margin-left: 10px;
      }
    }

    .call-us {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      margin-right: 10px;
    }
  }
  .nav-desktop {
    display: flex;
    width: 100%;
    margin-left: 68px;
    justify-content: space-between;
    align-items: center;

    @include min-sm {
      padding-top: 25px;
    }

    @include min-lg {
      padding-top: 0;
    }

    &__list-item {
      display: inherit;
    }
    &__user-info {
      display: inherit;

      span.icon-Arrow-Small-Down {
        font-size: 10px;
        margin-left: 5px;
      }
    }
    .nav-item {
      cursor: pointer;
      // text-transform: capitalize;
      i {
        margin-right: 10px;
        margin-top: 2px;
      }
      b {
        color: #ffd25d;
        font-weight: normal;
      }
    }
    .nav-item:not(:first-child) {
      margin-left: 30px;
    }
  }
}

.user-menu-item {
  padding: 15px;
  width: 200px;
  &:hover {
    background: rgba(255, 210, 93, 0.2);
  }
}
.user-menu-item:not(:last-child) {
  border-bottom: 1.5px solid #dddddd;
}

.user-login {
  .nav-item {
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    span {
      font-size: 11px;
      text-transform: uppercase;
      margin-left: 10px;
    }

    span.icon-Arrow-Small-Down {
      font-size: 10px;
      margin-top: 3px;
    }
  }
  .nav-item:not(:first-child) {
    width: 10%;
    span {
      display: none;
    }
  }
  .nav-item:first-child {
    width: 100%;
    justify-content: start;
    span {
      text-transform: capitalize;
    }
    b {
      color: #ffd25d;
      font-weight: normal;
      font-size: 12px;
      margin-left: 5px;
    }
  }
}

a {
  &:hover {
    text-decoration: none;
    color: white;
    opacity: 0.8;
  }
}
</style>

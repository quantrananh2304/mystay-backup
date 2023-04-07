<template>
  <div
    class="hotel-navigation-bar-info"
    :class="{ 'offline-page': !$nuxt.isOnline }"
  >
    <div
      v-show="isLogin && !hideSignInUp"
      class="hotel-navigation-bar-info__account nav-item"
      :class="{ mr: newClass }"
    >
      <AppDropdownBox
        :is-show-backdrop="!false"
        is-header-dropdown="true"
        :is-open="isShowUserMenu"
        @toggleBox="$_toggleSideBox"
      >
        <template v-slot:dropdown__button>
          <div class="account" @click="isShowUserMenu = !isShowUserMenu">
            <i class="icon-Icon-Profile" />
            <span class="mr-2 text-capitalize">
              {{
                $t('login_signup.hi_user', {
                  username: userInfo && userInfo.first_name,
                })
              }}
            </span>
            <!-- <b class="text-lowercase">
              {{ getMemberRankWithLanaguague }}
              {{
                points && (points.total_point * points.usage_unit) | currency
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
      </AppDropdownBox>
    </div>
    <div
      v-show="$nuxt.isOnline && !isLogin && !hideSignInUp"
      class="hotel-navigation-bar-info__account"
    >
      <span class="icon-Icon-Profile" />
      <div class="hotel-navigation-bar-info__account__login">
        <span class="m-0" @click="$_toggleLogin(true)">
          {{ getTextString.login }}
        </span>
        <span>{{ getTextString.or }}</span>
        <span class="m-0" @click="(e) => $_toggleSignup(true, e)">
          {{ getTextString.join_mobile }}
        </span>
      </div>
    </div>
    <div class="hotel-navigation-bar-info__menu">
      <a
        :href="`tel:${phoneNumber}`"
        aria-label="phone-number"
        class="phone-icon"
        @click="onClickPhone"
      >
        <span class="icon-Icon-Phone" />
      </a>
      <span class="icon-Icon-Menu" @click="$_toggleMenu(true)" />
      <ToggleableSideBox :is-open="isNavOpen" @toggleBox="$_toggleMenu">
        <template v-slot:box-content>
          <HeaderNavMobile @onClose="$_toggleMenu(false)" />
        </template>
      </ToggleableSideBox>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'HotelNavigationBarInfo',
  props: {
    newClass: {
      type: String
    }
  },
  data() {
    return {
      isNavOpen: false,
      authen: false,
      isShowUserMenu: false,
      isShowLoginText: true
    }
  },
  watch: {
    isLogin(isLogin) {
      this.isShowLoginText = isLogin
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.users.data.userData,
      hotelId: state => state.hotel.data.hotelID
    }),
    ...mapGetters({
      hotelFilterByMapView: 'hotel/hotelFilterByMapView',
      points: 'users/points',
      memberRank: 'users/memberRank',
      lang: 'appHeader/language',
      hotelDetailV2: 'hotelDetail/hotelDetailV2',
      hideSignInUp: 'users/hideSignInUp'
    }),

    phoneNumber() {
      const path = this.$route.path
      if (
        path.includes(`${this.$pageRoute.hotelDetail}/`) ||
        path === this.$pageRoute.hotelReview ||
        path === this.$pageRoute.guestDetail ||
        path === this.$pageRoute.payment ||
        path === this.$pageRoute.comfirmBooking
      ) {
        return this.hotelDetailV2.phone
      }

      return '+81-3-3434-3939'
    },

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

    getLanguage() {
      return {
        miles: this.$t('confirmbooking.miles')
      }
    },
    getTextString() {
      return {
        find_a_hotel: this.$t('headers.search_text'),
        login: this.$t('headers.login'),
        join_mobile: this.$t('headers.join_mobile'),
        join_mystays_elite: this.$t('headers.join_mystays_elite'),
        or: this.$t('headers.or'),
        my_profile: this.$t('headers.my_profile'),
        logout: this.$t('headers.logout'),
        miles: this.$t('hoteldetail.miles')
      }
    },

    userData() {
      return this.users && this.users.userData
    }
  },
  destroyed() {
    // // this.$scrollBody.enable();
  },
  methods: {
    ...mapActions({
      toggleLogin: 'appAuthen/toggleLogin',
      toggleSignup: 'appAuthen/toggleSignup',
      toggleHeaderSearch: 'header/showHeaderSearch',
      logoutUser: 'users/logoutUser'
    }),
    $_toggleMenu(isOpen) {
      this.isNavOpen = isOpen
      this.scrollBody(isOpen)
    },
    $_toggleLogin(isLoginOpen) {
      this.toggleLogin({ isLoginOpen })
      this.scrollBody(isLoginOpen)
    },
    $_toggleSignup(isSignupOpen, e) {
      e.stopPropagation()
      this.toggleSignup({ isSignupOpen })
      this.scrollBody(isSignupOpen)
    },
    showFindHotel() {
      this.toggleHeaderSearch(true)
      this.$_toggleSideBox(false)
    },
    $_toggleSideBox(isShowUserMenu) {
      if (!this.isMobile) {
        if (this.isShowUserMenu) {
          this.isShowUserMenu = false
          // this.$scrollBody.enable();
        }
      }

      this.isShowUserMenu = isShowUserMenu
    },
    handelClickMenu(option) {
      if (option.route) {
        this.$router.push(option.route)
      } else {
        this.logoutUser()
      }

      this.$_toggleSideBox(false)
    },

    onClickPhone() {
      this.$gtm.push({
        event: 'clickCall',
        hotelId: this.hotelId ? this.hotelId : '297',
        pageCategory: this.$route.name,
        language: this.$langFormat(this.lang),
        triggerType: 'User Interaction'
      })
    },

    scrollBody(isOpen) {
      if (isOpen) {
        this.$scrollBody.disable()
      } else {
        this.$scrollBody.disable()
      }

      const path = this.$route.path
      const body = document.body
      if (
        path === this.$pageRoute.hotelsList &&
        !this.isMobile &&
        this.hotelFilterByMapView.length <= 3
      ) {
        body.style.paddingRight = 0
      } else {
        body.style.paddingRight = ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-navigation-bar-info {
  display: flex;
  color: white;
  justify-content: space-between;
  padding-top: 16px;
  order: 2;
  @include min-md {
    padding: 0;
    align-items: center;
  }
  &__account {
    font-size: 13px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    @include min-md {
      margin-right: 60px;
      margin-bottom: 0;
    }
    @include min-xl {
      margin-right: 50px;
    }
    &__login {
      color: $text-color-yellow;
    }
    span {
      font-weight: 500;
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
      }

      &:nth-child(3) {
        color: #ffd25d;
        margin-left: 10px;
      }
    }

    span.icon-Arrow-Small-Down {
      font-size: 10px;
      color: white;
    }
  }

  .phone-icon {
    color: white;
  }

  .mr {
    @include min-sm {
      margin-right: 20px;
    }
    @include min-md {
      margin-right: 100px;
    }
    @include min-xl {
      margin-right: 20px;
      margin-bottom: 0;
    }
  }

  &__menu {
    display: flex;
    span {
      cursor: pointer;
      font-size: 18px;
      cursor: pointer;
      &:first-child {
        margin-right: 10px;
        @include min-sm {
          margin-right: 24px;
        }
      }
    }
  }
}

.offline-page {
  justify-content: flex-end;
}
.nav-item {
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
    text-transform: uppercase;
    @include min-sm {
      font-size: 15px;
      text-transform: uppercase;
      margin-left: 5px;
    }
  }
}
.nav-item:not(:first-child) {
  width: 15%;
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
    font-size: 15px;
    margin-left: 5px;
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
</style>

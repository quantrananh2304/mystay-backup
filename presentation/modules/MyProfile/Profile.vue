<template>
  <section v-if="pageLoaded" class="my-profile-page-content">
    <div class="my-profile-page-content__left">
      <div class="my-profile-page-content__left__header">
        <p class="my-profile-page-content__left__header--name text-capitalize">
          {{ lang === 'ja' ? getLang.fullNameJP : fullName }}
        </p>
      </div>
      <!-- <div class="text-center my-profile-page-content__point">
        <b class="my-profile-page-content__total-point text-lowercase">
          {{ getMemberRankWithLanaguague }}
          {{ points && (points.total_point * points.usage_unit) | currency }}
          {{ getLang.miles }}
        </b>
      </div> -->

      <div class="my-profile-page-content__left__list-item">
        <ul>
          <li
            v-for="(item, itemIdx) in tabs"
            :key="itemIdx"
            class="tab-item"
            :class="{ active: item.routerLink == $route.path }"
            @click="changeTab(item)"
          >
            <div>{{ item.name }}</div>
          </li>
        </ul>
      </div>
      <div
        class="
          my-profile-page-content__left__cancel-membership
          d-none d-md-flex
        "
      >
        <a class="cancel-membership-btn" @click="onOpenCancelMembershipModal">
          {{ getLang.cancel_membership }}
        </a>
      </div>
    </div>
    <div class="my-profile-page-content__right">
      <router-view />
    </div>
    <b-button class="d-none" @click="toast('b-toaster-top-center')">
      Failed
    </b-button>

    <MyStayPopup ref="cancel-membership" size="sm" modal-class="modal-delete">
      <div class="cancel-membership-modal">
        <div class="cancel-membership-modal__title">
          {{ getLang.are_you_sure_to_cancel_membership }}
        </div>
        <div class="d-flex justify-content-between">
          <button
            class="m-btn m-btn__white cancel-membership-modal__button"
            @click="onCancel"
          >
            {{ $t('summary.cancel') }}
          </button>
          <button
            class="m-btn m-btn__yellow cancel-membership-modal__button"
            @click="onCancelMembership"
          >
            {{ $t('summary.confirm') }}
          </button>
        </div>
      </div>
    </MyStayPopup>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import { ToastPlugin } from 'bootstrap-vue'
import { STATIC_HOTEL_ID } from '../../../shared/constants'
Vue.use(ToastPlugin)

export default Vue.extend({
  name: 'Profile',
  data() {
    return {
      selectedTab: 0,
      counter: 0,
      editable: false,
      pageLoaded: false
    }
  },

  computed: {
    ...mapState({
      userData: state => state.users.data.userData,
      isUpdateSuccess: state => state.users.data.isUpdateSuccess
    }),

    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      points: 'users/points',
      memberRank: 'users/memberRank',
      lang: 'appHeader/language'
    }),

    getMemberRankWithLanaguague() {
      const translateItem = this.memberRank?.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem?.name
    },

    tabs() {
      return {
        myprofile: {
          id: 0,
          name: this.getLang.my_profile,
          routerLink: '/profile/my-profile',
          buttonName: 'My Profile',
          pageCategory: 'My Profile'
        },
        billHistory: {
          id: 1,
          name: this.getLang.yourBooking,
          routerLink: '/profile/my-booking',
          buttonName: 'My Booking',
          pageCategory: 'My Booking'
        }
      }
    },

    getLang() {
      return {
        yourBooking: this.$t('headers.my_reservations'),
        joiningDate: this.$t('my_profile.joining_date'),
        birth_day: this.$t('my_profile.birth_day'),
        billHistory: this.$t('my_profile.bill_history'),
        editProfile: this.$t('my_profile.edit_profile'),
        miles: this.$t('hoteldetail.miles'),
        my_profile: this.$t('headers.my_profile'),
        are_you_sure_to_cancel_membership: this.$t(
          'my_profile.are_you_sure_to_cancel_membership'
        ),
        cancel_membership: this.$t('my_profile.cancel_membership'),
        fullNameJP: this.$t('login_signup.hi_user', { username: this.fullName })
      }
    },
    isValid() {
      return !this.$v.$invalid
    },

    fullName() {
      if (this.$i18n.locale === 'en') {
        return this.userData?.first_name + ' ' + this.userData.last_name
      }

      return this.userData?.last_name + ' ' + this.userData.first_name
    }
  },

  watch: {
    fullLang() {
      this.getReservasionsList()
    }
  },

  created() {
    this.getReservasionsList()
  },

  mounted() {
    this.pageLoaded = true
  },

  methods: {
    ...mapActions({
      handleUpdateUserInfo: 'users/updateUserInfo',
      getMyRewards: 'users/getMyRewards',
      getReservasionsList: 'users/getReservasionsList',
      removeUser: 'users/removeUser'
    }),

    changeTab(tab) {
      this.$router.push(tab.routerLink)
      this.$gtm.push({
        event: 'clickMyBooking',
        pageCategory: tab.pageCategory,
        language: this.$langFormat(this.lang),
        bookingButtonName: tab.buttonName,
        sectionName: tab.buttonName,
        triggerType: 'User Interaction'
      })
    },

    onOpenCancelMembershipModal() {
      this.$refs['cancel-membership'].showModal()
    },

    onCancel() {
      this.$refs['cancel-membership'].hideModal()
    },

    onCancelMembership() {
      const params = {
        body: {
          reason: ''
        },
        hotel_id: STATIC_HOTEL_ID
      }

      this.$triplaRepo.users
        .cancelMembership(params)
        .then(() => {
          this.$gtm.push({
            event: 'cancelMembership',
            pageCategory: this.$route.name,
            language: this.$langFormat(this.lang),
            triggerType: 'User Interaction'
          })

          this.removeUser()
          this.$router.push('/').catch(err => err)
        })
        .catch((err) => {
          const message = err.message && err.message[0]?.title
          this.$refs['cancel-membership'].hideModal()
          this.$bvToast.toast(message, {
            title: 'Error',
            toaster: 'b-toaster-top-center',
            solid: true,
            appendToast: true,
            variant: 'danger'
          })
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.my-profile-page-content {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddee0;
  @include min-sm {
    flex-direction: row;
  }
  &__left {
    background: $bg-color-blue;
    width: 100%;
    position: relative;
    @include min-sm {
      width: 30%;
    }
    &__header {
      color: white;
      margin: 2px 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      @include min-sm {
        margin: 20px 10px;
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
      }
      &--name {
        display: none;
        @include min-sm {
          display: block;
          font-size: 18px;
          margin: 15px 0 10px 0;
        }
      }
    }

    &__cancel-membership {
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      button {
        width: 92%;
        padding: 8px;
      }
    }

    &__list-item {
      color: white;
      @include min-sm {
        margin-top: 50px;
      }
      ul {
        display: flex;
        @include min-sm {
          display: block;
        }
        li {
          width: 100%;
          text-align: center;
        }
      }
      .tab-item {
        padding: 15px 10px;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        cursor: pointer;
        &:hover {
          background: #fff;
          color: #1a489c;
        }
      }
      .tab-item:not(:first-child) {
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        @include min-sm {
          border-top: 1px solid #ccc;
        }
      }
    }
  }
  &__right {
    position: relative;
    width: 100%;
    // @include min-sm {
    //   width: 70%;
    //   padding: 20px 40px;
    //   background: #fff;
    // }
  }
  &__total-point {
    color: #ffd25d;
    margin-bottom: 20px;
  }

  &__point {
    margin-bottom: 30px;

    @include min-sm {
      margin-bottom: 0;
    }
  }
}
.active {
  background: #fff;
  color: #1a489c;
}

.cancel-membership-btn {
  color: #ffd25d;
  font-size: 14px;
}

.cancel-membership-modal {
  padding: 20px 20px 10px;
  &__title {
    font-size: 16px;
    margin-bottom: 30px;
    text-align: center;
  }

  &__button {
    width: 48%;
    padding: 8px 0;
  }
}
</style>

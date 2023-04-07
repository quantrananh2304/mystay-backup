<template>
  <div class="guest-detail__info-top">
    <div v-if="isLogin">
      <MyStaysElite is-show-rank />
    </div>
    <div v-else>
      <p class="guest-detail__info-top-call-out">
        {{ getLang.enterInfo }}
      </p>
      <div v-if="!isLogin" class="guest-detail__info-top-login">
        <!-- <LoginBlock /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { MemberType } from '../../../../shared/constants/index'

export default Vue.extend({
  name: 'GuestDetailInfoTop',
  computed: {
    goldMemberShip() {
      return this.userInfo.userMemberType === MemberType.Gold
    },
    getLang() {
      return {
        enterInfo: this.$t('guest_detail.enter_info')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.guest-detail__info-top {
  margin-bottom: 30px;

  &-call-out {
    display: none;

    @include min-sm {
      display: block;
    }
  }

  &-login {
    display: block;

    @include min-sm {
      display: none;
    }
  }

  &-authened {
    &-member {
      display: none;

      @include min-sm {
        display: flex;
        align-items: center;
        margin-bottom: 14px;

        img {
          margin-right: 12px;
        }
      }

      &ship {
        font-size: 11px;
        color: $text-color-blue;
        padding: 6px 9px;
        border-radius: 24px;
        background: $bg-color-yellow;
        font-weight: bold;

        [class^="icon-"],
        [class*=" icon-"] {
          margin-right: 6px;
          font-size: 14px;
          vertical-align: bottom;
        }
      }

      &-logout {
        margin-left: auto;
        font-size: 12px;
        color: $bg-color-blue-2;
        cursor: pointer;
      }
    }

    &-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 15px;
      border: 1px solid $border-color-gray-2;
      border-radius: 4px;
      background: $bg-color-blue-4;

      @include min-sm {
        padding: 20px;
      }

      &-name {
        &-welcome {
          margin-bottom: 7px;

          @include min-sm {
            margin-bottom: 0;
          }
        }

        &-member {
          display: block;
          color: $text-color-blue-2;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: bold;

          @include min-sm {
            display: none;
          }
        }
      }

      &-miles {
        &-current {
          display: none;

          @include min-sm {
            display: inline;
          }
        }
      }

      span {
        font-size: 18px;
        font-weight: bold;

        @include min-sm {
          font-size: 16px;
        }
      }
    }
  }
}
</style>

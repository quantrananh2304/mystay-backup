<template>
  <section class="mystays-elite">
    <div class="mystays-elite__title">
      <div class="d-flex">
        <img
          v-lazy-load
          :data-src="require('@/assets/images/Logo-Icon.png')"
          alt
        >
        <h5>MyStays Elite</h5>
      </div>
      <!-- <div
        class="mystays-elite__title__gold-member d-flex align-items-center ml-4"
        v-if="getMemberRankWithLanaguague && isShowRank"
      >
        <img
          :src="rankImage"
          alt=""
          :class="{ 'mr-3': getMemberRankWithLanaguague }"
          v-if="rankImage"
        />
        <span>{{ getMemberRankWithLanaguague }}</span>
      </div> -->
      <div class="mystays-elite__title__logout" @click="logoutUser">
        {{ $t("payment_info.logout") }}
      </div>
    </div>
    <div
      class="mystays-elite__content"
      :class="{ padding: !getMemberRankWithLanaguague || isShowRank }"
    >
      <div class="mystays-elite__content__title">
        <p class="text-capitalize">
          {{
            $t("login_signup.hi_user", {
              username: userData && userData.name,
            })
          }}
        </p>
        <!-- <span v-if="!isShowRank">{{ getMemberRankWithLanaguague }}</span> -->
      </div>
      <div class="mystays-elite__content__price d-flex align-items-center">
        <!-- <span v-if="isShowRank">
          {{ $t("login_signup.your_current_balance") }}
        </span> -->
        <!-- <h4 class="mb-0 ml-2">
          {{ points && (points.total_point * points.usage_unit) | currency }}
          {{ $t("confirmbooking.miles") }}
        </h4> -->
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MyStaysElite',
  props: {
    isShowRank: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      userData: 'users/userData',
      points: 'users/points',
      memberRank: 'users/memberRank',
      rankImage: 'users/rankImage',
      lang: 'appHeader/language'
    }),

    getMemberRankWithLanaguague() {
      const translateItem = this.memberRank?.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem?.name
    }
  },
  methods: {
    ...mapActions({
      logoutUser: 'users/logoutUser'
    })
  }
})
</script>

<style lang="scss" scoped>
.mystays-elite {
  display: none;
  @include min-sm {
    display: block;
  }
  &__title {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 22px;
      height: 22px;
      margin-right: 10px;
    }
    h5 {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 0;
      margin-top: 2px;
    }

    &__gold-member {
      font-size: 12px;
      font-weight: bold;
      padding: 5px 10px;
      background: #ffd25d;
      border-radius: 15px;
    }

    &__logout {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      font-weight: bold;
      color: #1a489c;
      cursor: pointer;
    }
  }
  &__content {
    border: 1px solid $border-color-gray-2;
    border-radius: 4px;
    padding: 9px 20px;
    background: #f5f8ff;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__title {
      p {
        font-size: 14px;
        margin-bottom: 0;
        font-weight: 600;
      }
      span {
        font-size: 12px;
        color: $text-color-blue-2;
      }
    }

    &__price {
      span {
        font-weight: bold;
        font-size: 14px;
        margin-top: 2px;
      }
      h4 {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .padding {
    padding: 18px 20px;
  }
}
</style>

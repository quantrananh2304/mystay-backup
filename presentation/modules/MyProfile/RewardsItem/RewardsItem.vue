<template>
  <div class="rewards-item d-flex justify-content-between align-items-center">
    <div
      class="rewards-item__amount mb-1"
      :class="{ success: rewards.amount > 0, spent: rewards.amount < 0 }"
    >
      {{ rewards.amount | currency }}
    </div>

    <div class="rewards-item__right">
      <div class="rewards-item__desc font-weight-bold mb-1">
        {{ desc }}
      </div>
      <div v-if="rewards.expired_at" class="rewards-item__expire mb-1">
        <span class="font-weight-bold">{{ $t("my_profile.expire_at") }}:</span>
        {{ rewards.expired_at | datetime($langFormat(lang), true) }}
      </div>
      <div class="rewards-item__post-at mb-1">
        <span class="font-weight-bold">{{ $t("my_profile.posted_at") }}:</span>
        {{ rewards.posted_at | datetime($langFormat(lang), true) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RewardsItem',
  props: {
    rewardsItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rewards: this.rewardsItem
    }
  },
  computed: {
    ...mapGetters({
      lang: 'appHeader/language'
    }),
    desc() {
      const translateItem = this.rewards?.translations_attributes.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem.description
    }
  },
  watch: {
    rewardsItem(rewards) {
      this.rewards = rewards
    }
  }
}
</script>

<style lang="scss" scoped>
.rewards-item {
  padding: 20px;
  box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
  border-radius: 5px;
  background: white;
  position: relative;

  &__amount {
    width: 80px;
    height: 80px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border-radius: 8px;
  }

  &__right {
    flex: 1;
  }

  .success {
    background: #078171;
    color: white;
    font-weight: bold;
  }

  .spent {
    background: #ffd25d;
    font-weight: 600;
  }
}
</style>

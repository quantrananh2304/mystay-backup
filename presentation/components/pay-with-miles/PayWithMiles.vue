<template>
  <div class="pay-with-miles">
    <div class="pay-with-miles__title">
      <h5>{{ getLang.pay_with_miles }}</h5>
    </div>
    <div
      class="
        pay-with-miles__block
        d-flex
        justify-content-between
        align-items-end
      "
    >
      <span class="text-capitalize">{{ $t("headers.hi") }} {{ userData && userData.name }}</span>
      <div class="pay-with-miles__block__gold-member d-flex align-items-center">
        <img
          :src="rankImage"
          alt=""
          :class="{ 'mr-3': getMemberRankWithLanaguague }"
        >
        <span>{{ getMemberRankWithLanaguague }}</span>
      </div>
    </div>
    <div
      class="
        pay-with-miles__block
        d-flex
        justify-content-between
        align-items-center
      "
    >
      <span>{{ $t("payment_info.your_miles") }}</span>
      <div class="pay-with-miles__block__miles d-flex align-items-center">
        <span class="text-lowercase">
          {{ points && (points.total_point * points.usage_unit) | currency }}
          {{ $t("hoteldetail.miles") }}
        </span>
        <span
          v-b-tooltip.hover
          class="icon-Icon-Info"
          placement="right"
          title="Info"
        />
      </div>
    </div>
    <div
      class="
        pay-with-miles__block
        d-flex
        justify-content-between
        align-items-center
      "
    >
      <span>{{ getLang.apply_to_this_stay }}:</span>
      <QuantityToggle
        :max-miles="points && points.total_point * points.usage_unit"
        :unit="points.minimum_usage_unit"
        :usage-unit="points.usage_unit"
        @on:ChangeMiles="onChangeMiles"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PayWithMiles',
  computed: {
    ...mapGetters({
      userData: 'users/userData',
      points: 'users/points',
      memberRank: 'users/memberRank',
      rankImage: 'users/rankImage',
      lang: 'appHeader/language'
    }),
    getLang() {
      return {
        pay_with_miles: this.$t('payment_info.pay_with_miles'),
        apply_to_this_stay: this.$t('payment_info.apply_to_this_stay'),
        your_miles: this.$t('payment_info.your_miles')
      }
    },

    getMemberRankWithLanaguague() {
      const translateItem = this.memberRank?.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem?.name
    }
  },
  methods: {
    onChangeMiles(miles) {
      this.$emit('on:SendMiles', miles)
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-with-miles {
  width: 100%;
  border: 1px solid #dddee0;
  border-radius: 2px;
  padding: 34px 34px 25px 34px;
  margin-bottom: 25px;

  h5 {
    color: #232e48;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 18px;
  }

  &__block {
    padding: 12px 0;
    border-bottom: 1px solid #dddee0;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    span {
      font-size: 12px;
      font-weight: bold;
    }

    &__gold-member {
      font-size: 12px;
      font-weight: bold;
      padding: 5px 10px;
      background: #ffd25d;
      border-radius: 15px;

      span {
        &:first-child {
          font-size: 16px;
          margin-right: 10px;
          font-weight: normal;
        }
      }
    }

    &__miles {
      span {
        &:first-child {
          font-size: 16px;
          font-weight: bold;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

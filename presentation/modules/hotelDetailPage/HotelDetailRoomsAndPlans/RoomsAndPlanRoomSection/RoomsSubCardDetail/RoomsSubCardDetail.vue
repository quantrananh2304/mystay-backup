<template>
  <div class="hotel-detail__sub-card sub-card__detail">
    <div v-if="member" class="sub-card__detail--member">
      <h3 @click="$_changeTab">
        {{ plansInRoom && plansInRoom.title }}
        <span class="icon-Arrow-Small-Right" />
      </h3>
      <div class="sub-card__detail--member__rate">
        <span class="rate">{{ plansInRoom && plansInRoom.rate }}</span>
        <span class="discount-rate">
          {{ plansInRoom && plansInRoom.discountRate }}
        </span>
      </div>
      <div v-if="isFullText">
        {{ plansInRoom && plansInRoom.details }}
      </div>
      <div v-else v-html="shortDescription" />
      <span @click="$_openFullText">{{ $t("hoteldetail.details") }}</span>
    </div>
    <div v-else class="sub-card__detail--non-member">
      <h3 @click="$_changeTab">
        {{ plansInRoom && plansInRoom.title }}
        <span class="icon-Arrow-Small-Right" />
      </h3>
      <!-- <div class="sub-card__detail--non-member__rate">
        <span>{{ $_format(plansInRoom && plansInRoom.rate) }}</span>
      </div> -->
      <div
        v-if="isFullText"
        class="sub-card__detail--non-member__full-text"
        v-html="plansInRoom && plansInRoom.details"
      />
      <div
        v-if="plansInRoom && plansInRoom.details && plansInRoom.details.length"
        class="sub-card__detail--non-member__short"
      >
        <div v-if="!isFullText" class="short-desc" v-html="shortDescription" />
        <span
          v-if="plansInRoom && plansInRoom.details"
          @click="$_openFullText"
        >{{
          isFullText ? $t("hoteldetail.hide") : $t("hoteldetail.details")
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

const FilterType = {
  filterByRoom: 'room',
  filterByPlan: 'plan'
}

export default Vue.extend({
  name: 'RoomsSubCardDetail',
  components: {},
  props: {
    // eslint-disable-next-line vue/require-default-prop
    plansInRoom: {
      type: Object
    },
    member: {
      type: Boolean
    }
  },
  data() {
    return {
      isFullText: false
    }
  },
  computed: {
    shortDescription() {
      const limitChars = this.isMobile ? 80 : 150
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.isFullText = this.plansInRoom?.details?.length < limitChars
      return this.plansInRoom?.details?.slice(0, limitChars) + '...'
    }
  },
  methods: {
    ...mapActions({
      changeTab: 'hotelDetail/changeTab'
    }),
    $_openFullText() {
      this.isFullText = !this.isFullText
    },
    $_changeTab() {
      this.changeTab({
        currentTab: FilterType.filterByPlan,
        currentId: this.plansInRoom.planId.toString()
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-detail__sub-card.sub-card__detail {
  flex: 1;
  margin-right: 20px;
  width: 80%;

  @include min-sm {
    margin-right: 45px;
    width: 60%;
  }

  .sub-card__detail {
    &--member,
    &--non-member {
      h3 {
        font-size: 13px;
        margin-bottom: 0;
        cursor: pointer;
        font-weight: bold;

        @include min-sm {
          margin-bottom: 0.5rem;
        }

        [class^="icon-"],
        [class*=" icon-"] {
          font-size: 7px;
          display: inline-block;

          @include min-sm {
            font-size: 9px;
          }
        }

        @include min-sm {
          font-size: 16px;
        }
      }

      p {
        margin: 0;

        @include min-sm {
          display: block;
          font-size: 14px;
        }

        span {
          cursor: pointer;
          color: $text-color-blue-2;
          font-weight: bold;
        }
      }

      &__rate {
        display: block;

        span {
          display: inline;
        }

        @include min-sm {
          display: none;
        }
      }

      &__short {
        display: inline;
        .short-desc {
          display: inline;
        }
        span {
          color: $text-color-blue-2;
          cursor: pointer;
        }
      }
    }

    &--member {
      h3 {
        color: $text-color-blue;

        @include min-sm {
          color: $text-color-pink;
        }
      }

      &__rate {
        span.rate {
          text-decoration: line-through;
          color: $text-color-gray-6;
          font-size: 13px;
          font-weight: normal;
        }

        span.discount-rate {
          color: $text-color-pink;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    &--non-member {
      h3 {
        color: $text-color-blue-2;
      }

      &__rate {
        font-size: 18px;
        font-weight: bold;
      }

      &__full-text {
        display: inline;
        word-break: break-all;
      }
    }
  }

  .sub-card__cancellation {
    span {
      font-size: 13px;
      color: #1a489c;
      cursor: pointer;
      text-decoration: underline;
      list-style-type: circle;
    }
  }
}
</style>

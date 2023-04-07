<template>
  <section
    class="hotel-review-stay"
    :class="{ 'is-update-booking': isUpdateBooking }"
  >
    <div class="container-page hotel-review-stay__mobile">
      <div class="hotel-review-stay__title">
        <h3>{{ getLanguage.reviewYourStay }}</h3>
      </div>
      <div class="hotel-review-stay__content">
        <div class="hotel-review-stay__content__left">
          <div class="content-left">
            <div class="content-left__cancellation">
              <HotelReviewCancellation />
            </div>
            <div
              class="content-left__payment"
              :class="{ 'remove-fixed': isFixed }"
            >
              <div class="content-left__payment__grand-total">
                <span>{{ getLanguage.grandTotal }}</span>
                <span>{{ totalPrice | currency('YEN') }}</span>
              </div>
              <div class="content-left__payment__checkout">
                <button
                  class="m-btn m-btn__yellow"
                  :disabled="$nuxt.isOffline"
                  @click="$_goToPaymentPage"
                >
                  {{ getLanguage.proceedToCheckout }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="hotel-review-stay__content__right">
          <div class="content-right">
            <div class="content-right__sammary-changes">
              <HotelReviewSummaryChange
                :error-text="errorText"
                @on:CheckPromo="$_applyPromoCode"
              />
            </div>
            <div class="content-right__hotel-location">
              <LocationBlock :show-map="false" />
            </div>
            <div class="content-right__room-info">
              <HotelReviewInfo />
              <HotelReviewInfoOld v-if="isUpdateBooking" />
            </div>
            <div v-if="pageLoaded" class="content-right__promo-code">
              <div class="content-right__promo-code__label">
                {{ getLanguage.promoCode }}
              </div>
              <div class="content-right__promo-code__input">
                <span class="icon-Icon-Promo-Codes" />
                <input
                  v-model="searchPhrase"
                  type="text"
                  :placeholder="`${getLanguage.promoCode}`"
                  maxlength="10"
                  @keyup="$_searchPromo"
                  @keyup.enter="$_searchPromo"
                >
                <span
                  v-show="searchPhrase"
                  class="icon-Icon-Close"
                  @click="$_clearsearchPhrase"
                />
              </div>
              <div
                v-show="
                  promoCodeSave && promoCodeFromAPI && !isRoomSelectedLoading
                "
                class="content-right__promo-code__save py-1"
              >
                <span class="icon-Icon-Free" />
                <span>
                  {{
                    $t('booking.saved_money', {
                      percent: percentDiscount,
                      coupon: promoCodeFromAPI,
                    })
                  }}
                </span>
                <span>{{ promoCodeSave | currency('YEN') }}</span>
              </div>
            </div>
            <div v-show="!isLogin" class="content-right__sign-up">
              <!-- <LoginBlock :is-mobile="isMobile" /> -->
            </div>
            <div class="content-right__payment">
              <TotalPrcie />
              <div class="content-right__payment__checkout">
                <button
                  class="m-btn m-btn__yellow"
                  :disabled="$nuxt.isOffline"
                  @click="$_goToPaymentPage"
                >
                  {{ getLanguage.proceedToCheckout }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-page hotel-review-stay__desktop">
      <div class="hotel-review-stay__title">
        <h3>{{ getLanguage.reviewYourStay }}</h3>
      </div>
      <div class="hotel-review-stay__content">
        <div class="hotel-review-stay__content__left">
          <div class="content-left">
            <div class="content-left__sammary-changes">
              <HotelReviewSummaryChange :error-text="errorText" />
            </div>
            <div class="content-left__cancellation">
              <HotelReviewCancellation />
            </div>
            <div class="content-left__payment">
              <div class="content-left__payment__grand-total">
                <span>{{ getLanguage.grandTotal }}</span>
                <span>{{ totalPrice | currency('YEN') }}</span>
              </div>
              <div class="content-left__payment__checkout">
                <button
                  class="m-btn m-btn__yellow"
                  :disabled="$nuxt.isOffline"
                  @click="$_goToPaymentPage"
                >
                  {{ getLanguage.proceedToCheckout }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="hotel-review-stay__content__right">
          <div class="content-right">
            <div class="content-right__hotel-location">
              <LocationBlock :show-map="false" />
            </div>
            <div class="content-right__room-info">
              <HotelReviewInfo />
              <HotelReviewInfoOld v-if="isUpdateBooking" />
            </div>
            <div v-if="pageLoaded" class="content-right__promo-code">
              <div class="content-right__promo-code__label">
                {{ getLanguage.promoCode }}
              </div>
              <div class="content-right__promo-code__input">
                <span class="icon-Icon-Promo-Codes" />
                <input
                  v-model="searchPhrase"
                  type="text"
                  :placeholder="`${getLanguage.promoCode}`"
                  maxlength="10"
                  @keyup="$_searchPromo"
                  @keyup.enter="$_searchPromo"
                >
                <span
                  v-show="searchPhrase"
                  class="icon-Icon-Close"
                  @click="$_clearsearchPhrase"
                />
              </div>
              <div
                v-if="
                  promoCodeFromAPI && promoCodeSave && !isRoomSelectedLoading
                "
                class="content-right__promo-code__save py-1"
              >
                <span class="icon-Icon-Free" />
                <span>
                  {{
                    $t('booking.saved_money', {
                      percent: percentDiscount,
                      coupon: promoCodeFromAPI,
                    })
                  }}
                </span>
                <span>{{ promoCodeSave | currency('YEN') }}</span>
              </div>
              <div v-if="errorText" class="content-right__promo-code__error">
                <span class="icon-Icon-Info" />
                <span>{{ errorText }}</span>
              </div>
            </div>
            <div v-show="!isLogin" class="content-right__sign-up">
              <!-- <LoginBlock :is-mobile="isMobile" /> -->
            </div>
            <div class="content-right__payment">
              <TotalPrcie />
              <div class="content-right__payment__checkout">
                <button
                  class="m-btn m-btn__yellow"
                  :disabled="$nuxt.isOffline"
                  @click="$_goToPaymentPage"
                >
                  {{ getLanguage.proceedToCheckout }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'HotelReviewStay',
  data() {
    return {
      searchPhrase: '',
      promoCode: '',
      isFixed: false,
      timeout: null,
      debouncedInput: '',
      errorText: '',
      pageLoaded: false
    }
  },
  computed: {
    ...mapState({
      promotionCode: state => state.booking.bookingData.promoCode,
      isUpdateBooking: state => state.hotelDetail.isUpdateBooking,
      hotelID: state => state.hotel.data.hotelID,
      bookingData: state => state.booking.bookingData,
      roomSelectedFromAPI: state => state.hotelDetail.roomSelectedFromAPI,
      isRoomSelectedLoading: state => state.hotelDetail.isRoomSelectedLoading
    }),
    ...mapGetters({
      totalPrice: 'hotelDetail/totalPrice',
      promoCodeSave: 'hotelDetail/couponDiscount',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage',
      roomSelectedParams: 'booking/roomSelectedParams',
      totalPriceWithoutTax: 'hotelDetail/totalPriceWithoutTax',
      numberAdultsInRoomSelected: 'booking/numberAdultsInRoomSelected',
      numberChildrenInRoomSelected: 'booking/numberChildrenInRoomSelected',
      promoCodeFromAPI: 'hotelDetail/promoCodeFromAPI',
      roomDetails: 'hotelDetail/roomDetails',
      percentDiscount: 'hotelDetail/percentDiscount'
    }),
    getLanguage() {
      return {
        reviewYourStay: this.$t('summary.review_your_stay'),
        proceedToCheckout: this.$t('summary.proceed_to_checkout'),
        grandTotal: this.$t('summary.summary_of_charges'),
        promoCode: this.$t('booking.promo_code')
      }
    },
    hotelIdAndPlanCode() {
      return {
        hotelID: this.hotelID
      }
    },
    roomPlanCode() {
      if (this.roomDetails?.length) {
        return this.roomDetails[0]?.roomPlanCode
      }

      return ''
    }
  },
  watch: {
    promotionCode(promoCode) {
      this.promoCode = promoCode
      this.searchPhrase = promoCode
    },

    hotelIdAndPlanCode: {
      handler(hotel) {
        const params = {
          hotelID: hotel.hotelID,
          queryString: {
            room_plan_codes: this.roomPlanCode
          },
          fullLang: this.fullLang
        }
        this.getCancellationPolicies(params)
      },
      deep: true
    },

    roomDetails: {
      handler(rooms) {
        if (!this.isUpdateBooking && rooms.length) {
          this.getRoomSelected(this.buildParams(this.searchPhrase))
        }
      },
      deep: true
    },

    fullLang(lang) {
      const params = {
        hotelID: this.hotelID,
        queryString: {
          room_plan_codes: this.roomPlanCode
        },
        fullLang: lang
      }
      if (this.roomPlanCode) {
        this.getCancellationPolicies(params)
        if (!this.isUpdateBooking) {
          this.getRoomSelected(this.buildParams(this.searchPhrase))
        }
      }
      this.getHotelDetail({ hotelID: this.hotelID })
    }
  },
  mounted() {
    this.promoCode = this.promotionCode
    this.searchPhrase = this.promotionCode
    window.addEventListener('scroll', this.$_onScroll)

    const params = {
      hotelID: this.hotelID,
      queryString: {
        room_plan_codes: this.roomPlanCode
      }
    }

    if (!this.hotelDetail?.name) {
      this.getHotelDetail({ hotelID: this.hotelID })
    }

    if (this.roomDetails.length) {
      this.getRoomSelected(this.buildParams(this.searchPhrase))
    }

    if (this.roomPlanCode) {
      this.getCancellationPolicies(params)
    }

    this.pageLoaded = true
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.$_onScroll)
  },
  methods: {
    ...mapActions({
      getPromoCode: 'booking/getPromoCode',
      getRoomSelected: 'hotelDetail/getRoomSelected',
      getCancellationPolicies: 'hotelDetail/getCancellationPolicies',
      getHotelDetail: 'hotelDetail/getHotelDetail'
    }),

    buildParams(coupon_code) {
      return {
        hotelID: this.hotelID,
        queryString: {
          checkin_date: this.bookingData.checkIn,
          checkout_date: this.bookingData.checkOut,
          children: this.numberChildrenInRoomSelected,
          mode: 'standard',
          adults: this.numberAdultsInRoomSelected,
          total_price_without_tax: this.totalPriceWithoutTax,
          rooms: this.roomSelectedParams,
          coupon_code
        }
      }
    },

    $_clearsearchPhrase() {
      this.searchPhrase = ''
      this.getPromoCode('')
      this.$_searchPromo()
    },

    $_goToHotelDetail() {
      this.$router.push('/hotel')
    },

    $_goToPaymentPage() {
      this.$router.push('/guest-detail')
    },

    $_onScroll() {
      const footerOffsetTop = document.querySelector(
        '.content-left__cancellation'
      )
      if (
        window.pageYOffset + window.innerHeight >=
        footerOffsetTop.offsetTop +
          footerOffsetTop.getBoundingClientRect().height +
          137
      ) {
        this.isFixed = true
      } else {
        this.isFixed = false
      }
    },

    $_searchPromo() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async() => {
        try {
          const resp = await this.getRoomSelected(
            this.buildParams(this.searchPhrase)
          )
          if (resp && resp.data) {
            this.errorText = ''
            const coupon_code = resp.data?.coupon_promotion?.coupon_code || ''
            this.getPromoCode(coupon_code)
          }
        } catch (error) {
          this.errorText = error?.title

          this.getRoomSelected(this.buildParams(''))
        }
      }, 800)

      const applyCouponGtm = {
        triggerType: 'User Interaction',
        event: 'applyCoupon',
        language: this.$langFormat(this.lang),
        pageCategory: 'HotelReview',
        productCoupon: this.promoCode,
        hotelID: this.hotelID,
        roomID: this.roomSelectedParams[0]?.room_type_code,
        planID: this.roomSelectedParams[0]?.room_plan_code
      }

      this.$gtm.push(applyCouponGtm)
    },

    $_applyPromoCode() {
      this.$_searchPromo()
    }
  }
})
</script>

<style lang="scss" scoped>
.hotel-review-stay {
  padding: 30px 0 10px 0;
  min-height: 90vh;
  @include min-sm {
    padding: 84px 0 40px 0;
  }

  &__mobile {
    @include min-sm {
      display: none;
    }
  }

  &__desktop {
    display: none;
    @include min-sm {
      display: block;
    }
  }

  &__title {
    margin-bottom: 38px;
    display: flex;
    align-items: center;
    @include min-sm {
      margin-bottom: 42px;
      img {
        display: none;
      }
    }
    h3 {
      font-size: 20px;
      color: $text-color-blue;
      margin-bottom: 0;
      font-weight: 600;
      @include min-sm {
        font-size: 30px;
        margin-left: 0;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @include min-md {
      flex-direction: row;
    }
    &__left {
      width: 100%;
      order: 2;
      @include min-md {
        width: 57.6%;
        order: 1;
      }

      .content-left {
        &__payment {
          position: fixed;
          bottom: 0;
          background: white;
          width: 100%;
          left: 0;
          z-index: 10;
          padding: 0 15px 10px 15px;
          @include min-sm {
            display: none;
          }
          &__grand-total {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            padding: 7px;
            background: $bg-color-nav;
            border-radius: 2px;
            color: white;
            opacity: 0.9;
            position: relative;
            &::before {
              content: '';
              width: 0;
              height: 0;
              border-width: 10px 9px;
              border-style: solid;
              margin-left: -9px;
              border-color: transparent transparent #232e48 transparent;
              left: 50%;
              position: absolute;
              transform: rotate(180deg);
              bottom: -15px;
            }
            span {
              &:first-child {
                font-size: 10px;
                margin-right: 10px;
              }
              &:last-child {
                font-size: 14px;
              }
            }
          }
          &__checkout {
            button {
              width: 100%;
              padding: 14px 0 13px 0;
              box-shadow: 1px 2px 5px 3px rgba(0, 0, 0, 0.2);
            }
          }
        }
        .remove-fixed {
          position: sticky;
          padding: 0;
        }
      }
    }

    &__right {
      width: 100%;
      order: 1;
      @include min-sm {
        order: 2;
        margin: 0 auto;
      }
      @include min-md {
        width: 34%;
        margin: 0;
      }

      .content-right {
        &__promo-code {
          display: none;
          outline-color: $text-color-blue-2;
          margin-bottom: 30px;
          @include min-sm {
            display: block;
          }
          &__label {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          &__input {
            display: flex;
            align-items: center;
            position: relative;
            border: 1px solid $border-color-gray-2;
            border-radius: 3px;
            margin-bottom: 10px;
            input {
              width: 100%;
              height: 100%;
              border: none;
              outline-color: $text-color-blue-2;
              padding: 15px 16px 15px 50px;
              color: $text-color-blue-2;
              text-transform: uppercase;
              font-weight: bold;
              &::placeholder {
                font-size: 13px;
              }
            }
            span {
              &:first-child {
                font-size: 20px;
                position: absolute;
                left: 15px;
                color: $text-color-blue-2;
              }
              &:last-child {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 19px;
                font-size: 6px;
                padding: 5px 5px 6px 6px;
                color: white;
                border-radius: 50%;
                background: #8a92a3;
                font-weight: bold;
                @include min-sm {
                  right: 10px;
                  top: 17px;
                }
              }
            }
          }

          &__save {
            display: flex;
            justify-content: space-between;
            align-content: center;
            span {
              color: $text-color-pink-2;
              font-size: 14px;
              font-weight: 600;

              &:first-child {
                margin-top: 4px;
                margin-right: 5px;
              }

              &:nth-child(2) {
                flex: 1;
              }
            }
          }

          &__error {
            display: flex;
            span {
              color: $text-color-pink-2;
              font-size: 14px;
              font-weight: 600;

              &:first-child {
                margin-top: 4px;
                margin-right: 5px;
              }
            }
          }
        }

        &__payment {
          display: none;
          @include min-sm {
            display: block;
          }
          &__checkout {
            button {
              width: 100%;
              padding: 13px 0;
            }
          }
        }
      }
    }
  }
}

.is-update-booking {
  padding-top: 20px;
}
</style>

<template>
  <div class="update-guest">
    <div class="update-guest__title" @click="$_openGuestDetail">
      <span class="icon-Icon-Person" />
      <button class="m-btn m-btn__white">
        {{ getLang.updateGuestDetail }}
      </button>
    </div>
    <MyStayPopup
      ref="update-guest"
      :modal-class="'update-guest'"
      size=""
      :centered="true"
      :is-close-icon="true"
    >
      <div class="update-guest__content form">
        <div class="update-guest__content__title">
          <h5>{{ getLang.updateGuestDetail }}</h5>
          <p>{{ getLang.allFieldRequired }}</p>
        </div>
        <div class="update-guest__content__form">
          <InputCustom
            v-for="(inputValue, name) in guestInfos"
            :key="name"
            :label="inputValue.label"
            :type="inputValue.type"
            :value="inputValue.value"
            :input-name="inputValue.name"
            :class="{ 'w-100': inputValue.name == 'phone' }"
            :validations="$v.guestInfos[name] && $v.guestInfos[name].value"
            @input="data => $_getGuestInfos(data, name)"
          >
            <span
              v-if="validate(inputValue.name, 'englishValidation')"
              class="app-input__validation"
            >
              {{ $t('forms.required') }}
            </span>
            <span
              v-else-if="validate(inputValue.name, 'japanLangValidation')"
              class="app-input__validation"
            >
              {{ $t('forms.japan_validation') }}
            </span>

            <span
              v-else-if="validate(inputValue.name, 'hiraganaValidation')"
              class="app-input__validation"
            >{{ 'ひらがなで入力してください。' }}</span>
          </InputCustom>
        </div>

        <div
          v-for="(guest, roomIndx) in guestInfosByRoom"
          :key="roomIndx"
          class="update-guest__content__room"
        >
          <p>
            {{
              $t('confirmbooking.room_guest_name', {
                number: roomIndx + 1
              })
            }}
          </p>
          <div class="update-guest__content__form">
            <InputCustom
              v-for="(item, name) in guest.guestInfos"
              :key="name"
              :label="item.label"
              :type="item.type"
              :value="item.value"
              :input-name="item.name"
              :validations="
                $v.guestInfosByRoom.$each[roomIndx].guestInfos[name] &&
                  $v.guestInfosByRoom.$each[roomIndx].guestInfos[name].value
              "
              @input="data => $_getGuestByRoom(data, name, roomIndx)"
            >
              <span
                v-if="
                  validateGuestInputByRoom(name, roomIndx, 'englishValidation')
                "
                class="app-input__validation"
              >
                {{ $t('forms.required') }}
              </span>
              <span
                v-else-if="
                  validateGuestInputByRoom(
                    name,
                    roomIndx,
                    'japanLangValidation'
                  )
                "
                class="app-input__validation"
              >
                {{ $t('forms.japan_validation') }}
              </span>
              <span
                v-else-if="
                  validateGuestInputByRoom(name, roomIndx, 'hiraganaValidation')
                "
                class="app-input__validation"
              >{{ 'ひらがなで入力してください。' }}</span>
            </InputCustom>
          </div>
        </div>

        <div class="update-guest__content__button">
          <button class="button m-btn m-btn__white" @click="$_onClose">
            {{ getLang.cancel }}
          </button>
          <button
            class="button m-btn m-btn__yellow"
            :disabled="isFormInValid"
            @click="$_updateGuestDetail"
          >
            <b-spinner v-if="isReservationLoading" small />
            {{ getLang.save }}
          </button>
        </div>
      </div>
    </MyStayPopup>
  </div>
</template>

<script>
import { isNullOrUndefined } from 'util'
import Vue from 'vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import {
  phoneValidation,
  englishValidation,
  hiraganaValidation,
  japanLangValidationConfirmPage,
  japanLangValidationConfirmPageForDefaultGuest
} from '../../../../shared/helper/vuelidate-validator'

export default Vue.extend({
  name: 'UpdateGuest',
  data() {
    return {
      guestInfos: {
        firstNameInput: {
          name: 'firstNameInput',
          value: '',
          type: 'text',
          label: 'First Name'
        },
        lastNameInput: {
          name: 'lastNameInput',
          value: '',
          type: 'text',
          label: 'Last Name'
        },
        phone: {
          id: 1,
          name: 'phone',
          value: '',
          type: 'text',
          label: 'Phone'
        }
      },
      guestInfosByRoom: []
    }
  },
  validations() {
    if (this.lang === 'ja') {
      return {
        guestInfos: {
          lastNameInput: {
            value: hiraganaValidation
          },
          firstNameInput: {
            value: hiraganaValidation
          },
          kanjiFirstName: {
            value: japanLangValidationConfirmPageForDefaultGuest
          },
          kanjiLastName: {
            value: japanLangValidationConfirmPageForDefaultGuest
          },
          phone: {
            value: phoneValidation
          }
        },
        guestInfosByRoom: {
          $each: {
            guestInfos: {
              lastNameInput: {
                value: hiraganaValidation
              },
              firstNameInput: {
                value: hiraganaValidation
              },
              kanjiFirstName: {
                value: japanLangValidationConfirmPage
              },
              kanjiLastName: {
                value: japanLangValidationConfirmPage
              }
            }
          }
        }
      }
    }
    return {
      guestInfos: {
        lastNameInput: {
          value: englishValidation
        },
        firstNameInput: {
          value: englishValidation
        },
        phone: {
          value: phoneValidation
        }
      },
      guestInfosByRoom: {
        $each: {
          guestInfos: {
            lastNameInput: {
              value: englishValidation
            },
            firstNameInput: {
              value: englishValidation
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      bookingData: state => state.booking.bookingData,
      isLoading: state => state.hotelDetail?.isLoading,
      isReservationLoading: state => state.booking.isReservationLoading,
      reservationsSettings: state =>
        state.booking.reservationsSettings?.updatable
    }),
    ...mapGetters({
      reservationsData: 'booking/reservationsData',
      byPassToken: 'booking/byPassToken',
      reservationID: 'booking/bookingID',
      lang: 'appHeader/language',
      fullLang: 'appHeader/fullLanguage'
    }),

    hotelID() {
      return this.$route.query.hotel_id
    },

    getLang() {
      return {
        updateGuestDetail: this.$t('confirmbooking.update_guest_detail'),
        allFieldRequired: this.$t('confirmbooking.all_field_required'),
        save: this.$t('confirmbooking.save'),
        cancel: this.$t('summary.cancel'),
        lastName: this.$t('forms.last_name'),
        firstName: this.$t('forms.first_name'),
        phone: this.$t('forms.phone'),
        kanjiLastName: this.$t('forms.kanji_last_name'),
        kanjiFirstName: this.$t('forms.kanji_first_name')
      }
    },

    isFormInValid() {
      return this.$v.$invalid
    },
    guestInfoByRoom() {
      const rooms = this.reservationsData?.rooms?.map((room, index) => {
        if (this.lang === 'ja') {
          return {
            guestInfos: {
              lastNameInput: {
                name: 'lastNameInput',
                value: room.guest?.last_name_kana,
                type: 'text',
                label: this.getLang.lastName,
                id: index + 1
              },
              firstNameInput: {
                name: 'firstNameInput',
                value: room.guest?.first_name_kana,
                type: 'text',
                label: this.getLang.firstName,
                id: index + 1
              },
              kanjiLastName: {
                name: 'kanjiLastName',
                value: room.guest?.last_name,
                type: 'text',
                label: this.getLang.kanjiLastName,
                id: index + 1
              },
              kanjiFirstName: {
                name: 'kanjiFirstName',
                value: room.guest?.first_name,
                type: 'text',
                label: this.getLang.kanjiFirstName,
                id: index + 1
              }
            }
          }
        }
        return {
          guestInfos: {
            firstNameInput: {
              name: 'firstNameInput',
              value: room.guest?.first_name,
              type: 'text',
              label: this.getLang.firstName,
              id: index + 1
            },
            lastNameInput: {
              name: 'lastNameInput',
              value: room.guest?.last_name,
              type: 'text',
              label: this.getLang.lastName,
              id: index + 1
            }
          }
        }
      })

      return rooms
    }
  },
  watch: {
    isReservationLoading(isLoading) {
      if (!isLoading) {
        this.$refs['update-guest'].hideModal()
      }
    }
  },
  methods: {
    ...mapActions({
      updateGuestDetail: 'booking/updateGuestDetail'
    }),

    checkIsExits(param) {
      return isNullOrUndefined(param)
    },

    validate(field, validateType) {
      return (
        this.$v.guestInfos[field]?.value.$dirty &&
        !this.checkIsExits(this.$v.guestInfos[field]?.value[validateType]) &&
        !this.$v.guestInfos[field]?.value[validateType]
      )
    },

    validateGuestInputByRoom(field, roomIndx, validateType) {
      this.$v.guestInfosByRoom.$each[roomIndx]?.guestInfos[field]?.value
      return (
        this.$v.guestInfosByRoom.$each[roomIndx]?.guestInfos[field]?.value
          .$dirty &&
        !this.checkIsExits(
          this.$v.guestInfosByRoom.$each[roomIndx]?.guestInfos[field]?.value[
            validateType
          ]
        ) &&
        !this.$v.guestInfosByRoom.$each[roomIndx]?.guestInfos[field]?.value[
          validateType
        ]
      )
    },

    $_openGuestDetail() {
      this.$refs['update-guest'].showModal()
      this.guestInfosByRoom = this.guestInfoByRoom
      if (this.reservationsData?.guest) {
        this.$v.guestInfos.$touch()
        this.$v.guestInfosByRoom.$touch()
      }
      if (this.lang === 'ja') {
        this.guestInfos = {
          lastNameInput: {
            name: 'lastNameInput',
            value: this.reservationsData?.guest?.last_name_kana,
            type: 'text',
            label: this.getLang.lastName
          },
          firstNameInput: {
            name: 'firstNameInput',
            value: this.reservationsData?.guest?.first_name_kana,
            type: 'text',
            label: this.getLang.firstName
          },
          kanjiLastName: {
            name: 'kanjiLastName',
            value: this.reservationsData?.guest?.last_name,
            type: 'text',
            label: this.getLang.kanjiLastName
          },
          kanjiFirstName: {
            name: 'kanjiFirstName',
            value: this.reservationsData?.guest?.first_name,
            type: 'text',
            label: this.getLang.kanjiFirstName
          },
          phone: {
            name: 'phone',
            value: this.reservationsData?.guest?.phone,
            type: 'text',
            label: this.getLang.phone
          }
        }
      } else {
        this.guestInfos = {
          lastNameInput: {
            name: 'lastNameInput',
            value: this.reservationsData?.guest?.last_name,
            type: 'text',
            label: this.getLang.lastName
          },
          firstNameInput: {
            name: 'firstNameInput',
            value: this.reservationsData?.guest?.first_name,
            type: 'text',
            label: this.getLang.firstName
          },
          phone: {
            name: 'phone',
            value: this.reservationsData?.guest?.phone,
            type: 'text',
            label: this.getLang.phone
          }
        }
      }
    },

    $_getGuestInfos(target, name) {
      this.guestInfos[name].value = target.value
      this.$v.guestInfos[name].value.$touch()
    },

    $_getGuestByRoom(target, name, roomIndx) {
      this.guestInfosByRoom[roomIndx].guestInfos[name].value = target.value
      this.$v.guestInfosByRoom.$each[roomIndx].guestInfos[name].value.$touch()
    },

    $_updateGuestDetail() {
      const rooms = this.reservationsData?.rooms?.map((room, roomIdx) => {
        return {
          guest: {
            first_name:
              this.guestInfosByRoom[roomIdx]?.guestInfos?.kanjiFirstName
                ?.value ||
              this.guestInfosByRoom[roomIdx]?.guestInfos?.firstNameInput?.value,
            first_name_kana:
              this.guestInfosByRoom[roomIdx]?.guestInfos?.firstNameInput
                ?.value || '',
            last_name:
              this.guestInfosByRoom[roomIdx]?.guestInfos?.kanjiLastName
                ?.value ||
              this.guestInfosByRoom[roomIdx]?.guestInfos?.lastNameInput?.value,
            last_name_kana:
              this.guestInfosByRoom[roomIdx]?.guestInfos?.lastNameInput
                ?.value || ''
          },
          room_plan_code: room.room_plan_code,
          room_type_code: room.room_type_code
        }
      })
      const params = {
        hotelID: this.hotelID,
        reservationID: this.reservationsData.reservation_number,
        body: {
          bypass_token: this.reservationsData.bypass_token,
          email: this.reservationsData.email,
          guest: {
            first_name:
              this.guestInfos?.kanjiFirstName?.value ||
              this.guestInfos?.firstNameInput?.value,
            first_name_kana: this.guestInfos?.firstNameInput?.value || '',
            last_name:
              this.guestInfos?.kanjiLastName?.value ||
              this.guestInfos?.lastNameInput?.value,
            last_name_kana: this.guestInfos?.lastNameInput?.value || '',
            phone: this.guestInfos.phone.value
          },
          rooms
        },
        fullLang: this.fullLang
      }

      this.updateGuestDetail(params)
    },

    $_onClose() {
      this.$refs['update-guest'].hideModal()
    }
  }
})
</script>

<style lang="scss" scoped>
.update-guest {
  border-bottom: 1px solid $border-color-gray-2;

  @include min-sm {
    border-bottom: none;
  }
  cursor: pointer;
  h5 {
    font-weight: 600;
  }

  &__title {
    display: flex;
    align-items: center;
    position: relative;
    &:hover {
      span {
        color: white;
      }
    }
    span {
      margin-right: 10px;
      font-weight: bold;
      position: absolute;
      left: 20px;
      color: $text-color-blue-2;
    }

    button {
      width: 100%;
      height: 40px;
    }
  }

  &__content {
    @include min-sm {
      padding: 10px 15px;
    }
    &__form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      border-bottom: 1px solid $border-color-gray-2;
      &:last-child {
        border-bottom: none;
      }
      .input-custom-container {
        width: 48%;
      }
    }

    &__button {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      button {
        width: 47%;
        padding: 10px;
      }
    }

    &__room {
      padding-top: 15px;
      p {
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
}
</style>

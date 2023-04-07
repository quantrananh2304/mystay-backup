<template>
  <div class="guest-detail-additional-questions">
    <div
      v-for="(v, index) in $v.additionalQuestions.$each.$iter"
      :key="index"
      class="guest-detail__guest-info__question"
    >
      <MystaysInput
        v-if="isShowInput(v.$model.answer_type)"
        v-model="v.answer.text.$model"
        item-type="textarea"
        class="mt-4 mb-0"
        :label="`${v.$model.question} ${requireText(v.answer.$model.required)}`"
        :name="v.$model.answer_type + index"
        :error-message="errorMessage(v)"
        :max-length="v.$model.settings.answer_length"
      />
      <div v-if="isShowSelector(v.$model.answer_type)">
        <label class="mt-3" :class="{ 'error-label': errorMessage(v) }">
          {{ v.$model.question }}
          {{ requireText(v.answer.$model.required) }}
        </label>
        <AppSelectDesktop
          v-if="v.$model.answer_type === 'time' && !isMobile"
          class="height-42"
          :list-options="
            getTimeArray(
              v.$model.settings.started_at,
              v.$model.settings.ended_at,
              v.$model.settings.time_interval_value
            )
          "
          :selected-value="v.answer.text.$model"
          :is-error="!!errorMessage(v)"
          :placeholder="'---'"
          @onClickItem="(val) => selectTime(val, index)"
        />
        <AppSelectDesktop
          v-if="v.$model.answer_type === 'options' && !isMobile"
          class="height-42"
          :list-options="optionLangSelector(v.$model.settings.answer_options)"
          :selected-value="v.answer.text.$model"
          :is-error="!!errorMessage(v)"
          :placeholder="'---'"
          @onClickItem="(val) => selectTime(val, index)"
        />

        <select
          v-if="v.$model.answer_type === 'time' && isMobile"
          v-model="v.answer.text.$model"
          :class="{ 'border-error': !!errorMessage(v) }"
        >
          <option value="" disabled selected>
            ---
          </option>
          <option
            v-for="item in getTimeArray(
              v.$model.settings.started_at,
              v.$model.settings.ended_at,
              v.$model.settings.time_interval_value
            )"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </option>
        </select>

        <select
          v-if="v.$model.answer_type === 'options' && isMobile"
          v-model="v.answer.text.$model"
          :placeholder="'---'"
          :class="{ 'border-error': !!errorMessage(v) }"
        >
          <option value="" disabled selected>
            ---
          </option>
          <option
            v-for="item in optionLangSelector(v.$model.settings.answer_options)"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </option>
        </select>

        <p v-if="errorMessage(v)" class="error-message">
          {{ errorMessage(v) }}
        </p>
      </div>
    </div>
    <div v-if="notifications.length" class="notification">
      <div class="notification-facility font-weight-bold mb-2">
        {{ $t('guest_detail.notification_from_the_facility') }}
      </div>
      <div v-for="notification in notifications" :key="notification.id">
        <p class="notification-text">
          {{ notification.question }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { requiredIf } from 'vuelidate/lib/validators'
import Moment from 'moment'
export default {
  name: 'AdditionalQuestions',
  data() {
    return {
      additionalQuestions: []
    }
  },
  computed: {
    ...mapState({
      additionalList: state => state.guestDetail.additionalList,
      additionalParams: state => state.guestDetail.additionalParams
    }),
    notifications() {
      return (
        this.additionalQuestions.filter(
          question => question.question_type === 'notification'
        ) || []
      )
    }
  },
  validations: {
    additionalQuestions: {
      $each: {
        answer: {
          text: {
            required: requiredIf(function(item) {
              return item.required
            })
          }
        }
      }
    }
  },
  watch: {
    additionalList(additionalList) {
      if (this.additionalParams?.length) {
        this.additionalQuestions = this.additionalParams
      } else {
        this.initAdditionalList(JSON.parse(JSON.stringify(additionalList)))
      }
    }
  },
  methods: {
    initAdditionalList(additionalList) {
      const additionalListMapping = additionalList.map((item) => {
        const required = item.labels?.[0]?.includes('true') || false
        item.answer = {
          text: '',
          required
        }

        return item
      })

      this.additionalQuestions = additionalListMapping
    },

    isShowSelector(type) {
      if (type === 'options' || type === 'time') {
        return true
      }
      return false
    },
    isShowInput(type) {
      if (type === 'text') {
        return true
      }
      return false
    },
    getTimeArray(start, end, timeInterval) {
      const startTime = Moment(start, 'HH:mm')
      const endTime = Moment(end, 'HH:mm')
      if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day')
      }
      const timeArray = []
      // eslint-disable-next-line no-unmodified-loop-condition
      while (startTime <= endTime) {
        timeArray.push({
          text: new Moment(startTime).format('HH:mm'),
          value: new Moment(startTime).format('HH:mm')
        })
        startTime.add(timeInterval, 'minutes')
      }
      return timeArray
    },
    optionLangSelector(options) {
      const listOptions = options[this.$langFormat(this.$i18n.locale)]
      const optionLang = []
      for (const item of listOptions) {
        optionLang.push({
          text: item.text,
          value: item.text
        })
      }
      return optionLang
    },
    selectTime(value, index) {
      this.$v.additionalQuestions.$model[index].answer.text = value
    },

    requireText(isRequired) {
      if (isRequired) {
        return `(${this.$t('forms.required')})`
      }

      return `(${this.$t('guest_detail.optional')})`
    },

    errorMessage(v) {
      if (!v.answer.text.required && v.answer.text.$dirty) {
        return this.$t('forms.required')
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.guest-detail {
  &__guest-info {
    &__question {
      margin-bottom: 10px;
    }
  }

  .notification {
    color: #1a489c;
    margin-bottom: 20px;
    margin-top: 20px;

    @include min-sm {
      margin-bottom: 0;
    }

    &-facility {
      font-size: 14px;

      @include min-sm {
        font-size: 15px;
      }
    }

    &-text {
      margin-bottom: 8px;
      color: #1a489c;
      font-size: 13px;

      @include min-sm {
        font-size: 15px;
      }
    }
  }

  select {
    width: 100%;
    padding-left: 15px;
    outline: none;
    font-size: 15px;
    border: 1px solid #d1d1d1;
    cursor: pointer;
    border-radius: 3px;
    background: white;
    height: 42px;
  }

  .border-error {
    border: 1px solid red;
  }

  select:required:invalid {
    color: gray;
  }
  option[value=''][disabled] {
    display: none;
  }
  option {
    color: black;
  }
}
label {
  font-size: 13px;
  color: $text-color-blue;
  margin-bottom: 3px;
  font-weight: bold;
}
.error-message,
.error-label {
  color: red;
}

.error-message {
  font-size: 15px;
}

select::-ms-expand {
  display: none;
}
</style>

<template>
  <div class="calander-input">
    <label class="calander-input__label" :for="inputName">{{ label }}</label>
    <input
      id="calendar-input"
      v-model="inputValue"
      :name="inputName"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    >
    <label
      class="calander-input__value"
      :class="{ 'disable-bg': disabled }"
      :for="disabled ? '' : 'calendar-input'"
    >
      {{ dateFormat }}
    </label>
  </div>
</template>
<script>
import mobiscroll from '@mobiscroll/javascript'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'CalendarInput',
  props: {
    inputName: {
      type: String,
      default: 'birth_day'
    },
    label: {
      type: String,
      default: 'Birth Day'
    },
    type: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean
    },
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String
    }
  },
  data() {
    return {
      inputValue: this.value
    }
  },
  computed: {
    ...mapGetters({
      language: 'appHeader/language'
    }),

    dateFormat() {
      return this.$dateTime(
        this.inputValue,
        this.$langFormat(this.$i18n.locale),
        true
      )
    }
  },
  watch: {
    language(lang) {
      this.renderCalendar(lang)
    }
  },
  mounted() {
    this.renderCalendar(this.language)
  },
  methods: {
    renderCalendar(lang = 'en') {
      mobiscroll.calendar('#calendar-input', {
        max: new Date(),
        lang,
        theme: 'windows',
        dateFormat: 'yyyy-mm-dd',
        onSet: (_ev, inst) => {
          this.inputValue = moment(inst.getVal(), 'YYYY-MM-DD').format(
            'YYYY-MM-DD'
          )
          this.$emit('input', this.inputValue)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.calander-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  &__label {
    font-size: 13px;
    color: $text-color-blue;
    margin-bottom: 3px;
    height: 19px;
    font-weight: bold;
  }
  input {
    border: 1.5px solid $border-color-gray-2;
    height: 50px;
    padding: 15px;
    cursor: pointer;
    &:disabled {
      background: #ccd4da;
      border: 1px solid #ccd4da;
      cursor: initial;
    }
  }

  &__value {
    position: absolute;
    left: 5px;
    top: 26px;
    z-index: 10;
    background: white;
    padding: 10px 30px 10px 10px;
    cursor: pointer;
  }

  .disable-bg {
    background: #ccd4da;
    cursor: initial;
    color: #626568;
  }
}
</style>

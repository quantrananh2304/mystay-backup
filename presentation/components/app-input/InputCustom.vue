<template>
  <div class="input-custom-container page">
    <div
      class="input-custom"
      :class="{
        'error-validate': validations && validations.$error,
        required: !isRequired,
      }"
    >
      <label :for="inputName">{{ label }}</label>
      <input
        v-if="inputName != 'textarea' && inputName != 'phone'"
        ref="input"
        :name="inputName"
        :value="(validations && validations.$model) || value"
        :type="type"
        :data-index="dataIndex"
        :placeholder="placeholder"
        :disabled="disabled"
        @focus="$emit('focus', $event.target)"
        @input="$emit('input', $event.target)"
        @keypress.enter="$emit('enter', $event.target)"
      >
      <PhoneCodeDropdown
        v-else-if="inputName == 'phone'"
        :name="inputName"
        :value="validations && validations.$model"
        :type="type"
        :is-error="validations && validations.$error"
        :data-index="dataIndex"
        :placeholder="placeholder"
        @on:input="phoneCodeInput"
        @keypress="(e) => onlyPhoneNumberInput(e, inputName)"
      />
      <textarea
        v-else-if="inputName == 'textarea'"
        ref="input"
        :name="inputName"
        :value="(validations && validations.$model) || value"
        :type="type"
        :data-index="dataIndex"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @focus="$emit('focus', $event.target)"
        @input="$emit('input', $event.target)"
      />
      <span :class="icon" @click="showPassword" />
    </div>
    <slot />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
// eslint-disable-next-line node/no-deprecated-api
import { isNullOrUndefined } from 'util'
import PhoneCodeDropdown from '../phone-code-dropdown/PhoneCodeDropdown'
import { onlyPhoneNumber } from '~/utils/validations/phoneNumber'

export default {
  components: {
    PhoneCodeDropdown
  },
  props: {
    value: {
      type: String
    },
    dataIndex: {
      type: Number
    },
    label: {
      type: String,
      default: 'Label null'
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ' '
    },
    inputName: {
      type: String
    },
    validations: {
      type: Object
    },
    disabled: {
      type: Boolean
    },
    maxlength: {
      type: Number
    }
  },
  computed: {
    isRequired() {
      return isNullOrUndefined(this.validations && this.validations.required)
    }
  },
  methods: {
    showPassword() {
      this.$refs.input.type =
        this.$refs.input.type === 'password' ? 'text' : this.type
    },
    phoneCodeInput(target) {
      this.$emit('input', target)
    },

    onlyPhoneNumberInput(e, name) {
      if (name === 'phone') {
        return onlyPhoneNumber(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-custom-container {
  width: 100%;
  margin-bottom: 22px;
  .input-custom {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    label {
      font-size: 13px;
      color: $text-color-blue;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      border: 1.5px solid $border-color-gray-2;
      height: 50px;
      padding: 15px;
      &:disabled {
        background: #ccd4da;
        border: 1px solid #ccd4da;
      }
    }
    textarea {
      border: 1.5px solid $border-color-gray-2;
      border-radius: 5px;
      padding: 10px;
    }
    span {
      font-size: 27px;
      left: 15px;
      cursor: pointer;
      color: $text-color-blue;
      position: absolute;
      top: calc(50% - 3px);
    }
    .iconOnTheRight {
      position: absolute;
      right: 15px;
      left: auto;
    }
  }
  .error-validate {
    input {
      border: 1.5px solid red;
    }
    label {
      color: red;
    }
  }
}
.required {
  &::after {
    content: "";
    z-index: 1;
    right: 3px;
    bottom: 3px;
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 5px solid #ffd25d;
    border-right: 5px solid #ffd25d;
    transform: rotate(90deg);
  }
}
</style>

<template>
  <div class="mystays-input">
    <label :class="{ error: !!errorMessage }">{{ label }}</label>

    <input
      v-if="itemType === 'text'"
      :value="value"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxLength"
      :class="{ 'border-error': !!errorMessage }"
      @keyup="onKeyup"
      @keyup.enter="onEnter"
      @keypress="onKeyPress"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @mouseover="onHover"
      @mouseleave="onLeave"
    >
    <textarea
      v-if="itemType === 'textarea'"
      :value="value"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxLength"
      :class="{ 'border-error': !!errorMessage }"
      @keyup="onKeyup"
      @keyup.enter="onEnter"
      @keypress="onKeyPress"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @mouseover="onHover"
      @mouseleave="onLeave"
    />
    <div v-if="itemType === 'textarea'" class="mystays-input__count-text">
      {{ value.length }} / {{ maxLength }}
    </div>
    <span
      v-if="password && value"
      class="iconOnTheRight"
      :class="{
        'icon-eye-blocked': inputType === 'text',
        'icon-Icon-Virtual-Tour': inputType === 'password',
      }"
      @click="showPassword"
    />
    <slot name="spinner" />
    <span
      v-if="required"
      class="icon-Icon-Required mystays-input__required-icon"
    />
    <span v-if="errorMessage" class="mystays-input__err-msg">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'AppInput',
  props: {
    value: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    itemType: {
      type: String,
      default: 'text'
    },
    maxLength: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      isFocused: false,
      phoneCode: '',
      inputType: this.type
    }
  },
  methods: {
    onKeyup(e) {
      this.$emit('keyup', e)
    },
    onInput(e) {
      this.$emit('input', e.target.value)
    },
    onToggleEyes() {
      this.$emit('onToggleEyes')
    },
    onKeyPress(e) {
      this.$emit('keypress', e)
    },

    onFocus(e) {
      this.$emit('focus', e)
    },

    onBlur(e) {
      this.$emit('blur', e)
    },

    onClose() {
      this.$emit('close')
    },

    onEnter() {
      this.$emit('enter')
    },

    onHover() {
      this.hover = true
    },
    onLeave() {
      this.hover = false
    },

    showPassword() {
      if (this.inputType === 'text') {
        this.inputType = 'password'
      } else {
        this.inputType = 'text'
      }
    }
  }
})
</script>

<!-- Add 'scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mystays-input {
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  &__err-msg {
    color: red;
    font-size: 15px;
  }
  label {
    font-size: 13px;
    color: $text-color-blue;
    margin-bottom: 3px;
    font-weight: bold;
  }

  [class^='icon-'],
  [class*=' icon-'],
  &__slot {
    position: absolute;
    font-size: 22px;
    left: 15px;
    top: 35px;
  }

  input {
    border: 1.5px solid $border-color-gray-2;
    height: 50px;
    padding: 15px 10px;

    & ~ [class^='icon-'],
    [class*=' icon-'] {
      font-size: 27px;
      right: 20px;
      left: auto;
      cursor: pointer;
      color: $text-color-blue;
    }

    & ~ .mystays-input__required-icon[class^='icon-'],
    & ~ .mystays-input__required-icon[class*=' icon-'] {
      font-size: 10px;
      top: 59px;
      right: 3px;
      color: $text-color-yellow;
    }
    &:disabled {
      background-color: #ccd4da;
    }
  }

  .border-error {
    border: 1px solid red;
  }

  textarea {
    border: 1px solid $border-color-gray-2;
    border-radius: 3px;
    width: 100%;
    padding: 8px 10px;
    height: 70px;
  }

  &__count-text {
    position: absolute;
    right: 10px;
    top: 65px;
    font-size: 13px;
  }

  &__phone {
    position: relative;
    z-index: 1;

    input {
      width: 100%;
      padding-left: 70px;
    }

    & ~ .mystays-input__required-icon[class^='icon-'],
    & ~ .mystays-input__required-icon[class*=' icon-'] {
      left: auto;
      font-size: 10px;
      top: 59px;
      right: 3px;
      color: $text-color-yellow;
      z-index: 1;
    }
  }

  .iconOnTheRight {
    position: absolute;
    right: 15px;
    left: auto;
    cursor: pointer;
  }

  .icon-eye-blocked {
    opacity: 0.8;
  }
}

input[type='password']::-ms-reveal,
input[type='password']::-ms-clear {
  display: none;
}
</style>

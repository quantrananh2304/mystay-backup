<template>
  <div class="app-select" :class="{ 'is-vertical': isVerticalDropdown, 'has-error': hasError }">
    <select
      :id="selectId"
      ref="select"
      v-model="selectedOption"
      class="app-select"
      :class="{ 'fix-pd': fixPadding }"
      :disabled="disabled"
      @change="$_changeOption"
      @focus="$_focus"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <span class="icon-Icon-Required" />
    <span class="app-select__icon">
      <slot />
    </span>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */

export default {
  name: 'AppSelect2',
  props: {
    isVerticalDropdown: {
      type: Boolean
    },
    options: {
      type: Array,
      default: () => []
    },
    selectId: {
      type: String
    },
    labelText: {
      type: String
    },
    placeHolder: {
      type: String
    },
    defaultValue: {
      type: String,
      default: () => null
    },
    fixPadding: {
      type: String,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      hasError: false,
      selectedOption: this.defaultValue
    }
  },
  methods: {
    $_changeOption(e) {
      this.hasError = false
      this.$emit('input', e.target.value)
    },
    $_focus() {
      this.hasError = !this.selectedOption
      this.$emit('focus')
    }
  }
}
</script>
<style lang="scss" scoped>
.app-select {
  position: relative;
  //   width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  &.is-vertical {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 22px;

    label {
      margin-bottom: 5px;
      line-height: 17px;
    }

    [class^="icon-Arrow-Affordance"],
    [class*=" icon-Arrow-Affordance"] {
      top: auto;
      bottom: 13px;
    }

    select {
      width: 100%;
      padding-left: 20px;
    }
  }

  @include min-sm {
    flex-direction: column;
    align-items: center;
  }

  label {
    margin-bottom: 15px;

    @include min-sm {
      margin-bottom: 0;
    }
  }

  select {
    border: 2px solid $border-color-gray-2;
    background: $white;
    padding: 10px 20px 12px 45px;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 100%;

    &::-ms-expand {
      display: none;
    }

    option {
      width: 100%;
    }

    @include min-sm {
      width: 100px;
    }
  }

  .fix-pd {
    padding: 10px 20px 12px 27px;
  }

  [class^="icon-"],
  [class*=" icon-"] {
    position: absolute;
    top: 66%;
    transform: translateY(-50%);
    right: 20px;
    color: $text-color-gray-9;
    font-size: 11px;

    @include min-sm {
      top: 50%;
    }
  }

  [class^="icon-Icon-Required"],
  [class*=" icon-Icon-Required"] {
    font-size: 10px;
    top: auto;
    bottom: -2px;
    right: 3px;
    color: #ffd25d;
  }

  &__icon {
    position: absolute;
    top: 14px;
    left: 17px;

    @include min-sm {
      //   right: 258px;
      top: 26px;
      left: 10px;
      transform: translateY(-50%);
    }

    [class^="icon-"],
    [class*=" icon-"] {
      color: $text-color-blue;
      font-size: 18px;
      position: static;
      transform: translate(0);
    }
  }
}
</style>

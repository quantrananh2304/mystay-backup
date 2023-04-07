<template>
  <div
    class="app-select is-vertical"
    :class="{ 'has-error': validations ? validations.$error : false }"
  >
    <label class="is-bold">{{ labelText }}</label>
    <select v-model="selected" @change="$_changeOption">
      <option v-if="defaultSelectedProps" disabled value>
        {{ defaultSelectedProps }}
      </option>
      <option v-for="(item, itemIdx) in data" :key="itemIdx" :value="item">
        {{ item }}
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
  name: 'SelectCustom',
  props: {
    defaultSelectedProps: {
      type: String
    },
    validations: {
      type: Object
    },
    labelText: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => ['A', 'B', 'C']
    }
  },
  data() {
    return {
      defaultSelected: '',
      selected: ''
    }
  },
  methods: {
    $_changeOption(e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-select {
  position: relative;
  width: 100%;
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

    [class^='icon-Arrow-Affordance'],
    [class*=' icon-Arrow-Affordance'] {
      top: auto;
      bottom: 13px;
    }

    select {
      width: 100%;
      padding-left: 20px;
    }
  }

  @include min-sm {
    flex-direction: row;
    align-items: center;
  }

  label {
    font-size: 13px;
    color: #232e48;
    height: 19px;
    font-weight: bold;
    margin-bottom: 3px;

    @include min-sm {
      margin-bottom: 0;
    }
  }

  select {
    border: 1.5px solid $border-color-gray-2;
    background: $white;
    padding: 12px 20px 12px 50px;
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
      border: 1px solid $border-color-gray-2;
      width: 295px;
    }
  }

  [class^='icon-'],
  [class*=' icon-'] {
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

  [class^='icon-Icon-Required'],
  [class*=' icon-Icon-Required'] {
    font-size: 10px;
    top: auto;
    bottom: -2px;
    right: 3px;
    color: #ffd25d;
  }

  &__icon {
    position: absolute;
    right: 13px;
    left: auto;
    top: 37px;

    [class^='icon-'],
    [class*=' icon-'] {
      color: $text-color-blue;
      font-size: 13px;
      position: static;
      transform: translate(0);
    }
  }
}

.has-error {
  label {
    color: red;
  }
  select {
    border: 1.5px solid red;
  }
}
</style>

<template>
  <div class="app-select-desktop">
    <div class="app-select-desktop__input">
      <input
        v-model="selectItem"
        type="text"
        :class="{ 'border-error': isError }"
        :placeholder="selectedValue || placeholder"
        :readonly="!isAutoComplete"
        :disabled="isDisable"
        @click="onShowListItem"
        @focus="onShowListItem"
        @blur="onHideListItem"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
        @keyup="onKeyup"
      >
      <span
        :class="`icon-Arrow-xSmall-Up ${
          isShowListItem ? 'rotate-arrow-up' : 'rotate-arrow-down'
        }`"
        @click="onShowListItem"
      />
    </div>
    <ul
      v-if="isShowListItem"
      ref="listItem"
      class="app-select-desktop__list-item"
    >
      <li
        v-for="(option, index) in listSelectOptions"
        :key="index"
        class="app-select-desktop__list-item__item"
        :class="{
          'app-select-desktop__list-item--active': currentItem === index,
        }"
        @mouseover="onMouseoverItem(index)"
        @mouseout="onMouseoutItem(index)"
        @click="onClickItem(index)"
      >
        {{ option.text || option }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppSelectDesktop',
  props: {
    listOptions: {
      type: Array,
      default: () => []
    },
    selectedValue: {
      type: String,
      default: ''
    },
    isDisable: {
      type: Boolean,
      default: false
    },
    isAutoComplete: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectItem: '',
      isShowListItem: false,
      currentItem: 0,
      isMouseover: false,
      optionValue: this.selectedValue,
      scorllToItem: 0,
      isScrollToDone: false,
      listSelectOptions: this.listOptions
    }
  },
  watch: {
    listOptions(listOptions) {
      this.getDefaultValue(listOptions)
      this.listSelectOptions = listOptions
    },
    isShowListItem(isShow) {
      if (!isShow) {
        this.isMouseover = false
      }
    },
    selectedValue(value) {
      this.optionValue = value
      this.getDefaultValue(this.listSelectOptions)
      this.$emit('onClickItem', this.optionValue)
      this.isShowListItem = false
      this.getOptionIndex()
    }
  },
  mounted() {
    this.getDefaultValue(this.listSelectOptions)
    this.getOptionIndex()
    document.addEventListener('click', this.handleClickOutside)
  },

  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    onShowListItem() {
      if (this.isAutoComplete) {
        this.selectItem = ''
        this.listSelectOptions = this.listOptions
      }
      if (!this.isDisable) {
        this.isShowListItem = true
        this.getOptionIndex()
        setTimeout(() => {
          if (38 * (this.currentItem + 1) > 200) {
            this.$refs.listItem.scrollTo({
              top: 38 * this.currentItem,
              left: 0
            })
          }
          this.isScrollToDone = true
        }, 10)
      }
    },

    onKeyup(e) {
      if (this.isAutoComplete) {
        this.listSelectOptions = this.listOptions.filter(
          option =>
            option?.text
              ?.toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            option?.value?.toLowerCase().includes(e.target.value.toLowerCase())
        )
      }
    },

    onHideListItem() {
      this.scorllToItem = 0
      if (!this.isMouseover) {
        this.isShowListItem = false
      }
    },

    onArrowDown(e) {
      e.preventDefault()
      this.currentItem += 1
      if (this.currentItem >= this.listSelectOptions.length) {
        this.currentItem = this.listSelectOptions.length - 1
      }

      if (38 * (this.currentItem + 1) > 200) {
        this.$refs.listItem.scrollTo({
          top: 38 * this.currentItem,
          left: 0,
          behavior: 'smooth'
        })
      }
    },

    onMouseoverItem(index) {
      if (this.isScrollToDone) {
        this.currentItem = index
        this.isMouseover = true
      }
    },

    onMouseoutItem() {
      this.isMouseover = false
    },

    onClickItem(index) {
      this.currentItem = index
      this.onEmitSelectValue()
    },

    onArrowUp(e) {
      this.scorllToItem = 0
      e.preventDefault()
      this.currentItem -= 1
      if (this.currentItem <= 0) {
        this.currentItem = 0
      }

      this.$refs.listItem.scrollTo({
        top: 38 * this.currentItem,
        left: 0
      })
    },

    onEnter() {
      this.onEmitSelectValue()
    },

    getDefaultValue(listOptions) {
      this.selectItem =
        listOptions.find(item => item.value === this.optionValue) &&
        listOptions.find(item => item.value === this.optionValue).text
    },

    onEmitSelectValue() {
      this.selectItem = this.listSelectOptions[this.currentItem]?.text
      this.optionValue = this.listSelectOptions[this.currentItem]?.value
      this.$emit('onClickItem', this.optionValue)
      this.$emit('input', this.optionValue)
      this.isShowListItem = false
      this.getOptionIndex()
    },

    getOptionIndex() {
      this.listSelectOptions.forEach((option, optionIndex) => {
        if (option.value == this.optionValue) {
          this.currentItem = optionIndex
        }
      })
    },

    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isShowListItem = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-select-desktop {
  position: relative;
  width: 100%;
  &__input {
    height: 100%;
    input {
      height: 100%;
      width: 100%;
      padding-left: 15px;
      outline: none;
      font-size: 15px;
      border: 1px solid #d1d1d1;
      cursor: pointer;
      border-radius: 3px;
      background: white;
      &:disabled {
        background: #ccd4da;
      }
    }

    .border-error {
      border: 1px solid red;
    }

    span {
      position: absolute;
      right: 10px;
      top: 44%;
      font-size: 11px;
      color: gray;
    }

    .rotate-arrow-up {
      transform: rotate(360deg);
      transition: 0.2s;
    }

    .rotate-arrow-down {
      transform: rotate(180deg);
      transition: 0.2s;
    }
  }
  &__list-item {
    position: absolute;
    width: 100%;
    left: 0;
    background: white;
    z-index: 3;
    margin-bottom: 20px;
    box-shadow: 2px 3px 14px 0 rgba(74, 74, 74, 0.25);
    max-height: 200px;
    overflow-y: auto;
    @include scrollbar;

    &__item {
      padding: 8px 15px;
      font-size: 15px;
      cursor: pointer;
    }

    &--active {
      background: lightgray;
    }
  }
}
</style>

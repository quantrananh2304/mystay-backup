<template>
  <div>
    <div v-show="!isCalendarShow" class="calendar-loading-container">
      <CalendarLoader />
    </div>

    <div v-show="isCalendarShow">
      <div class="calendar-desktop" />

      <div
        v-if="isMobile"
        class="calendar__bottom"
        :class="{
          'ios-safari-padding':
            detectIOS() && detectIphoneModel() && !isToolbarOpen,
          'smaller-model': detectIOS() && !detectIphoneModel() && !isToolbarOpen
        }"
      >
        <div class="calendar__bottom__note">
          <span class="selected">{{ getLang.selected }}</span>
          <span class="not-available">{{ getLang.notAvailable }}</span>
          <span class="minimum">{{ getLang.minimunStay }}</span>
        </div>

        <div class="calendar__bottom__btn">
          <div id="startDate" class="button" @click="datePicker('start')">
            {{
              bookingData.checkIn
                ? getCheckinDate
                : 'Check In' | datetime($langFormat(language), true)
            }}
          </div>

          <div id="endDate" class="button" @click="datePicker('end')">
            {{
              bookingData.checkOut
                ? getCheckoutDate
                : 'Check Out' | datetime($langFormat(language), true)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import CalendarLoader from '../app-loaders/CalendarLoader'
import Calendar from './calendarHelper'

export default Vue.extend({
  name: 'SingleCalendar',
  components: {
    CalendarLoader
  },
  data() {
    return {
      isCalendarShow: false,
      isToolbarOpen: false
    }
  },
  computed: {
    getLang() {
      return {
        selected: this.$t('customhtmlcalendar.selected_date'),
        notAvailable: this.$t('customhtmlcalendar.not_available'),
        minimunStay: this.$t('customhtmlcalendar.minimum_stay'),
        done: this.$t('searchhotel.done')
      }
    }
  },
  watch: {
    isMobile(newValue) {
      if (newValue) {
        this.renderCalendar(this.language, newValue)
      } else {
        this.renderCalendar(this.language)
      }
    }
  },
  methods: {
    datePicker(type) {
      Calendar.datePicker(this, type)
    },

    detectIOS() {
      const isIOS = /iPhone/.test(navigator.userAgent) && !window.MSStream
      let safariAgent = false
      if (isIOS) {
        const userAgentString = navigator.userAgent
        const chromeAgent =
          userAgentString.includes('Chrome') || userAgentString.match('CriOS')
        safariAgent = userAgentString.includes('Safari')

        if (chromeAgent && safariAgent) {
          safariAgent = false
        }
      }

      return safariAgent
    },

    detectIphoneModel() {
      const iHeight = window.screen.height
      const iWidth = window.screen.width
      let isXSMax = false

      if (
        (iWidth === 320 && iHeight === 568) ||
        (iWidth === 375 && iHeight === 667) ||
        (iWidth === 414 && iHeight === 736)
      ) {
        isXSMax = false
      } else {
        isXSMax = true
      }

      return isXSMax
    }
  }
})
</script>

<style lang="scss">
@import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';
.calendar-loading-container {
  width: 100vw;
  height: 100vh;
  transition: 0.3s ease;
  animation-name: mbsc-anim-p-in;
  animation-duration: 0.3s;
  position: relative;
  background: #fff;
  min-height: 450px;

  @include min-sm {
    width: 100%;
    height: auto;
  }
}

.calendar-desktop {
  width: 100%;
  position: relative;
}
.calendar__bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  background: #fff;
  box-shadow: 0 -1px 15px 0 rgba(0, 0, 0, 0.25);
  padding: 15px;

  &__note {
    display: flex;
    margin-bottom: 10px;
    color: #000;
    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      font-size: 11px;
      font-weight: 600;
      &::before {
        content: '';
        width: 10px;
        height: 10px;
        border: 1px solid $bg-color-blue-2;
        margin-right: 10px;
      }
    }
    .selected {
      &::before {
        background-color: $bg-color-blue-2;
      }
    }
    .not-available {
      &::before {
        content: '';
        background: linear-gradient(
          to top left,
          #ddd 0%,
          #ddd calc(50% - 0.8px),
          #000 50%,
          #ddd calc(50% + 0.8px),
          #ddd 100%
        );
      }
    }
    .minimum {
      &::before {
        background: coral;
        border: none;
      }
    }
  }
  &__btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    color: #000;
    .button {
      width: 47%;
      border: 1px solid #ddd;
      padding: 5px 10px;
      text-align: center;
      font-weight: 500;
    }
    .active {
      border: 2px solid #ffd25d;
    }
  }
  &__btn-done {
    width: 100%;
    text-align: center;
    padding: 10px;
    background-color: #ffd25d;
    font-weight: 500;
    text-transform: capitalize;
    color: #000;
  }
}

.ios-safari-padding {
  padding-bottom: calc(10px + 2 * env(safe-area-inset-bottom));
}

.ios-safari-padding-with-toolbar {
  padding-bottom: 70px; // highest in IP
}

.smaller-model {
  padding-bottom: 40px;
}

.smaller-model-with-toolbar {
  padding-bottom: 0;
}

.calendar-mobile {
  .calendar {
    &__header {
      display: block;
      margin-bottom: 10px;

      span {
        padding: 5px 10px;
        border-radius: 2px;
        border: 1px solid #dddee0;
        background-color: #ffffff;
        font-weight: 600;
      }
    }
  }

  .mbsc-fr-overlay {
    display: none;
  }

  .mystays-bookingwidget-header {
    padding-bottom: 10px;

    .days {
      font-size: 15px;
      display: flex;
      justify-content: space-between;

      span {
        font-size: 13px;
        color: #737272;
        display: block;
        text-align: center;
        width: 100%;
      }
    }
  }

  .mbsc-range-btn-t {
    display: none;
  }

  .mbsc-cal-days-c {
    display: none;
  }

  .mbsc-fr-persp {
    height: 100vh !important;
  }

  .mbsc-cal-scroll-c {
    overflow: inherit;
  }

  .mbsc-cal-table {
    height: auto;
  }

  .mbsc-cal-body {
    height: 100vh;
  }

  .mbsc-cal-hdr {
    display: none;
  }

  .mbsc-fr-c {
    background-color: #fff;
  }

  .mbsc-fr-w {
    border: none !important;
    background: none;
  }

  .mbsc-cal-row {
    .mbsc-cal-day {
      &:last-child {
        .mbsc-cal-cell-i {
          border-right: 0.5px solid #ddd;
        }
      }

      .mbsc-cal-cell-i {
        border-bottom: 0.5px solid #ddd;
        border-left: 0.5px solid #ddd;
      }
    }
  }

  .mbsc-cal-row {
    &:first-child {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-top: 0.5px solid #ddd;
        }
      }
    }
  }

  .mbsc-cal-row {
    &:nth-child(2) {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-top: 0.5px solid #ddd;
        }
      }
    }
  }

  .mbsc-cal-row {
    &:last-child {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-right: 0.5px solid #ddd;
        }
      }
    }
  }

  .mbsc-cal-day-last {
    .mbsc-cal-cell-i {
      border-right: 0.5px solid #ddd;
    }
  }
}

.calendar-desktop {
  .note {
    display: flex;
    padding: 0 30px 20px 30px;
    background-color: #fff;
    border-bottom: 4px solid #ffd25d;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      font-size: 11px;
      font-weight: 600;

      &::before {
        content: '';
        width: 10px;
        height: 10px;
        margin-right: 10px;
      }
    }

    .selected {
      &::before {
        border: 1px solid $bg-color-blue-2;
        background-color: $bg-color-blue-2;
      }
    }

    .not-available {
      &::before {
        content: '';
        border: 1px solid $bg-color-blue-2;
        background: linear-gradient(
          to top left,
          #ddd 0%,
          #ddd calc(50% - 0.8px),
          #000 50%,
          #ddd calc(50% + 0.8px),
          #ddd 100%
        );
      }
    }
    .minimum {
      &::before {
        content: '';
        background: coral;
      }
    }
  }

  .mbsc-ic::before {
    // content: "";
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px 10px;
  }

  .mbsc-range-btn-t {
    display: none;
  }

  .mbsc-fr-overlay {
    display: none;
  }

  .mbsc-fr-c {
    background-color: #fff;
    padding: 20px 20px 0 20px;
  }

  .mbsc-cal-row {
    .mbsc-cal-day {
      &:last-child {
        .mbsc-cal-cell-i {
          border-right: 0.5px solid #ddd;
        }
      }

      .mbsc-cal-cell-i {
        border-bottom: 0.5px solid #ddd;
        border-left: 0.5px solid #ddd;
      }
    }

    &:first-child {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-top: 0.5px solid #ddd;
        }
      }
    }

    &:nth-child(2) {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-top: 0.5px solid #ddd;
        }
      }
    }

    &:last-child {
      .mbsc-cal-day {
        .mbsc-cal-cell-i {
          border-right: 0.5px solid #ddd;
        }
      }
    }

    .mbsc-disabled {
      .mbsc-cal-day-i {
        background: linear-gradient(
          to top left,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) calc(50% - 0.8px),
          #ddd 50%,
          rgba(0, 0, 0, 0) calc(50% + 0.8px),
          rgba(0, 0, 0, 0) 100%
        );
      }
    }
  }

  .mbsc-cal-day-last {
    .mbsc-cal-cell-i {
      border-right: 0.5px solid #ddd;
    }
  }

  .animate {
    transition: left 0.3s ease-out;
  }

  .mystays-hover-intermediate {
    background: rgba(26, 72, 156, 0.8);
    color: #fff;
  }

  .mbsc-cal-table {
    .mbsc-cal-row {
      &:first-child {
        .mbsc-cal-day {
          .mbsc-cal-cell-i {
            border-bottom: none;
          }
        }
      }
    }
  }
}

.mbsc-cal-txt,
.mbsc-cal-txt-ph,
.mbsc-cal-txt-more {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.mbsc-windows .mbsc-cal-txt {
  border: 1px solid $bg-color-blue-2;
  color: #fff;
  background: none;
}

.mbsc-windows .mbsc-cal-day:not(.mbsc-disabled):hover {
  .mbsc-cal-day-i {
    @media (min-width: 1200px) {
      background: rgba(26, 72, 156, 1) !important;
      color: #fff;
    }
  }
}

.mbsc-windows
  .mbsc-cal
  .mbsc-cal-day.mbsc-selected:not(.mbsc-disabled)
  .mbsc-cal-cell-i.mbsc-cal-day-i,
.mbsc-windows.mbsc-range
  .mbsc-cal
  .mbsc-cal-today.mbsc-cal-day-hl
  .mbsc-cal-day-date {
  background-color: #1a4699;
  color: #fff;
}

.mbsc-windows .mbsc-cal-day-date {
  line-height: 2.8em;
}

.mystays-custom-invalid {
  cursor: not-allowed;
  position: relative;
  pointer-events: none;

  .mbsc-cal-day-i {
    background: linear-gradient(
      to top left,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0) calc(50% - 0.8px),
      #ddd 50%,
      rgba(0, 0, 0, 0) calc(50% + 0.8px),
      rgba(0, 0, 0, 0) 100%
    );

    .mbsc-cal-day-date {
      opacity: 0.2;
    }
  }
}

.mbsc-selected {
  .mbsc-cal-day-i {
    .mbsc-cal-day-date {
      opacity: 1 !important;
    }
  }
}

.open-invalid {
  pointer-events: all;
  cursor: pointer;

  .mbsc-cal-day-i {
    border: 0.5px solid #000 !important;
  }
  .mbsc-cal-day-date {
    opacity: 1 !important;
  }
}

.tool-tip {
  animation-name: mbsc-anim-p-in;
  animation-duration: 0.5s;
  width: 86px;
  height: 35px;
  text-align: center;
  padding-top: 6px;
  background: #232e48;
  color: #fff;
  position: absolute;
  bottom: calc(100% + 15px);
  right: -20px;
  border: 1px solid #232e48;
  border-radius: 2px;
  z-index: 3;
  &::after {
    content: '';
    width: 14px;
    height: 14px;
    position: absolute;
    background: #232e48;
    bottom: -7px;
    left: 35px;
    z-index: -1;
    transform: rotate(45deg);
  }
}

.tool-tip-show-bottom {
  animation-name: mbsc-anim-p-in;
  animation-duration: 0.5s;
  width: 86px;
  height: 35px;
  text-align: center;
  padding-top: 6px;
  background: #232e48;
  color: #fff;
  position: absolute;
  top: calc(100% + 15px);
  right: -20px;
  border: 1px solid #232e48;
  border-radius: 2px;
  z-index: 3;
  &::after {
    content: '';
    width: 14px;
    height: 14px;
    position: absolute;
    background: #232e48;
    top: -7px;
    left: 35px;
    z-index: -1;
    transform: rotate(45deg);
  }
}

.tool-tip-right {
  right: -5px;
  &::after {
    left: 55px;
  }
}

.tool-tip-left {
  right: -35px;
  &::after {
    left: 15px;
  }
}

.inventory {
  position: absolute;
  right: 0;
  top: 0;
  width: 12px;
  height: 12px;
  display: flex;
  background: coral;
  font-size: 10px;
  justify-content: center;
  color: #fff;
  align-items: center;
  line-height: 2.2;
  animation-name: mbsc-anim-inventory-in;
  animation-timing-function: ease-out;
  animation-duration: 0.5s;
  z-index: 2;
}
</style>

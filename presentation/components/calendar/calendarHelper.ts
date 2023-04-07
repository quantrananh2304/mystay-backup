import moment, { Moment } from 'moment'
import { convertTime } from '@/shared/helper/fetchWithCache'
import { IGetAvailability } from '~/apiTripla/calendar'
import { currencyHelper } from '~/shared/helper/CurrencyHelper'
interface OnSetEvent {
  valueText: String
}

const getNightNumber = (night: number, self: any) => {
  if (!self) return
  if (night === 0) {
    return self.$t('hoteldetail.day')
  } else if (night === 1) {
    return self.$t('customhtmlcalendar.numner_night', {
      night: 1
    })
  }
  return self.$t('customhtmlcalendar.numner_nights', {
    night: night
  })
}

let Calendar: any = {
  configDefault: {
    theme: 'windows',
    toText: '',
    buttons: [],
    fromText: '',
    animate: 'pop',
    min: new Date(),
    yearChange: false,
    display: 'inline',
    minRange: 86400000,
    showSelector: true,
    controls: ['calendar'],
    outerMonthChange: false,
    closeOnOverlayTap: false,
    dateFormat: 'yy-mm-dd'
  },
  mobileConfig: {
    months: 1,
    context: 'body',
    layout: 'liquid',
    calendarScroll: 'vertical',
    cssClass: 'calendar-mobile',
    scrollLock: false
  },
  desktopConfig: {
    months: 2,
    calendarScroll: 'horizontal',
    cssClass: 'calendar-desktop',
    context: '.calendar-desktop'
  },
  text: null,
  inventory: [],
  invalidDate: [],
  availableDate: [],
  isSetDate: false,
  disableDate: null,
  isCalledAPI: false,
  calledDate: '',
  monthCalled: [],
  onBeforeShow: (event: any, inst: any) => {
    const calendar = document.getElementById('custom-calendar')
    if (calendar) {
      const scrollTop = document.documentElement.scrollTop
      const top = calendar.getBoundingClientRect().top
      window.scroll({ top: top + scrollTop - 360, left: 0, behavior: 'smooth' }) // 350 = header height
    }
  },
  getCurrentMonth: (inst: any) => {
    const totalMonth = inst.markup.querySelectorAll(
      '.mbsc-cal-day-picker .mbsc-cal-table'
    )
    const currentMonths = [totalMonth[1], totalMonth[2]]
    return currentMonths
  },
  getCurrentDays: (inst: any) => {
    const currentMonths = Calendar.getCurrentMonth(inst)
    let currentDays: any = []

    currentMonths.map((item: any) => {
      currentDays = [
        ...currentDays,
        ...item.querySelectorAll(
          '.mbsc-cal-row .mbsc-cal-cell:not(.mbsc-disabled)'
        )
      ]
    })

    return currentDays
  },
  getInvalidDays: (inst: any) => {
    const currentMonths = Calendar.getCurrentMonth(inst)
    let invalidDays: any = []

    currentMonths.map((item: any) => {
      invalidDays = [
        ...invalidDays,
        ...item.querySelectorAll(
          '.mbsc-cal-row .mbsc-cal-day:not(.mystays-selected-date):not(.mbsc-disabled):not(.mystays-custom-invalid):not([aria-hidden="true"]'
        )
      ]
    })

    return invalidDays
  },
  showToolTip: (inst: any, self: any, endVal?: string) => {
    Calendar.self = self
    const startDate = inst.startVal
    const endDate = endVal || inst.endVal || startDate
    const totalMonth = inst.markup.querySelectorAll(
      '.mbsc-cal-day-picker .mbsc-cal-table'
    )
    const currentMonths = [totalMonth[1], totalMonth[2]]
    let listDate: any = []
    currentMonths.map((item: any) => {
      listDate = [
        ...listDate,
        ...item.querySelectorAll('.mbsc-cal-row .mbsc-cal-cell')
      ]
    })

    let toolTipContainer: any

    listDate.map((day: HTMLElement) => {
      const tooltip = day.querySelector('.tool-tip')
      const tooltip1 = day.querySelector('.tool-tip-show-bottom')
      if (tooltip1) {
        day.removeChild(tooltip1)
      }
      if (tooltip) {
        day.removeChild(tooltip)
      }

      const date = day.getAttribute('data-full')
        ? moment(day.getAttribute('data-full'), 'YYYY-MM-DD')
            .format('YYYY/MM/DD')
            .toString()
        : ''

      const end = moment(endDate)
        .format('YYYY/MM/DD')
        .toString()

      if (date === end) {
        toolTipContainer = day
      }
    })

    const day: any = document.querySelector('.mbsc-cal-days-c')
    const numbetNight = moment(endDate, 'YYYY-MM-DD').diff(
      moment(startDate),
      'days'
    )

    if (
      toolTipContainer &&
      day &&
      toolTipContainer.getBoundingClientRect().y -
        day.getBoundingClientRect().y >
        80
    ) {
      const node = document.createElement('span')
      node.className = 'tool-tip'
      if (toolTipContainer.classList.contains('mbsc-cal-day6')) {
        node.classList.add('tool-tip-right')
      } else if (toolTipContainer.classList.contains('mbsc-cal-day0')) {
        node.classList.add('tool-tip-left')
      }
      node.innerHTML = `${getNightNumber(numbetNight, self)} `
      toolTipContainer.appendChild(node)
    } else {
      const node = document.createElement('div')
      node.className = 'tool-tip-show-bottom'
      if (
        toolTipContainer &&
        toolTipContainer.classList.contains('mbsc-cal-day6')
      ) {
        node.classList.add('tool-tip-right')
      } else if (
        toolTipContainer &&
        toolTipContainer.classList.contains('mbsc-cal-day0')
      ) {
        node.classList.add('tool-tip-left')
      }
      node.innerHTML = `${getNightNumber(numbetNight, self)}`
      // eslint-disable-next-line no-unused-expressions
      toolTipContainer ? toolTipContainer.appendChild(node) : null
    }
  },
  AddIntermediateHoverLogic: (inst: any, CheckNextDaySetManually: any) => {
    if (Calendar.isSetDate) {
      const dateList: any = Calendar.getInvalidDays(inst)
      for (let f = 0; f < dateList.length; f++) {
        dateList[f].classList.remove('mystays-hover-intermediate')
      }
      for (let i = 0; i < dateList.length; i++) {
        dateList[i].addEventListener('mouseover', function() {
          // Remove class from existing elements
          for (let f = 0; f < dateList.length; f++) {
            dateList[f].classList.remove('mystays-hover-intermediate')
            const endVal = moment(inst.endVal, 'YYYY-MM-DD').format(
              'DD-MM-YYYY'
            )
            const date = moment(
              dateList[f].getAttribute('data-full'),
              'YYYY-MM-DD'
            ).format('DD-MM-YYYY')
            if (endVal === date) {
              dateList[f].classList.remove('mbsc-selected')
              dateList[f].classList.remove('mbsc-cal-day-hl')
              dateList[f].classList.remove('mbsc-cal-sel-end')
            }
          }
          // Adding class from existing elements(rangeObject.endVal === "")
          for (let k = 0; k < dateList.length; k++) {
            const date1 = moment(
              dateList[k].getAttribute('data-full'),
              'YYYY-MM-DD'
            )
            const date2 = moment(
              dateList[i].getAttribute('data-full'),
              'YYYY-MM-DD'
            )
            const startVal = moment(inst.startVal, 'YYYY-MM-DD')
            if (
              CheckNextDaySetManually &&
              date1 >= startVal &&
              date1 <= date2
            ) {
              dateList[k].classList.add('mystays-hover-intermediate')
              Calendar.showToolTip(inst, Calendar.self, date2)
            }
          }
        })
      }
    }
  },
  customHTML: (event?: any, langArray?: any) => {
    const calendarContainer = event
      ? event.target.querySelector('.mbsc-fr-w')
      : document.querySelector('.mbsc-fr-w')
    const calendar = event
      ? event.target.querySelector('.mbsc-fr-c')
      : document.querySelector('.mbsc-fr-c')
    const noteContainer = event
      ? event.target.querySelector('.note')
      : document.querySelector('.note')
    if (noteContainer) {
      calendarContainer.removeChild(calendarContainer.lastElementChild)
    }
    calendar.insertAdjacentHTML(
      'afterend',
      `
        <div class="note">
          <span class="selected">${langArray.selected_date}</span>
          <span class="not-available">${langArray.not_available}</span>
          <span class="minimum">${langArray.minimum_stay}</span>
        </div>
      `
    )
  },
  customHeaderCalendar: (event: any, langArray?: any) => {
    if (event.querySelectorAll('.mystays-bookingwidget-header').length > 0) {
      const customSelector = event.getElementsByClassName(
        'mystays-bookingwidget-header'
      )
      while (customSelector[0]) {
        customSelector[0].parentNode.removeChild(customSelector[0])
      }
    }
    for (
      let index = 0;
      index <
      event.querySelectorAll(' .mbsc-cal-day-picker .mbsc-cal-table').length;
      index++
    ) {
      const sectionContainer: any = event.querySelectorAll(
        '.mbsc-cal-day-picker .mbsc-cal-table'
      )[index]
      const sectionStartDate = sectionContainer
        .querySelector('[data-full]')
        .getAttribute('data-full')
      const headerText = moment(sectionStartDate, 'YYYY M D').format('MMM YYYY')

      const sectionheader = document.createElement('div')
      sectionheader.className = 'mystays-bookingwidget-header'
      sectionheader.innerHTML = `
              <div class="calendar__header">
                <span>${headerText}</span>
              </div>
              <div class="days">
                <span>${langArray.su}</span>
                <span>${langArray.m || langArray.M}</span>
                <span>${langArray.t || langArray.T}</span>
                <span>${langArray.w || langArray.W}</span>
                <span>${langArray.th || langArray.TH}</span>
                <span>${langArray.f || langArray.F}</span>
                <span>${langArray.s || langArray.S}</span>
              </div>
            `
      sectionContainer.insertAdjacentHTML(
        'beforebegin',
        sectionheader.outerHTML
      )
    }
  },
  datePicker(_component: any, type: string) {
    const dateContainer: any = document.querySelector(`.mbsc-range-btn-${type}`)
    if (dateContainer) {
      const dateButton: any = dateContainer.querySelector('.mbsc-fr-btn-e')
      if (dateButton) {
        dateButton.click()
      }
    }
  },
  renderInvalidDate: (inst: Object | any) => {
    const currentDays = Calendar.getCurrentDays(inst)

    currentDays.map((day: HTMLElement) => {
      const selectdayStr = day.getAttribute('data-full')
      const selectDate = moment(selectdayStr, 'YYYY-MM-DD').format('YYYY-MM-DD')
      Calendar.invalidDate.map((item: any) => {
        const invalidDate = moment(item, 'YYYY-MM-DD').format('YYYY-MM-DD')
        if (selectDate === invalidDate) {
          day.classList.add('mystays-custom-invalid')
        }
      })
    })
  },
  renderAvailability: (inst: any) => {
    const currentDays = Calendar.getCurrentDays(inst)

    currentDays
      .filter((day: HTMLElement) => {
        return (
          !day.classList.contains('mbsc-disabled') &&
          !day.classList.contains('mystays-custom-invalid')
        )
      })
      .forEach((day: HTMLElement) => {
        const dayData: string = day.getAttribute('data-full') || ''
        const currentDate = moment(dayData, 'YYYY-MM-DD').format('YYYY/MM/DD')

        if (Calendar.availableDate.length) {
          Calendar.availableDate.forEach((item: any) => {
            const { date, rate } = item
            const rateElement = day.querySelector('.rate')
            if (rate && date && date === currentDate && !rateElement) {
              const newElement: HTMLElement | any = document.createElement(
                'span'
              )
              newElement.classList = 'rate'
              newElement.textContent = currencyHelper(rate, 'YEN', true)
              day.appendChild(newElement)
            }
          })
        }
      })
  },
  renderInventory: (inst: Object | any, date: string) => {
    if (
      Calendar.calledDate &&
      moment(date, 'YYYY-MM-DD') > moment(Calendar.calledDate, 'YYYY-MM-DD')
    ) {
      date = moment(date, 'YYYY-MM-DD')
        .add('months', 1)
        .format('DD-MM-YYYY')
        .toString()
    }

    const currentDays = Calendar.getCurrentDays(inst)

    const currentMonthInventory =
      Calendar.inventory[moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY')] || []
    const nextMonthInventory =
      Calendar.inventory[
        moment(date, 'YYYY-MM-DD')
          .add(1, 'months')
          .format('DD-MM-YYYY')
      ] || []
    const totalInventory =
      Calendar.totalInventory && Calendar.totalInventory.length
        ? Calendar.totalInventory
        : [...currentMonthInventory, ...nextMonthInventory]

    currentDays.map((day: HTMLElement) => {
      const dayData: any = day.getAttribute('data-full') || ''
      const isValid = day.classList.contains('mbsc-disabled')
      const currentDate = moment(dayData, 'YYYY-MM-DD').format('YYYY-MM-DD')

      if (totalInventory.length) {
        totalInventory.map((item: any) => {
          const inventoryDate = moment(item.date, 'YYYY-MM-DD').format(
            'YYYY-MM-DD'
          )
          const inventory: any = day.querySelector('.inventory')
          if (
            dayData &&
            !isValid &&
            inventoryDate === currentDate &&
            !inventory
          ) {
            const ivenHtml: HTMLElement | any = document.createElement('span')
            ivenHtml.classList = 'inventory'
            ivenHtml.textContent = `${item.value}`
            day.appendChild(ivenHtml)
          }
        })
      }
    })
  },
  getRoomAvailabilityAPICalendar: async (
    payload: IGetAvailability,
    $triplaRepo: any,
    callback: Function,
    inst: any
  ) => {
    const response = await $triplaRepo.calendar.getAvailabilityForSingleHotel(
      payload
    )

    inst.availableDate = response.data.room_rates
    const { room_rates } = response.data

    if (room_rates) {
      const invalid: Array<string> = []
      const availability: Array<Object | any> = []
      const inventory: Array<any> = []

      for (const key in room_rates) {
        if (!room_rates[key].rate || !room_rates[key].inventory) {
          invalid.push(moment(key).format('YYYY-MM-DD'))
        } else {
          inventory.push({ date: key, value: room_rates[key].inventory })
          availability.push({ ...room_rates[key], date: key })
        }
      }
      Calendar.totalInventory = inventory
      Calendar.invalidDate = invalid
      Calendar.availableDate = availability
    }

    callback(inst)
  },
  getAPICalendar: async (
    payload: any,
    $triplaRepo: any,
    callback: Function
  ) => {
    const { date, hotelID } = payload

    if (
      Calendar.calledDate &&
      moment(date, 'YYYY-MM-DD') > moment(Calendar.calledDate, 'YYYY-MM-DD')
    ) {
      payload.month = payload.month + 1
      payload.date = moment(date, 'YYYY-MM-DD')
        .add(1, 'months')
        .format('DD-MM-YYYY')
        .toString()
    }

    const getCalendarPayload = {
      ...payload,
      isCalled: Calendar.isCalledAPI
    }

    const currentTime = new Date().getTime()
    const lastTime = localStorage.getItem('lastTime')
    const calendarPayload = localStorage.getItem('calendarPayload')
    const calendarPayloadFormStorage =
      calendarPayload && JSON.parse(calendarPayload)
    const timeToReCallAPI = convertTime('5m') // Call API affter 5 minutes

    const monthFormat = moment(payload.date, 'YYYY-MM-DD')
      .format('DD-MM-YYYY')
      .toString()
    const nextMonthFormat = moment(payload.date, 'YYYY-MM-DD')
      .add(1, 'months')
      .format('DD-MM-YYYY')
      .toString()

    if (lastTime && currentTime - parseInt(lastTime) > timeToReCallAPI) {
      Calendar.inventory = []
      localStorage.removeItem('calendarData') // Save calendar data to localstorage
    } else {
      const inventoryTmp: any = []
      const calendarLocalStr = localStorage.getItem('calendarData') || ''
      const calendarLocalData = calendarLocalStr
        ? JSON.parse(calendarLocalStr)
        : {}
      calendarLocalData &&
        Object.keys(calendarLocalData).map((item: string) => {
          const inventoryItem = calendarLocalData[item].inventory

          const newArr: any = []
          Object.keys(inventoryItem).map(nextItem => {
            if (inventoryItem[nextItem] <= 5) {
              newArr.push({ date: nextItem, value: inventoryItem[nextItem] })
            }
          })

          inventoryTmp[item] = newArr
        })

      Calendar.inventory = inventoryTmp
    }

    const calendarPayloadFormStorageWithoutDate = {
      ...calendarPayloadFormStorage,
      date: null
    }

    const getCalendarPayloadWithoutDate = {
      ...getCalendarPayload,
      date: null
    }

    if (
      !(
        Calendar.inventory[monthFormat] &&
        JSON.stringify(calendarPayloadFormStorageWithoutDate) ===
          JSON.stringify(getCalendarPayloadWithoutDate)
      )
    ) {
      const req = payload.hotel_ids
        ? $triplaRepo.calendar.getCalendarForMultipleHotel(getCalendarPayload)
        : $triplaRepo.calendar.getCalendarForSingleHotel(getCalendarPayload)

      await Promise.all(req)
        .then((res: any) => {
          localStorage.setItem('lastTime', currentTime.toString()) // Save time to recall API
          localStorage.setItem('lastHotelId', hotelID)
          localStorage.setItem(
            'calendarPayload',
            JSON.stringify(getCalendarPayload)
          )

          Calendar.monthCalled = [
            ...Calendar.monthCalled,
            monthFormat,
            nextMonthFormat
          ]
          Calendar.monthCalled = Calendar.monthCalled.filter(
            (item: any, index: number) =>
              Calendar.monthCalled.indexOf(item) === index
          )

          Calendar.isCalledAPI = true
          Calendar.calledDate = payload.date

          res.map((item: any, index: number) => {
            const { disabled_dates, inventory } = item.data
            if (index === 0) {
              Calendar.handleInvalidDate(disabled_dates || [])
              Calendar.handleInventory({
                inventory: inventory || {},
                date: monthFormat
              })
            } else {
              Calendar.handleInvalidDate(disabled_dates || [])
              Calendar.handleInventory({
                inventory: inventory || {},
                date: nextMonthFormat
              })
            }
          })
        })
        .catch((error: any) => console.log(error))
    }

    callback()
  },
  handleInventory: (data: any) => {
    const inventoryDates: any = []

    Object.keys(data.inventory).map(item => {
      if (data.inventory[item] <= 5) {
        inventoryDates.push({ date: item, value: data.inventory[item] })
      }
    })

    Calendar.inventory[data.date] = inventoryDates
    const localCalendarStr = localStorage.getItem('calendarData') || ''
    const localCalendarData = localCalendarStr
      ? JSON.parse(localCalendarStr)
      : {}
    localCalendarData[data.date] = data
    localStorage.setItem('calendarData', JSON.stringify(localCalendarData)) // Save calendar data to localstorage
  },
  handleInvalidDate: (data: any) => {
    Calendar.invalidDate = data
  },
  onSetDate: (event: OnSetEvent, inst: any) => {
    const dateStr = event.valueText.split(' - ')
    const startDate = moment(dateStr[0])
    const endDate = dateStr[1] ? moment(dateStr[1]) : ''
    Calendar.isSetDate = true

    if (endDate === '' || startDate > endDate) {
      const disableDay = Calendar.enableFirstDisableDate(inst, startDate)
      const nextDay = moment(startDate).add(1, 'days')
      Calendar.disableDate = disableDay

      if (startDate.diff(disableDay, 'days') === 1) {
        inst.setVal([startDate, startDate], true, true, false)
      } else {
        inst.setVal([startDate, nextDay], true, true, false)
      }
      return true
    } else if (
      Calendar.disableDate &&
      endDate.format('YYYY-MM-DD') > Calendar.disableDate.format('YYYY-MM-DD')
    ) {
      const disableDay = Calendar.enableFirstDisableDate(inst, endDate)
      const nextDay = moment(startDate, 'YYYY-MM-DD').add(1, 'days')
      Calendar.disableDate = disableDay
      if (endDate.diff(disableDay, 'days') === 1) {
        inst.setVal([endDate, endDate], true, true, false)
      } else {
        inst.setVal([endDate, nextDay], true, true, false)
      }
      inst.setActiveDate('end')
      return true
    } else if (
      Calendar.disableDate &&
      endDate.format('YYYY-MM-DD') === Calendar.disableDate.format('YYYY-MM-DD')
    ) {
      return false
    } else if (endDate && endDate < startDate) {
      const nextDay = moment(startDate, 'YYYY-MM-DD').add(1, 'days')
      inst.setVal([endDate, nextDay], true, true, false)

      inst.setActiveDate('end')
      return true
    } else {
      return false
    }
  },
  enableFirstDisableDate: (inst: any, startDate: Moment) => {
    const currentDays: Array<HTMLElement> = Calendar.getCurrentDays(inst)
    Calendar.renderInvalidDate(inst)
    for (const day of currentDays) {
      day.classList.remove('open-invalid')
    }

    for (const day of currentDays) {
      const dayStr = day.getAttribute('data-full')
      const isDisableDate = day.classList.contains('mystays-custom-invalid')
      if (dayStr && isDisableDate && startDate < moment(dayStr)) {
        day.classList.remove('mystays-custom-invalid')
        day.classList.add('open-invalid')
        return moment(dayStr)
      }
    }
  },
  clearCalendar: () => {
    Calendar = {
      ...Calendar,
      text: null,
      inventory: [],
      isSetDate: false,
      invalidDate: [],
      monthCalled: [],
      disableDate: null,
      isCalledAPI: false,
      calledDate: ''
    }
  }
}
export default Calendar

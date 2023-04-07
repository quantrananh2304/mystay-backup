<template>
  <div class="generate-pdf">
    <div v-if="isLoading">
      <div class="generate-pdf__loading" />
      <b-spinner
        style="width: 3rem; height: 3rem"
        label="Large Spinner"
        variant="primary"
        class="spinner"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import phoneIcon from '~/assets/images/phone.png'
import mapIcon from '~/assets/images/map-pin.png'
import reservationIcon from '~/assets/images/reservation.png'
import bedIcon from '~/assets/images/bed.png'
import peopleIcon from '~/assets/images/people.png'
import hotelIcon from '~/assets/images/hotel.png'

export default {
  name: 'GeneratePdf',
  props: {
    reservationsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pdfWidth: 595,
      // pdfHeight: 3000,
      JsPdf: null,
      copyIcon: null,
      mystaysLogo: null,
      mystaysElite: null,
      isLoading: false,
      lineHeight: 1.5
    }
  },
  computed: {
    ...mapGetters({
      fullLang: 'appHeader/fullLanguage',
      cancellationPolicies: 'hotelDetail/cancellationPolicies',
      memberRank: 'users/memberRank',
      lang: 'appHeader/language',
      hotelDetail: 'hotelDetail/hotelDetail',
      hotelDetailV2: 'hotelDetail/hotelDetailV2'
    }),

    getMemberRankWithLanaguague() {
      const translateItem = this.memberRank?.find(
        translateItem => translateItem.locale === this.$langFormat(this.lang)
      )
      return translateItem?.name || ''
    },

    getLanguage() {
      return {
        room: this.$t('booking.room'),
        rooms: this.$t('booking.rooms'),
        guest: this.$t('booking.guest'),
        guests: this.$t('booking.guests'),
        yourStay: this.$t('summary.your_stay'),
        night: this.$t('summary.night'),
        nights: this.$t('customhtmlcalendar.nights'),
        child: this.$t('booking.child'),
        children: this.$t('booking.children'),
        adult: this.$t('booking.adult'),
        adults: this.$t('booking.adults'),
        tax: this.$t('summary.tax'),
        summaryOfCharges: this.$t('summary.summary_of_charges'),
        facilityName: this.$t('confirmbooking.facility_name'),
        issuedAt: this.$t('confirmbooking.issued_at'),
        bookingId: this.$t('forms.booking_id'),
        paymentMethod: this.$t('payment_detail.payment_method'),
        yourTotal: this.$t('summary.your_total'),
        cancellationPolicy: this.$t('summary.cancellation_and_refund_policy'),
        onSite: this.$t('payment_detail.on_site'),
        creditCard: this.$t('payment_detail.credit_card'),
        totalFees: this.$t('summary.tax_and_fee_change')
      }
    },
    bookingTime() {
      const checkin = this.$dateTime(
        this.reservationsData.checkin_date,
        this.$langFormat(this.$i18n.locale),
        true
      )

      const checkout = this.$dateTime(
        this.reservationsData.checkout_date,
        this.$langFormat(this.$i18n.locale),
        true
      )

      const totalNights =
        this.reservationsData.nights > 1
          ? this.getLanguage.nights
          : this.getLanguage.night

      return `${checkin} - ${checkout} / ${this.reservationsData.nights} ${totalNights}`
    },

    guestAndRoomText() {
      const totalGuest =
        this.reservationsData.adults + this.reservationsData.children
      return `${this.getLanguage.room}: ${this.reservationsData.room_count}, ${this.getLanguage.guest}: ${totalGuest} `
    },

    roomSelected() {
      const rooms = this.reservationsData.rooms.map((room) => {
        let guestCountText = ''
        if (room.children) {
          guestCountText = `${room.adults} ${
            room.adults > 1 ? this.getLanguage.adults : this.getLanguage.adult
          } & ${room.children} ${
            room.children > 1
              ? this.getLanguage.children
              : this.getLanguage.child
          }`
        } else {
          guestCountText = `${room.adults} ${
            room.adults > 1 ? this.getLanguage.adults : this.getLanguage.adult
          }`
        }
        return {
          ...room,
          guestCountText
        }
      })

      return rooms
    },

    couponDiscountAmount() {
      return this.reservationsData?.coupon_discount_amount
    },

    totalPrice() {
      return this.reservationsData?.original_price_with_tax
    },

    discountPercent() {
      const percent = (this.couponDiscountAmount / this.totalPrice) * 100
      const percentFixed = percent && percent.toFixed(0)
      return `${percentFixed}%`
    },

    summaryCharges() {
      const roomDetail = this.reservationsData.rooms.map((room) => {
        const roomRate = room.room_rates.map((rate, rateIdx) => {
          return {
            price: rate.day_total_rate,
            time:
              this.lang === 'ja'
                ? `${rateIdx + 1}${this.getLanguage.night}`
                : `${this.getLanguage.night} ${rateIdx + 1}`
          }
        })
        let title = ''
        if (room.children) {
          title = `${room.room_type_name} , ${room.room_plan_name} x ${
            room.adults
          } ${
            room.adults > 1 ? this.getLanguage.adults : this.getLanguage.adult
          } & ${room.children} ${
            room.children > 1
              ? this.getLanguage.children
              : this.getLanguage.child
          }`
        } else {
          title = `${room.room_type_name} , ${room.room_plan_name} x ${
            room.adults
          } ${
            room.adults > 1 ? this.getLanguage.adults : this.getLanguage.adult
          }`
        }
        const roomDetailInfo = {
          title,
          totalPrice: room.total_price - room.tax,
          detail: roomRate
        }

        return roomDetailInfo
      })

      return roomDetail
    },

    getSummaryOfChargesHeight() {
      let height = 0
      if (this.reservationsData.rooms[0].room_plan_name.length > 140) {
        height =
          this.reservationsData.rooms.length * 110 +
          25 * this.reservationsData.rooms.length
      } else if (this.reservationsData.coupon_discount_amount) {
        height = this.reservationsData.rooms.length * 105 + 42
      } else {
        height = this.reservationsData.rooms.length * 105
      }

      return height
    },

    pdfHeight() {
      const your_stay_height = this.getYourStayHeight(40, 45)

      const summary_of_charges_height = this.getSummaryOfChargesHeight

      const static_height = 865

      return your_stay_height + summary_of_charges_height + static_height
    }
  },
  watch: {
    isLoading(isLoading) {
      this.$nuxt.$emit('on:PdfLoading', isLoading)
    }
  },
  mounted() {
    import(/* webpackChunkName: "jspdf" */ 'jspdf').then(
      ({ default: jspdf }) => {
        this.JsPdf = jspdf
      }
    )

    const logoUrl = require('@/assets/images/Mystays_logo.png')
    const mystayEliteUrl = require('@/assets/images/Logo-Icon.png')

    this.readImage(logoUrl).then((image) => {
      this.mystaysLogo = image
    })

    this.readImage(mystayEliteUrl).then((image) => {
      this.mystaysElite = image
    })
    this.$nuxt.$on('savePdfFile', this.generatePdf)
    this.$nuxt.$on('on:PrintPdf', this.generatePdf)
  },

  beforeDestroy() {
    this.$nuxt.$off('savePdfFile', this.generatePdf)
    this.$nuxt.$off('on:PrintPdf', this.generatePdf)
  },

  methods: {
    textMarginRight(textWidth) {
      return this.pdfWidth - 60 - textWidth
    },

    rectWidth(pdRight) {
      return this.pdfWidth - pdRight * 2
    },

    verticalCenter(height, padding, textWidth) {
      return (height - padding * 2) / 2 - textWidth / 2
    },

    textCenter(textWidth, pdRight) {
      return (this.pdfWidth - pdRight * 2) / 2 - textWidth / 2
    },

    readImage(url) {
      return new Promise((resolve) => {
        const request = new XMLHttpRequest()
        request.onload = function() {
          const file = new FileReader()
          file.onloadend = function() {
            resolve(file.result)
          }
          file.readAsDataURL(request.response)
        }
        request.open('GET', url)
        request.responseType = 'blob'
        request.send()
      })
    },

    getYourStayHeight(titleHeight, roomHeight) {
      let dynamicHeight = roomHeight
      if (this.roomSelected.length) {
        if (
          this.roomSelected[0].room_type_name.length > 50 &&
          this.roomSelected[0].room_type_name.length <= 100
        ) {
          dynamicHeight = 46
        } else if (this.roomSelected[0].room_type_name.length > 100) {
          dynamicHeight = 60
        } else {
          dynamicHeight = 38
        }
      }
      return (
        titleHeight + roomHeight * 5 + this.roomSelected.length * dynamicHeight
      )
    },

    totalFeesLine(
      doc,
      possiton,
      pleft,
      pLeftBonus,
      textAlign,
      fontSize,
      text,
      price,
      color
    ) {
      doc.setFontSize(fontSize)
      if (color) {
        doc.setTextColor(235, 52, 52)
      } else {
        doc.setTextColor(0, 0, 0)
      }

      doc.text(text, pleft + pLeftBonus, possiton + 35)

      doc.text(
        price,
        this.textMarginRight(20),
        possiton + 35,
        null,
        null,
        textAlign
      )

      doc.line(pleft + 18, possiton + 53, this.rectWidth(35), possiton + 53)
    },

    formatPrice(price) {
      if (price) {
        return this.$currencyHelper(price, 'YEN')
      }

      return ''
    },

    generatePdf(isPrint) {
      this.isLoading = true

      setTimeout(async() => {
        const HEADER_HEIGHT = 100
        const PD_LEFT = 50
        const PD_RIGHT = 50
        const TITLE_FONT_SIZE = 20
        const DEFAULT_FONT_SIZE = 13
        const FONT_SIZE_10 = 10
        const FONT_SIZE_11 = 11
        const TITLE_HEIGHT = HEADER_HEIGHT + 40
        const BOOKING_ID_HEIGHT = 45
        const STAY_INFO_HEIGHT_ITEM = 25
        const LINE_HEIGHT = 15
        const ICON_PADDING = 50
        const TEXT_ALIGN_RIGHT = 'right'
        const doc = new this.JsPdf({
          orientation: 'p',
          unit: 'pt',
          format: [this.pdfWidth, this.pdfHeight],
          lineHeight: this.lineHeight
        })

        let pdfFont = require('@/assets/fonts/MalgunGothic/malgun.ttf')

        switch (this.$i18n.locale) {
          case 'en':
            pdfFont = require('@/assets/fonts/MalgunGothic/malgun.ttf')
            await doc.addFont(pdfFont, 'Lato-Regular', 'normal')
            await doc.setFont('Lato-Regular')
            break
          case 'ja':
            pdfFont = require('@/assets/fonts/MicrosoftJhenghei/Microsoft-JhengHei.ttf')
            await doc.addFont(pdfFont, 'Microsoft-Jhenghei', 'normal')
            await doc.setFont('Microsoft-Jhenghei')
            break
          case 'ko':
            pdfFont = require('@/assets/fonts/MalgunGothic/malgun.ttf')
            await doc.addFont(pdfFont, 'Malgun', 'normal')
            await doc.setFont('Malgun')
            break
          case 'zh':
            pdfFont = require('@/assets/fonts/MicrosoftYahei/Microsoft-YaHei.ttf')
            await doc.addFont(pdfFont, 'Microsoft-Jhenghei', 'normal')
            await doc.setFont('Microsoft-Jhenghei')
            break
          case 'tw':
            pdfFont = require('@/assets/fonts/MicrosoftYahei/Microsoft-YaHei.ttf')
            await doc.addFont(pdfFont, 'Microsoft-Jhenghei', 'normal')
            await doc.setFont('Microsoft-Jhenghei')
            break
          default:
            break
        }

        // Header

        doc.setFillColor(35, 46, 72)
        doc.rect(0, 0, this.pdfWidth, HEADER_HEIGHT, 'F')
        doc.addImage(
          this.mystaysLogo,
          'PNG',
          this.textCenter(150, 0),
          this.verticalCenter(100, 0, 60),
          150,
          60,
          ''
        )

        const reservationTime = this.$dateTime(
          this.reservationsData.booking_date,
          this.$langFormat(this.$i18n.locale),
          true
        )

        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(100)
        doc.setTextColor(255, 255, 255)
        doc.text(
          `${this.getLanguage.issuedAt}: ${reservationTime}`,
          this.pdfWidth - PD_RIGHT,
          HEADER_HEIGHT - 10,
          null,
          null,
          TEXT_ALIGN_RIGHT
        )

        // Title
        doc.setFontSize(TITLE_FONT_SIZE)
        doc.setTextColor(0, 0, 0)
        doc.setDrawColor(100)
        doc.text(
          `${this.reservationsData.message.title}${
            this.lang !== 'ja' ? '!' : ''
          }`,
          this.pdfWidth / 2,
          HEADER_HEIGHT + 40,
          'center'
        )

        // Booking ID
        doc.setDrawColor(221, 222, 224)
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(
          PD_LEFT,
          TITLE_HEIGHT + 18,
          this.rectWidth(PD_RIGHT),
          BOOKING_ID_HEIGHT,
          1,
          1,
          'FD'
        )

        doc.setFontSize(DEFAULT_FONT_SIZE)
        doc.setTextColor(26, 72, 156)
        doc.text(
          `${this.getLanguage.bookingId}: ${this.reservationsData.reservation_number}`,
          this.pdfWidth / 2,
          TITLE_HEIGHT + BOOKING_ID_HEIGHT,
          'center'
        )

        // Your Stay
        // 1: Your Stay Title
        const YOUR_STAY_HEIGHT = this.getYourStayHeight(65, 45)
        const YOUR_STAY_POSSITION = TITLE_HEIGHT + BOOKING_ID_HEIGHT
        doc.setDrawColor(221, 222, 224)
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(
          PD_LEFT,
          YOUR_STAY_POSSITION + 60,
          this.rectWidth(PD_RIGHT),
          YOUR_STAY_HEIGHT + 25,
          1,
          1,
          'FD'
        )

        const GUEST_NAME_HEIGHT =
          YOUR_STAY_POSSITION + 65 + STAY_INFO_HEIGHT_ITEM

        doc.setFontSize(DEFAULT_FONT_SIZE)
        doc.setTextColor(0, 0, 0)
        doc.text(
          `${this.$t('confirmbooking.mr_miss', {
            username: this.reservationsData.guest.name
          })}`,
          PD_LEFT + 18,
          GUEST_NAME_HEIGHT
        )

        doc.text(
          `${this.$t('forms.email')}: ${this.reservationsData.email}`,
          PD_LEFT + 18,
          GUEST_NAME_HEIGHT + 27
        )

        doc.setFontSize(DEFAULT_FONT_SIZE)
        doc.setTextColor(0, 0, 0)
        doc.text(
          this.getLanguage.yourStay,
          PD_LEFT + 18,
          GUEST_NAME_HEIGHT + 35 + 20
        )

        const YOUR_STAY_TITLE_HEIGHT =
          YOUR_STAY_POSSITION + 105 + STAY_INFO_HEIGHT_ITEM + 27

        // 2: Your Stay Info
        doc.setFontSize(FONT_SIZE_10)
        doc.setTextColor(0, 0, 0)
        doc.text(
          this.bookingTime,
          PD_LEFT + ICON_PADDING,
          YOUR_STAY_TITLE_HEIGHT + 25
        )

        doc.addImage(
          reservationIcon,
          'PNG',
          PD_LEFT + 18,
          YOUR_STAY_TITLE_HEIGHT + 7,
          25,
          25,
          ''
        )

        const TIME_HEIGHT = YOUR_STAY_TITLE_HEIGHT + 25
        doc.line(
          PD_LEFT + 18,
          TIME_HEIGHT + LINE_HEIGHT,
          this.rectWidth(35),
          TIME_HEIGHT + LINE_HEIGHT
        )

        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(221, 222, 224)
        doc.setTextColor(0, 0, 0)
        doc.text(
          this.guestAndRoomText,
          PD_LEFT + ICON_PADDING,
          TIME_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM
        )

        doc.addImage(
          peopleIcon,
          'PNG',
          PD_LEFT + 18,
          TIME_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM - 15,
          28,
          25,
          ''
        )

        const ROOM_INFO_HEIGHT =
          TIME_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM
        doc.setLineWidth(0.1)
        doc.setDrawColor(221, 222, 224)
        doc.line(
          PD_LEFT + 18,
          ROOM_INFO_HEIGHT + LINE_HEIGHT,
          this.rectWidth(35),
          ROOM_INFO_HEIGHT + LINE_HEIGHT
        )

        // 3: Room Selected
        let ROOM_SELECTED_INFO_HEIGHT = 0
        this.roomSelected.forEach((room, roomIndex) => {
          const roomName = `${this.getLanguage.room} ${roomIndex + 1} / ${
            room.room_type_name
          } x ${room.guestCountText}`

          const strArr = doc.splitTextToSize(`${roomName}`, 400)
          const numberLine = strArr.length
          const textSize = numberLine === 1 ? 22 : 15
          let minusHeight = 0
          if (numberLine === 1) {
            minusHeight = 0
          } else if (numberLine === 2) {
            minusHeight = 11
          } else {
            minusHeight = 26
          }

          const ROOM_PLAN_TITLE_HEIGHT = textSize * numberLine

          const ROOM_INFO_HEIGHT_ITEM =
            ROOM_INFO_HEIGHT +
            (LINE_HEIGHT + ROOM_PLAN_TITLE_HEIGHT) * (roomIndex + 1)

          doc.setFontSize(FONT_SIZE_10)
          doc.setTextColor(0, 0, 0)
          doc.text(
            strArr,
            PD_LEFT + ICON_PADDING,
            ROOM_INFO_HEIGHT_ITEM - minusHeight
          )

          doc.addImage(
            bedIcon,
            'PNG',
            PD_LEFT + 18,
            ROOM_INFO_HEIGHT_ITEM - 15 - (minusHeight ? minusHeight - 10 : 0),
            28,
            25,
            ''
          )

          ROOM_SELECTED_INFO_HEIGHT = ROOM_INFO_HEIGHT_ITEM
          doc.setLineWidth(0.1)
          doc.setDrawColor(221, 222, 224)
          doc.line(
            PD_LEFT + 18,
            ROOM_SELECTED_INFO_HEIGHT + LINE_HEIGHT,
            this.rectWidth(35),
            ROOM_SELECTED_INFO_HEIGHT + LINE_HEIGHT
          )
        })

        // Facility
        const FACILITY_HEIGHT =
          ROOM_SELECTED_INFO_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM

        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(221, 222, 224)
        doc.setTextColor(0, 0, 0)
        doc.text(
          `${this.getLanguage.facilityName}: ${this.reservationsData.hotel.name}`,
          PD_LEFT + ICON_PADDING,
          FACILITY_HEIGHT
        )

        doc.addImage(
          hotelIcon,
          'PNG',
          PD_LEFT + 19,
          FACILITY_HEIGHT - 17,
          28,
          25,
          ''
        )

        doc.setLineWidth(0.1)
        doc.setDrawColor(221, 222, 224)
        doc.line(
          PD_LEFT + 18,
          FACILITY_HEIGHT + LINE_HEIGHT,
          this.rectWidth(35),
          FACILITY_HEIGHT + LINE_HEIGHT
        )

        // Hotel address

        const HOTEL_ADDRESS_HEIGHT =
          FACILITY_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM

        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(221, 222, 224)
        doc.setTextColor(0, 0, 0)
        doc.text(
          `${this.$t('confirmbooking.facility_address')}: ${
            this.hotelDetail.address.full_address
          }`,
          PD_LEFT + ICON_PADDING,
          HOTEL_ADDRESS_HEIGHT
        )

        doc.addImage(
          mapIcon,
          'PNG',
          PD_LEFT + 19,
          HOTEL_ADDRESS_HEIGHT - 17,
          28,
          25,
          ''
        )

        doc.setLineWidth(0.1)
        doc.setDrawColor(221, 222, 224)
        doc.line(
          PD_LEFT + 18,
          HOTEL_ADDRESS_HEIGHT + LINE_HEIGHT,
          this.rectWidth(35),
          HOTEL_ADDRESS_HEIGHT + LINE_HEIGHT
        )

        // Hotel phone number

        const HOTEL_PHONE_HEIGHT =
          HOTEL_ADDRESS_HEIGHT + LINE_HEIGHT + STAY_INFO_HEIGHT_ITEM

        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(221, 222, 224)
        doc.setTextColor(0, 0, 0)
        doc.text(
          `${this.$t('hoteldetail.call_to_inquire')}: ${
            this.hotelDetailV2.phone
          }`,
          PD_LEFT + ICON_PADDING,
          HOTEL_PHONE_HEIGHT
        )

        doc.addImage(
          phoneIcon,
          'PNG',
          PD_LEFT + 19,
          HOTEL_PHONE_HEIGHT - 17,
          28,
          25,
          ''
        )

        doc.setLineWidth(0.1)
        doc.setDrawColor(221, 222, 224)
        doc.line(
          PD_LEFT + 18,
          HOTEL_PHONE_HEIGHT + LINE_HEIGHT,
          this.rectWidth(35),
          HOTEL_PHONE_HEIGHT + LINE_HEIGHT
        )

        // Summary of charges
        const SUMMARY_POSSITION_Y = HOTEL_PHONE_HEIGHT + LINE_HEIGHT + 65
        const NIGHT_HEIGHT = 45
        let SUMMARY_POSSITION_HEIGHT = 0
        // 1: Title
        doc.setFontSize(DEFAULT_FONT_SIZE)
        doc.setDrawColor(100)
        doc.text(
          this.getLanguage.summaryOfCharges,
          PD_LEFT + 18,
          SUMMARY_POSSITION_Y + 27
        )
        // Content
        doc.setFontSize(FONT_SIZE_10)
        doc.setDrawColor(100)
        let ROOM_PLAN_POSSITION = SUMMARY_POSSITION_Y + 55
        this.summaryCharges.forEach((room, roomIndex) => {
          const roomPlanTitle = room.title
          const strArr = doc.splitTextToSize(`${roomPlanTitle}`, 350)
          const numberLine = strArr.length
          const textSize = 15
          const ROOM_PLAN_TITLE_HEIGHT = textSize * numberLine
          doc.setFontSize(FONT_SIZE_11)
          doc.setDrawColor(100)
          doc.text(strArr, PD_LEFT + 18, ROOM_PLAN_POSSITION - 2)

          doc.text(
            this.formatPrice(room.totalPrice),
            this.textMarginRight(20),
            ROOM_PLAN_POSSITION + 7,
            null,
            null,
            TEXT_ALIGN_RIGHT
          )

          doc.setLineWidth(0.1)
          doc.setDrawColor(221, 222, 224)
          doc.line(
            PD_LEFT + 18,
            ROOM_PLAN_POSSITION + ROOM_PLAN_TITLE_HEIGHT,
            this.rectWidth(35),
            ROOM_PLAN_POSSITION + ROOM_PLAN_TITLE_HEIGHT
          )

          doc.setFontSize(FONT_SIZE_10)
          doc.setDrawColor(100)

          const roomDetail = room.detail
          ROOM_PLAN_POSSITION +=
            ROOM_PLAN_TITLE_HEIGHT + NIGHT_HEIGHT * roomDetail.length + 20

          const ONE_ROOM_HEIGHT =
            SUMMARY_POSSITION_Y +
            55 +
            (ROOM_PLAN_TITLE_HEIGHT + 22) * (roomIndex + 1) +
            NIGHT_HEIGHT * roomDetail.length * roomIndex

          // Night Detail
          roomDetail.forEach((detail, index) => {
            const ROOM_DETAIL_POSSITION = ONE_ROOM_HEIGHT + NIGHT_HEIGHT * index
            doc.text(detail.time, PD_LEFT + 25, ROOM_DETAIL_POSSITION)

            doc.text(
              this.formatPrice(detail.price),
              this.textMarginRight(20),
              ROOM_DETAIL_POSSITION,
              null,
              null,
              TEXT_ALIGN_RIGHT
            )

            doc.setLineWidth(0.1)
            doc.setDrawColor(221, 222, 224)
            const LINE_POSSITION = ROOM_DETAIL_POSSITION + 17
            doc.line(
              PD_LEFT + 18,
              LINE_POSSITION,
              this.rectWidth(35),
              LINE_POSSITION
            )

            SUMMARY_POSSITION_HEIGHT = ROOM_DETAIL_POSSITION + 5
          })
        })

        // Total Fee
        this.totalFeesLine(
          doc,
          SUMMARY_POSSITION_HEIGHT,
          PD_LEFT,
          18,
          TEXT_ALIGN_RIGHT,
          FONT_SIZE_10,
          this.getLanguage.totalFees,
          this.formatPrice(this.reservationsData.total_price)
        )

        this.totalFeesLine(
          doc,
          SUMMARY_POSSITION_HEIGHT + 42,
          PD_LEFT,
          25,
          TEXT_ALIGN_RIGHT,
          FONT_SIZE_10,
          this.getLanguage.tax,
          this.formatPrice(this.reservationsData.tax)
        )

        const paymentMethodText =
          this.reservationsData.payment_method === 'on_site'
            ? this.getLanguage.onSite
            : this.getLanguage.creditCard

        // coupon code if have
        if (this.reservationsData.coupon_discount_amount) {
          this.totalFeesLine(
            doc,
            SUMMARY_POSSITION_HEIGHT + 84,
            PD_LEFT,
            18,
            TEXT_ALIGN_RIGHT,
            FONT_SIZE_10,
            this.$t('booking.saved_money', {
              percent: this.discountPercent,
              coupon: this.reservationsData.coupon_promotion.coupon_code
            }),
            this.formatPrice(this.reservationsData.coupon_discount_amount),
            true,
            pdfFont
          )
        }

        const COUNPON_CODE_POSSITION_HEIGHT = this.reservationsData
          .coupon_discount_amount
          ? SUMMARY_POSSITION_HEIGHT + 128
          : SUMMARY_POSSITION_HEIGHT + 84

        this.totalFeesLine(
          doc,
          COUNPON_CODE_POSSITION_HEIGHT,
          PD_LEFT,
          18,
          TEXT_ALIGN_RIGHT,
          FONT_SIZE_10,
          this.getLanguage.paymentMethod,
          paymentMethodText
        )

        // Rect
        doc.setDrawColor(221, 222, 224)
        doc.rect(
          PD_LEFT,
          SUMMARY_POSSITION_Y,
          this.rectWidth(PD_RIGHT),
          COUNPON_CODE_POSSITION_HEIGHT + 78 - SUMMARY_POSSITION_Y
        )

        // Your Total
        const YOUR_TOTAL_POSSITION = COUNPON_CODE_POSSITION_HEIGHT + 100

        doc.setDrawColor(221, 222, 224)
        doc.setFillColor(255, 246, 223)
        doc.rect(
          PD_LEFT,
          YOUR_TOTAL_POSSITION + 20,
          this.rectWidth(PD_RIGHT),
          55,
          'FD'
        )

        doc.text(
          this.getLanguage.yourTotal,
          PD_LEFT + 20,
          YOUR_TOTAL_POSSITION + 52
        )
        doc.text(
          this.formatPrice(this.reservationsData.total_price),
          this.textMarginRight(15),
          YOUR_TOTAL_POSSITION + 52,
          null,
          null,
          TEXT_ALIGN_RIGHT
        )

        // Cancellation Policy
        const CANCELATION_POSSITION = YOUR_TOTAL_POSSITION + 105
        doc.setFontSize(12)
        doc.text(
          this.getLanguage.cancellationPolicy,
          PD_LEFT,
          CANCELATION_POSSITION
        )

        let startH = 0
        this.cancellationPolicies.forEach((policy, index) => {
          const policyFormat = policy
          doc.setFontSize(FONT_SIZE_10)

          const prevPolicy = this.cancellationPolicies[index - 1]

          if (prevPolicy) {
            const prevArr = doc.splitTextToSize(prevPolicy, 480)
            if (prevArr.length > 1) {
              startH += 8 * prevArr.length
            }
          }
          const strArr = doc.splitTextToSize(policyFormat, 480)

          doc.text(
            strArr,
            PD_LEFT,
            CANCELATION_POSSITION + 25 * (index + 1) + startH
          )
        })

        // Save File
        const fileName = `Booking_Report_${
          this.reservationsData.reservation_number
        }_${moment(new Date()).format('DD/MM/YYYY')}`

        doc.save(fileName)

        if (isPrint) {
          window.open(doc.output('bloburl'))
        }
        this.isLoading = false
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.generate-pdf {
  position: relative;
  &__loading {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: black;
    opacity: 0.4;
    z-index: 10;
  }

  .spinner {
    position: fixed;
    left: 45%;
    top: 45%;
    z-index: 20;
    color: white !important;
  }
}
</style>

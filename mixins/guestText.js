export default {
  methods: {
    getAdultsText(numberAdult) {
      if (numberAdult > 1) {
        return this.$t('booking.number_adults', {
          number: numberAdult
        })
      }

      return this.$t('booking.number_adult', {
        number: numberAdult
      })
    },

    getChildrenText(numberChildren) {
      if (!numberChildren) {
        return ''
      }

      if (numberChildren > 1) {
        return `, ${this.$t('booking.number_children', {
          number: numberChildren
        })}`
      }

      return `, ${this.$t('booking.number_child', {
        number: numberChildren
      })}`
    },

    getGuestText(numberAdult, numberChildren) {
      return `${this.getAdultsText(numberAdult)} ${this.getChildrenText(
        numberChildren
      )}`
    }
  }
}

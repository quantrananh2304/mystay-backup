/* eslint-disable no-useless-escape */
import {
  required,
  minLength,
  email,
  maxLength,
  requiredIf,
  helpers
} from 'vuelidate/lib/validators'

const atleastRules = (firstField: string, secondField: string, type: string) =>
  helpers.withParams({ type: 'atleastRules' }, function(
    value: string,
    parentVm: any
  ) {
    const $firstValue = this.$v.guestInfos.$each[parentVm.id - 1]
      .guestInfoInput[firstField].value

    const $secondValue = this.$v.guestInfos.$each[parentVm.id - 1]
      .guestInfoInput[secondField].value

    if (parentVm.name !== firstField && parentVm.name !== secondField) {
      if (!$firstValue.$invalid && !$secondValue.$invalid) {
        return true
      }
    }

    return type === 'japanLang'
      ? /^[一-龥]+$/im.test(value) ||
          /^[ぁ-ん]+$/im.test(value) ||
          /^[ァ-ン]+$/im.test(value)
      : /^[ぁ-ん]+$/im.test(value)
  })

const atleastRulesConfirmPage = (firstField: string, secondField: string) =>
  helpers.withParams({ type: 'atleastRulesConfirmPage' }, function(
    value: string,
    parentVm: any
  ) {
    const $firstValue = this.$v.guestInfos[firstField].value

    const $secondValue = this.$v.guestInfos[secondField].value

    console.log($firstValue, $secondValue)

    if (!$firstValue.$invalid && !$secondValue.$invalid) {
      return true
    }

    return (
      /^[一-龥]+$/im.test(value) ||
      /^[ぁ-ん]+$/im.test(value) ||
      /^[ァ-ン]+$/im.test(value)
    )
  })

const atleastEachRulesConfirmPage = (firstField: string, secondField: string) =>
  helpers.withParams({ type: 'atleastEachRulesConfirmPage' }, function(
    value: string,
    parentVm: any
  ) {
    const $firstValue = this.$v.guestInfosByRoom.$each[parentVm.id - 1]
      .guestInfos[firstField].value

    const $secondValue = this.$v.guestInfosByRoom.$each[parentVm.id - 1]
      .guestInfos[secondField].value

    if (parentVm.name !== firstField && parentVm.name !== secondField) {
      if (!$firstValue.$invalid && !$secondValue.$invalid) {
        return true
      }
    }

    return (
      /^[一-龥]+$/im.test(value) ||
      /^[ぁ-ん]+$/im.test(value) ||
      /^[ァ-ン]+$/im.test(value)
    )
  })

export const requiredValidation = {
  required
}

export const phoneValidation = {
  required: requiredIf(obj => {
    return obj.id === 1
  }),
  phoneNumberValidation(value: string, obj: any): boolean {
    if (obj.id !== 1 && !value) {
      return true
    }

    return /^[\+]?\d{2,}?[(]?\d{2,}[)]?[-\s\.]?\d{2,}?[-\s\.]?\d{2,}[-\s\.]?\d{0,9}$/im.test(
      value
    )
  }
}

export const emailValidation = {
  required: requiredIf(obj => {
    return obj.id === 1
  }),
  minLength: minLength(3),
  email
}

export const emailValidationForOneField = {
  required,
  minLength: minLength(3),
  email
}

export const passwordValidation = {
  required
}

export const areaSearchValidation = {
  required
}

export const commentValidation = {
  maxLength(value: any) {
    maxLength(value)
  }
}

export const kanjiValidation = {
  required,
  kanjiValidation(value: string): boolean {
    return /^[一-龥]+$/im.test(value)
  }
}

export const hiraganaValidation = {
  required,
  hiraganaValidation(value: string): boolean {
    return /^[ぁ-ん]+$/im.test(value)
  }
}

export const japanLangValidationGuestPage = {
  required,
  japanLangValidation: atleastRules(
    'lastNameInput',
    'firstNameInput',
    'japanLang'
  )
}

export const japanLangValidationConfirmPageForDefaultGuest = {
  required,
  japanLangValidation: atleastRulesConfirmPage(
    'lastNameInput',
    'firstNameInput'
  )
}

export const japanLangValidationConfirmPage = {
  required,
  japanLangValidation: atleastEachRulesConfirmPage(
    'lastNameInput',
    'firstNameInput'
  )
}

export const japanLangValidation = {
  required,
  japanLangValidation(value: string): boolean {
    return (
      /^[一-龥]+$/im.test(value) ||
      /^[ぁ-ん]+$/im.test(value) ||
      /^[ァ-ン]+$/im.test(value)
    )
  }
}

export const englishValidation = {
  required,
  englishValidation(value: string): boolean {
    return /^[a-zA-Z ]+$/im.test(value)
  }
}

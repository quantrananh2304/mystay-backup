import { FormLabel } from '../../../shared/constants'
import {
  hiraganaValidation,
  phoneValidation,
  emailValidation,
  englishValidation,
  japanLangValidationGuestPage
} from '../../../shared/helper/vuelidate-validator'

export const guestValidation = (language: string) => {
  if (language === 'ja') {
    return {
      guestInfos: {
        $each: {
          guestInfoInput: {
            lastNameInput: {
              value: hiraganaValidation
            },
            firstNameInput: {
              value: hiraganaValidation
            },
            kanjiLastName: {
              value: japanLangValidationGuestPage
            },
            kanjiFirstName: {
              value: japanLangValidationGuestPage
            },
            phone: {
              value: phoneValidation
            },
            email: {
              value: emailValidation
            }
          }
        }
      }
    }
  }
  return {
    guestInfos: {
      $each: {
        guestInfoInput: {
          lastNameInput: {
            value: englishValidation
          },
          firstNameInput: {
            value: englishValidation
          },
          phone: {
            value: phoneValidation
          },
          email: {
            value: emailValidation
          }
        }
      }
    }
  }
}

export const guestInfoInput = (item: any, index: number, lang: string) => {
  let guestItem = {
    last_name: '',
    first_name: '',
    last_name_kana: '',
    first_name_kana: '',
    phone: '',
    email: ''
  }
  if (item) {
    guestItem = item
  }

  if (lang === 'ja') {
    return {
      guestInfoInput: {
        kanjiLastName: {
          name: 'kanjiLastName',
          validationName: 'japanLangValidation',
          value: guestItem.last_name,
          type: 'text',
          label: FormLabel.kanji_last_name,
          id: index + 1
        },
        kanjiFirstName: {
          name: 'kanjiFirstName',
          validationName: 'japanLangValidation',
          value: guestItem.first_name,
          type: 'text',
          label: FormLabel.kanji_first_name,
          id: index + 1
        },
        lastNameInput: {
          name: 'lastNameInput',
          validationName: 'hiraganaValidation',
          value: guestItem.last_name_kana,
          type: 'text',
          label: FormLabel.last_name,
          id: index + 1
        },
        firstNameInput: {
          name: 'firstNameInput',
          validationName: 'hiraganaValidation',
          value: guestItem.first_name_kana,
          type: 'text',
          label: FormLabel.first_name,
          id: index + 1
        },
        phone: {
          name: 'phone',
          validationName: 'phoneNumberValidation',
          value: guestItem.phone,
          type: 'text',
          label: FormLabel.phone,
          id: index + 1
        },
        email: {
          name: 'email',
          validationName: 'email',
          value: guestItem.email,
          type: 'email',
          label: FormLabel.email,
          id: index + 1
        }
      },
      guestId: index + 1
    }
  }

  return {
    guestInfoInput: {
      firstNameInput: {
        name: 'firstNameInput',
        validationName: 'englishValidation',
        value: guestItem.first_name || '',
        type: 'text',
        label: FormLabel.first_name,
        id: index + 1
      },
      lastNameInput: {
        name: 'lastNameInput',
        validationName: 'englishValidation',
        value: guestItem.last_name || '',
        type: 'text',
        label: FormLabel.last_name,
        id: index + 1
      },
      phone: {
        name: 'phone',
        validationName: 'phoneNumberValidation',
        value: guestItem.phone,
        type: 'text',
        label: FormLabel.phone,
        id: index + 1
      },
      email: {
        name: 'email',
        validationName: 'email',
        value: guestItem.email,
        type: 'email',
        label: FormLabel.email,
        id: index + 1
      }
    },
    guestId: index + 1
  }
}

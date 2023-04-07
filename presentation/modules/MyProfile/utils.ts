import moment from 'moment'
import {
  requiredValidation,
  hiraganaValidation,
  kanjiValidation,
  japanLangValidation,
  englishValidation
} from '../../../shared/helper/vuelidate-validator'

export const myProfileValidation = (isEditable: boolean, lang: string) => {
  if (lang === 'ja') {
    return {
      userInfo: {
        firstName: {
          value: requiredValidation
        },
        lastName: {
          value: requiredValidation
        },
        firstNameKana: {
          value: hiraganaValidation
        },
        lastNameKana: {
          value: hiraganaValidation
        },
        phoneNumber: { value: {} },
        emailAddress: { value: {} },
        birthday: {
          value: {}
        },
        created: { value: {} },
        gender: { value: {} },
        country: { value: {} },
        perfectureOrState: { value: {} },
        streetAddress: { value: {} },
        postalCode: { value: {} }
      }
    }
  }

  return {
    userInfo: {
      firstName: {
        value: requiredValidation
      },
      lastName: {
        value: requiredValidation
      },
      phoneNumber: { value: {} },
      emailAddress: { value: {} },
      birthday: {
        value: {}
      },
      created: { value: {} },
      gender: { value: {} },
      country: { value: {} },
      perfectureOrState: { value: {} },
      streetAddress: { value: {} },
      postalCode: { value: {} }
    }
  }
}

export const myProfileDefault = (userData: any, self: any) => {
  if (self.lang === 'ja') {
    return {
      lastNameKana: {
        name: 'lastNameKana',
        label: self.$t('forms.last_name'),
        value: userData.last_name_kana || '',
        editable: true,
        type: 'input'
      },
      firstNameKana: {
        name: 'firstNameKana',
        label: self.$t('forms.first_name'),
        value: userData.first_name_kana || '',
        editable: true,
        type: 'input'
      },
      lastName: {
        name: 'lastName',
        label: self.$t('forms.kanji_last_name'),
        value: userData.last_name || '',
        editable: true,
        type: 'input'
      },
      firstName: {
        name: 'firstName',
        label: self.$t('forms.kanji_first_name'),
        value: userData.first_name || '',
        editable: true,
        type: 'input'
      },
      emailAddress: {
        name: 'emailAddress',
        label: self.$t('forms.email'),
        value: userData.email || '',
        editable: false,
        type: 'input'
      },
      phoneNumber: {
        id: 1,
        name: 'phoneNumber',
        label: self.$t('forms.phone'),
        value: userData.phone || '',
        editable: true,
        type: 'input'
      },
      birthday: {
        name: 'birthday',
        label: self.$t('my_profile.birth_day'),
        value: userData.birthday
          ? moment(userData.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD')
          : null,
        editable: true,
        type: 'date'
      },
      gender: {
        name: 'gender',
        label: self.$t('my_profile.gender'),
        value: userData.gender || '',
        editable: true,
        type: 'radio-button'
      },
      country: {
        name: 'country',
        label: self.$t('my_profile.country'),
        value: userData.country || '',
        editable: true,
        type: 'autocomplete'
      },
      perfectureOrState: {
        name: 'perfectureOrState',
        label: self.$t('my_profile.perfecture_or_state'),
        value: userData.prefecture_or_state || '',
        editable: true,
        type: 'input'
      },
      // mulnicipality: {
      //   name: 'mulnicipality',
      //   label: self.$t('my_profile.mulnicipality'),
      //   value: userData.mulnicipality || '',
      //   editable: true,
      //   type: 'input'
      // },
      // city: {
      //   name: 'city',
      //   label: self.$t('my_profile.city'),
      //   value: userData.city,
      //   editable: true,
      //   type: 'input'
      // },
      streetAddress: {
        name: 'streetAddress',
        label: self.$t('my_profile.street_address'),
        value: userData.street_address || '',
        editable: true,
        type: 'input'
      },
      postalCode: {
        name: 'postalCode',
        label: self.$t('my_profile.postal_code'),
        value: userData.postal_code || '',
        editable: true,
        type: 'input'
      },
      created: {
        name: 'created',
        label: self.$t('my_profile.joining_date'),
        value: moment(userData.created_at, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        editable: false,
        type: 'date'
      }
    }
  }

  return {
    firstName: {
      name: 'firstName',
      label: self.$t('forms.first_name'),
      value: userData.first_name || '',
      editable: true,
      type: 'input'
    },
    lastName: {
      name: 'lastName',
      label: self.$t('forms.last_name'),
      value: userData.last_name || '',
      editable: true,
      type: 'input'
    },
    emailAddress: {
      name: 'emailAddress',
      label: self.$t('forms.email'),
      value: userData.email || '',
      editable: false,
      type: 'input'
    },
    phoneNumber: {
      id: 1,
      name: 'phoneNumber',
      label: self.$t('forms.phone'),
      value: userData.phone || '',
      editable: true,
      type: 'input'
    },
    birthday: {
      name: 'birthday',
      label: self.$t('my_profile.birth_day'),
      value: userData.birthday
        ? moment(userData.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD')
        : null,
      editable: true,
      type: 'date'
    },
    gender: {
      name: 'gender',
      label: self.$t('my_profile.gender'),
      value: userData.gender || '',
      editable: true,
      type: 'radio-button'
    },
    country: {
      name: 'country',
      label: self.$t('my_profile.country'),
      value: userData.country || '',
      editable: true,
      type: 'autocomplete'
    },
    perfectureOrState: {
      name: 'perfectureOrState',
      label: self.$t('my_profile.perfecture_or_state'),
      value: userData.prefecture_or_state || '',
      editable: true,
      type: 'input'
    },
    // mulnicipality: {
    //   name: 'mulnicipality',
    //   label: self.$t('my_profile.mulnicipality'),
    //   value: userData.mulnicipality || '',
    //   editable: true,
    //   type: 'input'
    // },
    // city: {
    //   name: 'city',
    //   label: self.$t('my_profile.city'),
    //   value: userData.city || '',
    //   editable: true,
    //   type: 'input'
    // },
    streetAddress: {
      name: 'streetAddress',
      label: self.$t('my_profile.street_address'),
      value: userData.street_address || '',
      editable: true,
      type: 'input'
    },
    postalCode: {
      name: 'postalCode',
      label: self.$t('my_profile.postal_code'),
      value: userData.postal_code || '',
      editable: true,
      type: 'input'
    },
    created: {
      name: 'created',
      label: self.$t('my_profile.joining_date'),
      value: moment(userData.created_at, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      editable: false,
      type: 'date'
    }
  }
}

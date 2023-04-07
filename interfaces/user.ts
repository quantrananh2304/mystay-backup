// USER detail

export interface IUserDetail {
  data: IUserData
}

export interface IUserData {
  birthday: string
  building_name_and_number: unknown
  company_name: unknown
  country: string
  created_at: string
  email: string
  email_permission: boolean
  first_name: string
  first_name_kana: string
  gender: string
  id: number
  language: unknown
  last_name: string
  last_name_kana: string
  name: string
  name_kana: string
  new_email: unknown
  occupation: unknown
  phone: string
  postal_code: string
  prefecture_or_state: string
  provider: string
  sign_up_facility_id: number
  street_address: string
  updated_at: string
  program_id: number
  program_name: unknown
  rank: IUserRank
  membership_id: unknown
  membership_setting: {
    custom_account_removal: boolean
    custom_account_removal_description: string | unknown
  }
  refresh_token: IUserRefreshToken
  access_token?: string
  non_signed_in_program_ids?: Array<any>
}

interface IUserRank {
  id: number
  default: boolean
  created_at: string
  updated_at: string
  image: string
  point_level: unknown
  deleted_at: unknown
  translations_attributes: IUserRankTranslationsAttribute[]
}

interface IUserRankTranslationsAttribute {
  id: number
  membership_rank_id: number
  locale: string
  created_at: string
  updated_at: string
  name: string
}

interface IUserRefreshToken {
  token: string
  expires_at: string
}

// Sign out

export interface ISignOut {
  data: {
    message: string
  }
}

// Client sestion

export interface IClientSession {
  data: {
    client_session: string
  }
}

// Access token

export interface IAccessToken {
  access_token: string
  expires_in: string | number | any
}

// Reset password

export interface IResetPassword {
  data: any
}

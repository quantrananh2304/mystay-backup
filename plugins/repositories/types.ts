import { IHotelPrice } from './../../interfaces/hotelListPage'
import {
  IGetRoomPayload,
  IHotelDetail,
  IHotelDetailV2,
  IHotelReview,
  IPlansList,
  IRoomsList
} from '@/interfaces/hotelDetail'
import {
  IAccessToken,
  IClientSession,
  IResetPassword,
  ISignOut,
  IUserDetail
} from '~/interfaces/user'

export interface hotelRepo {
  getTiersList: (hotelId: number) => Promise<any>
  getHotelPrices: (payload: any) => Promise<IHotelPrice[]>
}

export interface reservationsRepo {
  createReservations: (payload: any) => Promise<any>
  getReservations: (payload: any) => Promise<any>
  cancelReservations: (payload: any) => Promise<any>
  updateReservations: (payload: any) => Promise<any>
  updateGuestDetail: (payload: any) => Promise<any>
  getSettingReservations: (payload: any) => Promise<any>
  getReservationQuestions: (payload: any) => Promise<any>
  updateBatch: (payload: any) => Promise<any>
  getReservationsList: () => Promise<any>
  getMyRewards: (payload: any) => Promise<any>
}

type IRoomPlan = IRoomsList | IPlansList
export interface hotelDetailRepo {
  getRoomsAndPlans: (payload: any) => Promise<IRoomPlan>
  getRooms: (payload: IGetRoomPayload) => Promise<IRoomsList>
  getPlans: (payload: IGetRoomPayload) => Promise<IPlansList>
  getHotelDetail: (payload: any) => Promise<IHotelDetail>
  getCancellationPolicies: (payload: any) => Promise<Array<string[]>>
  getRoomSelected: (payload: any) => Promise<any>
  getHotelSettings: (payload: any) => Promise<any>
}

export interface usersRepo {
  login: (payload: any) => Promise<IUserDetail>
  signUp: (payload: any) => Promise<IUserDetail>
  signOut: (payload: any) => Promise<ISignOut>
  resetPassword: (payload: any) => Promise<IResetPassword>
  updatePassword: (payload: any) => Promise<IResetPassword>
  getUserDetail: (payload: any) => Promise<IUserDetail>
  updateUserInfo: (payload: any) => Promise<IUserDetail>
  getMemberConfimation: (payload: any) => Promise<any>
  cancelMembership: (payload: any) => Promise<any>
  getMemberPoint: (payload: any) => Promise<any>
  getUserCard: (payload: any) => Promise<any>
  getClientSesstion: () => Promise<IClientSession>
  getAccessToken: () => Promise<IAccessToken>
  refreshToken: (
    hotelId: number | string,
    token: string
  ) => Promise<IUserDetail>
}

export interface guestRepo {
  getExtras: (payload: any) => Promise<any>
  getAdditionalQuestion: (payload: any) => Promise<any>
}

export interface triplaRepo {
  hotel: hotelRepo
  hotelDetail: hotelDetailRepo
  users: usersRepo
  guest: guestRepo
  reservations: reservationsRepo
}

export interface mystaysRepo {
  getHotelsList: (payload: any) => Promise<any>
  getHotelDetailV2: (payload: any) => Promise<IHotelDetailV2>
  getHotelReviews: (payload: any) => Promise<IHotelReview>
  getLocale: (payload: any) => Promise<any>
  getLocation: () => Promise<any>
}

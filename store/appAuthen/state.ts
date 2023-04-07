export const strict = false

export interface IAuthenState {
  isFetching: boolean,
  status: string,
  data: {
    position: { lat: number, long: number },
    locations: { lat: number, long: number }
  },
  params: string,
  errorMessage: string,
  actionType: string,
  success: boolean,
  canLoadMore: any,
  isSignupOpen: boolean,
  isLoginOpen: boolean,
  isShowCancelReservation: boolean,
  isResetPassword: boolean,
  isShowSearchBox: boolean,
  isOpenExpireTokenModal: boolean,
  isJoinInLoginBlock: boolean,
  hotelId: string | number,
  tokenModel: any
}

export default (): IAuthenState => ({
  isFetching: false,
  status: '',
  data: {
    position: { lat: 0, long: 0 },
    locations: { lat: 0, long: 0 }
  },
  params: '',
  errorMessage: '',
  actionType: '',
  success: false,
  canLoadMore: null,
  isSignupOpen: false,
  isLoginOpen: false,
  isShowCancelReservation: true,
  isResetPassword: false,
  isShowSearchBox: false,
  isOpenExpireTokenModal: false,
  isJoinInLoginBlock: false,
  hotelId: "",
  tokenModel: null
})

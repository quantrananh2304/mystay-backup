import { MutationTree } from "vuex";
import { UserActionTypes } from "./types";
import { RootState } from "./actions";
import moment from "moment";

const mutations: MutationTree<RootState> = {
  [UserActionTypes.LOGIN_USER](state, _action) {
    state.isFetching = true;
    state.error = null;

    state.data.isLogin = {};
    state.data.isLoading = true;
    state.loginErrorMessage = [];
  },
  [UserActionTypes.LOGIN_USER_SUCCESS](state, action) {
    state.isFetching = true;
    state.data.userData = action.payload;
    state.data.session = action.payload?.session;
    state.data.isLoading = false;
    state.success = true;
    state.error = "Login Successfully";

    state.data.isLogin = true;
  },
  [UserActionTypes.LOGIN_USER_FAIL](state, action) {
    state.data.userData = null;
    state.isFetching = false;
    state.success = false;
    state.data.isLoading = false;
    state.loginErrorMessage = action?.error?.message;

    state.data.isLogin = false;
  },
  [UserActionTypes.SIGNUP_USER](state, _action) {
    state.isFetching = true;
    state.error = null;
    state.data.isLoading = true;

    state.data.errorMsgSignUp = null;
  },
  [UserActionTypes.SIGNUP_USER_SUCCESS](state, _action) {
    state.isFetching = false;
    state.success = true;
    state.error = "Signup Successfully";

    state.data.isLoading = false;
  },
  [UserActionTypes.SIGNUP_USER_FAIL](state, action) {
    state.isFetching = false;
    state.success = action.payload;
    state.errorMessage = "Signup Failed";

    state.data.isLoading = false;

    state.data.errorMsgSignUp =
      action.error?.message[0]?.title || action.errors[0]?.title;
  },
  [UserActionTypes.GET_CLIENT_SESSION_SUCCESS](state, action) {
    state.isFetching = true;
    state.data.session_token = action.payload;
    state.error = null;
  },

  [UserActionTypes.GET_CLIENT_SESSION_FAIL](state, action) {
    state.isFetching = false;
    state.success = action.payload;
    state.errorMessage = "Get Session Failed";
  },

  [UserActionTypes.RESET_PASSWORD](state, action) {
    state.data.isLoading = true;
  },

  [UserActionTypes.RESET_PASSWORD_SUCCESS](state, action) {
    state.isFetching = true;
    state.data.session_token = action.payload;
    state.error = null;
    state.success = true;
    setTimeout(() => {
      state.data.isLoading = false;
    }, 200);
  },

  [UserActionTypes.RESET_PASSWORD_FAIL](state, action) {
    state.isFetching = false;
    state.errorMessage = action?.error?.message;
    state.success = false;
    setTimeout(() => {
      state.data.isLoading = false;
    }, 200);
  },

  [UserActionTypes.GET_USER_DETAIL](state, action) {
    // state.data.userData = null;
    state.data.isGetUserDetailLoading = true;
  },

  [UserActionTypes.GET_USER_DETAIL_SUCCESS](state, action) {
    state.data.isLogin = !!action.payload.id;
    state.data.userData = action.payload.id ? action.payload : null;
    setTimeout(() => {
      state.data.isGetUserDetailLoading = false;
    }, 100);
  },

  [UserActionTypes.GET_USER_DETAIL_FAIL](state, action) {
    state.data.isLogin = false;
    state.data.userData = null;
    setTimeout(() => {
      state.data.isGetUserDetailLoading = false;
    }, 100);
  },

  [UserActionTypes.LOGOUT_USER_SUCCESS](state, _action) {
    state.isFetching = true;
    state.data.userData = null;
    state.data.session = "";
    state.success = false;
    state.error = "Logout Successfully";

    state.data.isLogin = false;
  },

  [UserActionTypes.LOGOUT_USER_FAIL](state, _action) {
    state.isFetching = false;
    state.success = false;
    state.errorMessage = "Logout Failed";
  },

  [UserActionTypes.UPDATE_USER_INFO](state, _action) {
    state.data.isUpdateSuccess = "";
  },

  [UserActionTypes.UPDATE_USER_INFO_SUCCESS](state, action) {
    state.isFetching = true;

    state.data.session_token = action.payload;
    state.error = null;
    state.data.userData = action.payload.id ? action.payload : null;

    state.data.isUpdateSuccess = true;
  },

  [UserActionTypes.UPDATE_USER_INFO_FAIL](state, _action) {
    state.isFetching = false;
    state.success = false;

    state.errorMessage = "Update User Failed";
    state.data.isUpdateSuccess = false;

    state.data.userData = {
      ...state.data.userData,
      first_name: state.data.userData.first_name,
      last_name: state.data.userData.last_name,
      email_permission: state.data.userData.email_permission,
      phone: state.data.userData.phone,
      first_name_kana: state.data.userData.first_name_kana,
      last_name_kana: state.data.userData.last_name_kana
    };
  },

  [UserActionTypes.GET_RESSET_PASSWORD_TOKEN](state, action) {
    state.data.ressetPasswordToken = action.payload;
  },
  [UserActionTypes.UPDATE_PASSWORD](state, _action) {
    state.data.isLoading = true;
    state.data.errorMsg = null;
  },

  [UserActionTypes.UPDATE_PASSWORD_SUCCESS](state, _action) {
    state.data.isLoading = false;
    state.data.isResetPasswordSuccess = true;
  },

  [UserActionTypes.UPDATE_PASSWORD_FAIL](state, action) {
    state.data.isLoading = false;
    state.data.errorMsg = action.error?.message[0].title;
  },

  [UserActionTypes.GET_MEMBER_CONFIRMATION](state, _action) {
    state.dataisConfirmationSuccess = "";
  },

  [UserActionTypes.GET_MEMBER_CONFIRMATION_SUCCESS](state, action) {
    state.isFetching = true;
    state.data.userData = action.payload.data;
    state.data.session = action.payload?.data?.session;
    state.success = true;
    state.error = "Login Successfully";

    state.data.isLogin = true;
    state.data.isConfirmationSuccess = true;
  },

  [UserActionTypes.GET_MEMBER_CONFIRMATION_FAIL](state, action) {
    state.data.userData = action.payload.data;
    state.data.isConfirmationSuccess = false;
  },

  [UserActionTypes.GET_MEMBERSHIP_POINT_SUCCESS](state, action) {
    state.data.points = action;
  },

  [UserActionTypes.GET_MEMBERSHIP_POINT_FAIL](state, action) {},

  [UserActionTypes.GET_MY_REWARDS_SUCCESS](state, action) {
    state.data.myRewards = action;
  },

  [UserActionTypes.GET_MY_REWARDS_FAIL](state, action) {},

  [UserActionTypes.GET_RESERVAIONS_LIST](state) {
    state.data.isGetReservationsListLoading = true
  },

  [UserActionTypes.GET_RESERVAIONS_LIST_SUCCESS](state, response) {
    state.data.reservationsList = response;
    state.data.isGetReservationsListLoading = false
  },

  [UserActionTypes.GET_RESERVAIONS_LIST_FAIL](state) {
    state.data.isGetReservationsListLoading = false
  }
};

export default mutations;

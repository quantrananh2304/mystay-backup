import { MutationTree } from "vuex";
import { IAuthenState } from "./state";
import * as fromTypes from "./types";

const mutations: MutationTree<IAuthenState> = {
  [fromTypes.GET_LOCATION](state, action) {
    state.data.locations = {
      lat: action.payload.lat,
      long: action.payload.long
    };
    state.errorMessage = "null";
  },

  [fromTypes.TOGGLE_LOGIN](state, action) {
    state.isLoginOpen = action.payload.isLoginOpen;
    state.isSignupOpen = false;

    if (action.payload.isJoinInLoginBlock) {
      state.isJoinInLoginBlock = action.payload.isJoinInLoginBlock;
      state.hotelId = action.payload.hotelId;
    } else {
      state.isJoinInLoginBlock = false;
      state.hotelId = "";
    }
  },

  [fromTypes.TOGGLE_SIGNUP](state, action) {
    state.isSignupOpen = action.payload.isSignupOpen;
    state.isLoginOpen = false;

    if (action.payload.isJoinInLoginBlock) {
      state.isJoinInLoginBlock = action.payload.isJoinInLoginBlock;
      state.hotelId = action.payload.hotelId;
    } else {
      state.isJoinInLoginBlock = false;
      state.hotelId = "";
    }
  },

  [fromTypes.SHOW_CANCEL_RESERVATION](state, action) {
    state.isShowCancelReservation = action.payload;
  },

  [fromTypes.GO_TO_RESSET_PASSWORD_CONFIRM](state) {
    state.isResetPassword = true;
  },

  [fromTypes.GO_TO_LOGIN](state) {
    state.isResetPassword = false;
  },

  [fromTypes.RESET_DATA](state) {
    state.isResetPassword = false;
  },

  [fromTypes.TOGGLE_HEADER_SEARCH_BOX](state, payload) {
    state.isShowSearchBox = payload;
  },

  [fromTypes.OPEN_EXPIRE_TOKEN_MODAL](state, tokenModel) {
    state.tokenModel = tokenModel;
  }
};

export default mutations;

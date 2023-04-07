import * as types from "./types";

export default {
  [types.authTypes.GET_ACCESS_TOKEN_SUCCESS](state: any, action: any) {
    state.data.access_token = action.resp;
  },

  [types.authTypes.GET_ACCESS_TOKEN_FAIL](state: any, action: any) {
    state.isFetching = false;
    state.success = action.payload;
    state.data.access_token = "";
  },
  [types.authTypes.GET_CLIENT_SESSION_SUCCESS](state: any, action: any) {
    state.data.session_token = action.resp;
  },

  [types.authTypes.GET_CLIENT_SESSION_FAIL](state: any, action: any) {
    state.isFetching = false;
    state.success = action.payload;
    state.data.session_token = "";
  },

  [types.authTypes.GET_MYSTAYS_TOKEN_SUCCESS](state: any, token: string) {
    state.mystaysToken = token;
  },

  [types.authTypes.GET_MYSTAYS_TOKEN_FAIL](state: any) {
    state.mystaysToken = null;
  }
};

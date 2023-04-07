import * as types from "./types";

import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  toggleLogin({ commit }, payload) {
    commit(types.TOGGLE_LOGIN, { payload });
  },

  toggleSignup({ commit }, payload) {
    commit(types.TOGGLE_SIGNUP, { payload });
  },

  showCancelReservation({ commit }, payload) {
    commit(types.SHOW_CANCEL_RESERVATION, { payload });
  },

  goToRessetPasswordConfirm({ commit }, payload) {
    commit(types.GO_TO_RESSET_PASSWORD_CONFIRM, { payload });
  },

  goToLogin({ commit }, payload) {
    commit(types.GO_TO_LOGIN, { payload });
  },

  resetData({ commit }) {
    commit(types.RESET_DATA, {});
  },

  toggleHeaderSearchBox({ commit }, payload: boolean) {
    commit(types.TOGGLE_HEADER_SEARCH_BOX, payload);
  },

  openExpireTokenModal({ commit }, tokenModel) {
    commit(types.OPEN_EXPIRE_TOKEN_MODAL, tokenModel);
  }
};

export default actions;

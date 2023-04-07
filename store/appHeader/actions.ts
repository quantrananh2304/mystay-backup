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
  changeLanguage({ commit }, payload) {
    commit(types.CHANGE_LANGUAGE, { payload });
  }
};

export default actions;

import * as fromTypes from "./types";
import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  showHeaderSearch({ commit }, payload: boolean) {
    commit(fromTypes.SHOW_HEADER_SEARCH, { payload });
  }
};

export default actions;

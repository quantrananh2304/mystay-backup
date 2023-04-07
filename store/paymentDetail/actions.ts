import * as types from "./types";
import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  changePaymentMethod: ({ commit }, paymentMethod) => {
    commit(types.PAYMENT_METHOD_SELECTED, paymentMethod);
  },
  changeMonthYearSelectorStatus: ({ commit }, payload) => {
    commit(types.CHANGE_MONTH_YEAR_SELECTOR_STATUS, { payload });
  },
  changeFormSelectedStatus: ({ commit }, payload) => {
    commit(types.CHANGE_FORM_SELECTED_STATUS, { payload });
  },
  triggerPayment: ({ commit }) => {
    commit(types.TRIGGER_PAYMENT);
  },
  setValidForm: ({ commit }, payload) => {
    commit(types.SET_FORM_PAYMENT_VALID, { payload });
  },
  getDataPayment: ({ commit }, payload) => {
    commit(types.GET_DATA_PAYMENT, { payload });
  },
  resetPaymentMethod({ commit }) {
    commit(types.RESET_PAYMENT_METHOD);
  }
};

export default actions;

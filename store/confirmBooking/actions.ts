import * as types from "./types";

import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  getReservationQuestion({ commit }, payload) {
    commit(types.ConfirmBookingTypes.GET_RESERVATION_QUESTION);
    this.$triplaRepo.reservations
      .getReservationQuestions(payload)
      .then(resp => {
        commit(types.ConfirmBookingTypes.GET_RESERVATION_QUESTION_SUCCESS, {
          payload: resp.data
        });
      })
      .catch(error => {
        commit(types.ConfirmBookingTypes.GET_RESERVATION_QUESTION_FAIL, {
          error
        });
      });
  },

  updateBatch({ commit }, payload) {
    commit(types.ConfirmBookingTypes.UPDATE_BATCH);
    this.$triplaRepo.reservations
      .updateBatch(payload)
      .then(resp => {
        commit(types.ConfirmBookingTypes.UPDATE_BATCH_SUCCESS, {
          payload: resp.data
        });
      })
      .catch(error => {
        commit(types.ConfirmBookingTypes.UPDATE_BATCH_FAIL, {
          error
        });
      });
  }
};

export default actions;

import AppInitUseCase from "../../domain/usecases/general/appInitation";
import { GeneralActionTypes } from "./types";

import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  initApplication({ commit }) {
    commit(GeneralActionTypes.INIT_APPLICATION);
    const appInitUseCase = new AppInitUseCase();
    appInitUseCase
      .execute()
      .then(resp => {
        commit(GeneralActionTypes.INIT_APPLICATION_SUCCESS, {
          payload: resp
        });
      })
      .catch(error => {
        commit(GeneralActionTypes.INIT_APPLICATION_ERROR, {
          error
        });
      });
  },

  getLocale({ commit }, payload: string) {
    const params = {
      TargetLanguage: payload === "en-US" ? "en" : payload,
      KeyWord: "",
      IsClearCache: true
    };
    this.$mystaysRepo
      .getLocale(params)
      .then(response => {
        commit(GeneralActionTypes.GET_LOCALE_SUCCESS, {
          payload: response.data
        });
      })
      .catch(error => {
        commit(GeneralActionTypes.GET_LOCALE_FAIL, {
          error
        });
      });
  },

  getDeviceInfo({ commit }, payload: boolean) {
    commit(GeneralActionTypes.GET_DEVICE_INFO, {
      payload
    });
  },

  getLocation({ commit }) {
    commit(GeneralActionTypes.GET_LOCATION);
    this.$mystaysRepo
      .getLocation()
      .then(res => {
        commit(GeneralActionTypes.GET_LOCATION_SUCCESS, {
          payload: res.data
        });
      })
      .catch(error => {
        commit(GeneralActionTypes.GET_LOCATION_FAIL, {
          error
        });
      });
  },

  savePageLoaded({ commit }) {
    commit(GeneralActionTypes.SAVE_PAGE_LOADED);
  }
};

export default actions;

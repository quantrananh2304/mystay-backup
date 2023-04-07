import * as types from "./types";

import { ActionTree } from "vuex";
import state from "./state";
export type RootState = ReturnType<typeof state>;

const actions: ActionTree<RootState, RootState> = {
  getAccessToken({ commit }) {
    this.$axios
      .post("/api/getAccesstoken", {})
      .then(res => {
        (this as any).$cookiz.set("access_token", res.data);
        this.$mystaysApi.setHeader("authorization", `Bearer ${res.data}`);
        return res;
      })
      .then(resp => {
        commit(types.authTypes.GET_ACCESS_TOKEN_SUCCESS, {
          resp
        });
      })
      .catch(error => {
        commit(types.authTypes.GET_ACCESS_TOKEN_FAIL, {
          error
        });
      });
  },

  getClientSessionToken({ commit }) {
    this.$axios
      .post("/api/getClientSession", {})
      .then(res => {
        (this as any).$cookiz.set("Client-Session", res.data, {
          expires: new Date(Date.now() + 2592000)
        });
        this.$triplaApi.setHeader("client-session", res.data);
        return res;
      })
      .then(resp => {
        commit(types.authTypes.GET_CLIENT_SESSION_SUCCESS, {
          resp
        });
      })
      .catch(error => {
        commit(types.authTypes.GET_CLIENT_SESSION_FAIL, {
          error
        });
      });
  },

  getMystaysToken({ commit }) {
    this.$api
      .$get("/api/core/CoreAuthentication/GenerateToken")
      .then(data => {
        this.$api.setHeader("Authorization", `Bearer ${data.token}`);
        this.$api.setHeader("ContextSite", "Mystays");
        this.$cookiz.set("mystaysToken", data.token);
        commit(types.authTypes.GET_MYSTAYS_TOKEN_SUCCESS, data.token);
      })
      .catch(err => {
        commit(types.authTypes.GET_MYSTAYS_TOKEN_SUCCESS, err);
      });
  }
};

export default actions;

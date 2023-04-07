import { AxiosError } from "axios";
import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Plugin } from "@nuxt/types";

const mystays: Plugin = ({ $axios, $cookiz }, inject) => {
  const mystaysToken = $cookiz.get("mystaysToken");

  const api = $axios.create({
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        audience: "https://phase2.booking.mystays.com",
        "Target-Language": "en",
        ContextSite: "Mystays",
        ...(mystaysToken && { authorization: `${mystaysToken}` })
      }
    }
  }) as NuxtAxiosInstance;

  api.setBaseURL("https://www.mystays.com");

  api.onError(async (error: AxiosError | any) => {
    const originalConfig = error.config;
    if (
      error.response.status === 401 ||
      (error.response.status === 500 && !originalConfig._retry)
    ) {
      originalConfig._retry = true;
      try {
        const headers = {
          UserName: "sitecore\\InternalApiUser",
          Password: "InternalApiUser",
          Audience: "https://phase2.booking.mystays.com"
        };
        const rs = await api.get("/api/core/CoreAuthentication/GenerateToken", {
          headers
        });

        if (rs) {
          const { token, expired } = rs.data;

          originalConfig.headers["authorization"] = `Bearer ${token}`;
          api.setHeader("authorization", `Bearer ${token}`);

          $cookiz.set("mystaysToken", token, {
            path: "/",
            expires: new Date(expired)
          });
        }
        return api(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
  });

  inject("api", api);
};

export default mystays;

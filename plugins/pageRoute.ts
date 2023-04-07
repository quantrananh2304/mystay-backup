import  PageRoute from "../shared/constants/PageRoute";

import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $pageRoute: typeof PageRoute;
  }
}

const pageName: Plugin = (_context, inject) => {
  inject("pageRoute", PageRoute);
};

export default pageName;

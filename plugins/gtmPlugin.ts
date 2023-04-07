import { $gtm } from "./gtm";
import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    gtm: {
      init: () => void;
      push: (data: any) => void;
    };
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $gtm: {
      init: () => void;
      push: (data: any) => void;
    };
  }
}

const gtmPlugin: Plugin = (_context, inject) => {
  // inject("gtm", $gtm);
};

export default gtmPlugin;

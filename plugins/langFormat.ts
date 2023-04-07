import formatLanguage from "../shared/helper/formatLanguage";

import { Plugin } from "@nuxt/types";

declare module 'vue/types/vue' {
  interface Vue {
    $langFormat(lang: string): void
  }
}

const langFormat: Plugin = (_context, inject) => {
  inject("langFormat", formatLanguage);
};

export default langFormat;

import languages from "../shared/constants/language";

import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $lang(lang: string): void;
  }
}

const language: Plugin = (_context, inject) => {
  inject("lang", languages);
};

export default language;

import dateTime from "../shared/helper/dateTimeFormat";

import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $dateTime(date: Date | string, lang: string): void;
  }
}

const dateTimeFormat: Plugin = (_context, inject) => {
  inject("dateTime", dateTime);
};

export default dateTimeFormat;

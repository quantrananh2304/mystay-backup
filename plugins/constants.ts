import Constants from "../shared/constants/constantsPlugin";
import {
  paramsHotelDetail,
  paramsSearchHotel,
  paramsHotelDetailFromWidget
} from "../shared/constants/hotelQuery";

import { currencyHelper } from "../shared/helper/CurrencyHelper";

import { Plugin } from "@nuxt/types";

declare module "vue/types/vue" {
  interface Vue {
    $constants: typeof Constants;
    $hotelDetailQuery: typeof paramsHotelDetail;
    $hotelSearchQuery: typeof paramsSearchHotel;
    $paramsHotelDetailFromWidget: typeof paramsHotelDetailFromWidget;
  }
}

const ConstantsPlugin: Plugin = (_context, inject) => {
  inject("constants", Constants);
  inject("hotelDetailQuery", paramsHotelDetail);
  inject("hotelSearchQuery", paramsSearchHotel);
  inject("paramsHotelDetailFromWidget", paramsHotelDetailFromWidget);
  inject("currencyHelper", currencyHelper);
};

export default ConstantsPlugin;

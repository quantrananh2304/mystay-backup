import Vue from "vue";
import dateTime from "../shared/helper/dateTimeFormat";

Vue.filter("capitalize", (val: any) => val.toUpperCase());

Vue.filter("datetime", dateTime);

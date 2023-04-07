import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default ($triplaApi: NuxtAxiosInstance) => ({
  getExtras: (params: any) => {
    const url = `/hotels/${params.hotelID}/extras?q=${JSON.stringify(
      params.queryString
    )}`;

    return $triplaApi.get(url);
  },

  getAdditionalQuestion: (payload: any) => {
    const url = `/hotels/${
      payload.hotelID
    }/additional_questions?q=${JSON.stringify(
      payload.queryString
    )}&room_plan_codes=${payload.room_plan_code}`;

    return $triplaApi.get(url);
  }
});

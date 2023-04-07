import { NuxtAxiosInstance } from "@nuxtjs/axios";

export default ($triplaApi: NuxtAxiosInstance) => ({
  createReservations: (payload: any) => {
    return $triplaApi.post(
      `/hotels/${payload.hotelId}/reservations`,
      payload.queryParam
    );
  },

  getReservations: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}?email=${payload.email}&bypass_token=${payload.byPassToken}`;

    return $triplaApi.get(url);
  },

  cancelReservations: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}/cancel/?email=${payload.email}&bypass_token=${payload.byPassToken}`;

    return $triplaApi.put(url, payload.body);
  },

  updateReservations: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}?email=${payload.email}&bypass_token=${payload.byPassToken}`;

    return $triplaApi.put(url, payload.body);
  },

  updateGuestDetail: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}/guests`;

    return $triplaApi.put(url, payload.body);
  },

  getSettingReservations: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}/update_settings?email=${payload.email}&bypass_token=${payload.byPassToken}`;

    return $triplaApi.get(url);
  },

  getReservationQuestions: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${
      payload.reservationID
    }/additional_questions?email=${payload.email}&bypass_token=${
      payload.byPassToken
    }&q=${JSON.stringify(payload.q)}`;

    return $triplaApi.get(url);
  },

  updateBatch: (payload: any) => {
    const url = `/hotels/${payload.hotelID}/reservations/${payload.reservationID}/additional_questions/batch_update`;

    return $triplaApi.put(url, payload.body);
  },

  getReservationsList: () => {
    return $triplaApi.get("/user/reservations");
  },

  getMyRewards: (hotel_id: number) => {
    return $triplaApi.get(`/hotels/${hotel_id}/memberships/point_histories`);
  },

  receipt(hotel_id: number | string, reservation_no: string) {
    return $triplaApi.get(
      `hotels/${hotel_id}/reservations/${reservation_no}/receipt?email=phonght@smartosc.com`
    );
  }
});

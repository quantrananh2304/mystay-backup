import HotelStorage from "./storage";
export default class HotelRepository {
  checkPromoCode = (promoCode: string): Promise<any> => {
    // return HotelCloud.checkPromoCode(promoCode);
    return new Promise((resolve, reject) => {
      const promoCodes = ["aaaa", "bbbb", "cccc", "dddd", "eeee"];
      const result = promoCodes.includes(promoCode.toLowerCase());

      if (result) {
        resolve({ match: true, success: 1 });
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ match: false, success: 0 });
      }
    });
  };

  saveSearchResult = (searchParams: any) => {
    return HotelStorage.saveResult(searchParams);
  };

  setInitialBooking = (payload: any) => {
    return HotelStorage.setInitialooking(payload);
  };

  getInitialBooking = () => {
    return HotelStorage.getInitialooking();
  };
}

import { IRoomState } from "./types";

export interface IBookingState {
  success: boolean;
  bookingState: {
    location: boolean;
    checking: boolean;
    roomSelect: boolean;
    nightSelect: boolean;
    promoCode: boolean;
    searchButton: boolean;
  };
  bookingData: {
    location: null | string;
    checkIn: null | string;
    totalNight: null | number;
    checkOut: null | string;
    checkOutBeforeBookingUseDay: null | string;
    roomList: IRoomState[];
    promoCode: null;
    promoCodeExist: {};
    search_type: string;
    searchType: string;
    reservations: null;
    hotelID: string;
    totalGuest: number;
    is_day_use: boolean;
    is_undated: boolean;
    is_including_occupied: boolean;
    type: string;
    room_type_codes: string;
    room_plan_codes: string;
    roomTypeCodes: Array<any>;
    tab: string;
  };
  searchData: {
    location: string;
    searchType: string;
  };
  bookingError: {
    location: {
      type: null;
      msg: null;
    };
    roomSelect: {
      type: null;
      msg: null;
    };
    promocode: {
      type: null;
      msg: null;
    };
  };
  paymentState: {
    isLoading: boolean;
  };
  isShowTotalGuest: boolean;
  roomIndex: 1;
  reservationData: {};
  isReservationLoading: boolean;
  isUpdateLoading: boolean;
  reservationsSettings: {};
  reservationParams: {
    hotelID: string;
    reservationID: string;
    email: string;
    bypass_token: string;
  };
  reservationError: null;
  allowedSelectOneDay: boolean;
  cancelReservationMessage: undefined;
  successCancelReservationMessage: undefined;
  roomParamsForGetRoomSelected: Array<any>;
}

export default (): IBookingState => ({
  success: false,
  bookingState: {
    location: false,
    checking: false,
    roomSelect: false,
    nightSelect: false,
    promoCode: false,
    searchButton: false
  },
  bookingData: {
    location: null,
    checkIn: null,
    checkOut: null,
    search_type: "",
    checkOutBeforeBookingUseDay: null,
    totalNight: 0,
    roomList: [
      {
        id: "",
        adults: {
          title: "Adults",
          number: 1
        },
        children: {
          title: "Children",
          childrenList: []
        }
      }
    ],
    totalGuest: 1,
    promoCode: null,
    promoCodeExist: {},
    searchType: "",
    reservations: null,
    hotelID: "",
    is_day_use: false,
    is_undated: false,
    is_including_occupied: false,
    type: "rooms",
    room_type_codes: "",
    room_plan_codes: "",
    roomTypeCodes: [],
    tab: ""
  },
  searchData: {
    location: "",
    searchType: ""
  },
  bookingError: {
    location: {
      type: null,
      msg: null
    },
    roomSelect: {
      type: null,
      msg: null
    },
    promocode: {
      type: null,
      msg: null
    }
  },
  paymentState: {
    isLoading: false
  },
  isShowTotalGuest: false,
  roomIndex: 1,
  reservationData: {},
  isReservationLoading: false,
  isUpdateLoading: false,
  reservationsSettings: {},
  reservationParams: {
    hotelID: "",
    reservationID: "",
    email: "",
    bypass_token: ""
  },
  reservationError: null,
  allowedSelectOneDay: false,
  cancelReservationMessage: undefined,
  successCancelReservationMessage: undefined,
  roomParamsForGetRoomSelected: []
});

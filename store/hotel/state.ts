import { IHotelPriceItem } from "~/interfaces/hotelListPage";

export interface IHotelState {
  isFetching: boolean;
  status: string;
  data: {
    hotelList: Array<any>;
    hotelListForSearchBox: Array<any>;
    allHotels: Array<any>;
    hotelListFilter: Array<any>;
    hotelFilterByMapView: Array<any>;
    cityList: Array<any>;
    districtList: Array<any>;
    districtListFilter: Array<any>;
    isNearMe: boolean;
    hotelFilter: Array<any>;
    citySearch: Array<any>;
    bookingInformation: {
      area: {};
      checkIn: {};
      checkOut: {};
      guest: {};
      promotionCode: {};
    };
    areaModal: {
      isOpen: boolean;
    };
    checkin: {
      isOpen: boolean;
    };
    hotel_plans: {};
    recentSearch: Array<any>;
    filterModel: {
      sortBy?: string;
      tripTypeList?: Array<any>;
      popularFilterList?: Array<any>;
      price?: object;
      prefecture?: string;
      ratingCount?: Array<any>;
      isFilter?: boolean;
    };
    hotel_price: Array<IHotelPriceItem>;
    hotel_nearme: Array<any>;
    roomType: Array<any>;
    fullPath: string;
    fullPathHotelDetail: string;
    hotelID: string;
    tiers: {};
    tiersSettings: {};
    cheapestPrice: number;
    expensivePrice: number;
  };
  params: string;
  errorMessage: string;
  actionType: string;
  success: boolean;
  canLoadMore: boolean;
  isHotelLoading: boolean;
  isGetAllHotelLoading: boolean;
  isPriceLoading: boolean;
  isRenderHotelList: boolean;
}

export default (): IHotelState => ({
  isFetching: false,
  status: "",
  data: {
    hotelList: [],
    hotelListForSearchBox: [],
    allHotels: [],
    hotelListFilter: [],
    hotelFilterByMapView: [],
    cityList: [],
    districtList: [],
    districtListFilter: [],
    isNearMe: false,
    hotelFilter: [],
    citySearch: [],
    bookingInformation: {
      area: {},
      checkIn: {},
      checkOut: {},
      guest: {},
      promotionCode: {}
    },
    areaModal: {
      isOpen: false
    },
    checkin: {
      isOpen: false
    },
    hotel_plans: {},
    recentSearch: [],
    filterModel: {
      sortBy: "lowestToHighest",
      tripTypeList: [],
      popularFilterList: [],
      price: {},
      prefecture: "",
      ratingCount: [],
      isFilter: false
    },
    hotel_price: [],
    hotel_nearme: [],
    roomType: [],
    fullPath: "",
    fullPathHotelDetail: "",
    hotelID: "",
    tiers: {},
    tiersSettings: {},
    cheapestPrice: 0,
    expensivePrice: 1000
  },
  params: "",
  errorMessage: "",
  actionType: "",
  success: false,
  canLoadMore: false,
  isHotelLoading: false,
  isGetAllHotelLoading: false,
  isPriceLoading: false,
  isRenderHotelList: false
});

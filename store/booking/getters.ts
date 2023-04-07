import moment from "moment";
import { state } from "..";
import * as types from "./types";

export default {
  getCheckinDate: (state: any, _getters: any, rootState: any) => {
    return state.bookingData.checkIn;
  },
  getCheckoutDate: (state: any, _getters: any, rootState: any) => {
    return state.bookingData.checkOut;
  },
  totalGuest: (state: any) => {
    if (state.bookingData?.roomList?.length) {
      return state.bookingData.roomList
        .map(
          (x: types.IRoomModel) =>
            x.adults.number + x.children.childrenList.length
        )
        .reduce((a: number, b: number) => a + b);
    }
  },
  numberAdults: (state: any) => {
    if (state.bookingData?.roomList?.length) {
      return state.bookingData.roomList
        .map((x: types.IRoomModel) => x.adults.number)
        .reduce((a: number, b: number) => a + b);
    }
  },

  numberChildren: (state: any) => {
    if (state.bookingData.roomList) {
      return state.bookingData.roomList
        .map((x: types.IRoomModel) => x.children.childrenList.length)
        .reduce((a: number, b: number) => a + b);
    }
  },

  numberAdultsInFirstRoom: (state: any) => {
    return state.bookingData.roomList[0].adults.number;
  },

  numberChildrenInFirstRoom: (state: any) => {
    return state.bookingData.roomList[0].children.childrenList.length;
  },

  numberAdultsInRoomSelected: (state: any) => {
    if (state.roomParamsForGetRoomSelected.length) {
      return state.roomParamsForGetRoomSelected
        .map((x: types.IRoomModel) => x.adults.number)
        .reduce((a: number, b: number) => a + b);
    }
  },

  numberChildrenInRoomSelected: (state: any) => {
    if (state.bookingData?.roomList?.length) {
      return state.bookingData.roomList
        .map((x: types.IRoomModel) => x.children?.childrenList?.length)
        .reduce((a: number, b: number) => a + b);
    }
  },

  totalNight(state: any) {
    if (state.bookingData.is_undated) {
      return state.bookingData.totalNight
    }

    const checkIn = state.bookingData?.checkIn;
    const checkOut = state.bookingData?.checkOut;
    return -moment(checkIn, "YYYY-MM-DD").diff(moment(checkOut), "days");
  },

  numberOfDaysToCheckIn(state: any) {
    const checkIn = state.bookingData?.checkIn;
    const numberOfDaysToCheckIn = -moment(new Date(), "YYYY-MM-DD").diff(
      moment(checkIn, "YYYY-MM-DD"),
      "days"
    );

    return numberOfDaysToCheckIn + 1;
  },

  searchData(state: any) {
    return state.searchData;
  },

  roomList: (state: any) => {
    if (state?.bookingData?.roomList?.length) {
      return state.bookingData.roomList.map((room: types.IRoomModel) => {
        const roomModel = {
          adults: room.adults?.number,
          children: 0, // room.children?.childrenList?.length,
          kids_age_range: null
        };
        return roomModel;
      });
    }
  },

  isSelectedAge: (state: any) => {
    const roomList = state?.bookingData?.roomList;
    let isAgeSelect = true;
    if (roomList?.length) {
      for (let roomIndex = 0; roomIndex < roomList.length; roomIndex++) {
        const childrenList = roomList[roomIndex].children.childrenList;
        for (let childIdx = 0; childIdx < childrenList.length; childIdx++) {
          const children = childrenList[childIdx];
          if (children.age === "Select Tier") {
            isAgeSelect = false;
            break;
          }
        }
      }
    }

    return isAgeSelect;
  },

  roomListWithChildren(state: any) {
    if (state?.bookingData?.roomList?.length) {
      return state.bookingData.roomList.map((room: types.IRoomModel) => {
        const kidsAgeRange = room.children?.childrenList.map((kid: any) => {
          return {
            age: kid.age,
            bed: kid.bed
          };
        });
        const roomModel = {
          adults: room.adults?.number,
          children: room.children?.childrenList?.length,
          kids_tiers: kidsAgeRange
        };
        return roomModel;
      });
    }
  },

  hasChildren(state: any) {
    let hasChildren = false;
    const roomList = state?.bookingData?.roomList;
    if (roomList?.length) {
      roomList.forEach((room: any) => {
        if (room?.children?.childrenList?.length) {
          hasChildren = true;
        }
      });
    }

    return hasChildren;
  },

  promoCodeSave() {
    return 0;
  },

  roomData(state: any, _getters: any, rootState: any, rootGetters: any) {
    const { selectedRoom } = rootState.hotelDetail;
    const {
      guest,
      isBookingForSomeoneElse,
      someoneElseData
    } = rootState.guestDetail;
    const roomParams = state.roomParamsForGetRoomSelected.map(
      (room: types.IRoomModel) => {
        const kidsAgeRange = room.children?.childrenList.map((kid: any) => {
          return {
            age: kid.age,
            bed: kid.bed
          };
        });
        const roomModel = {
          adults: room.adults?.number,
          children: room.children?.childrenList?.length,
          kids_tiers: kidsAgeRange
        };
        return roomModel;
      }
    );
    const totalPrice = rootGetters["hotelDetail/totalPrice"];
    const roomData = selectedRoom.map((item: any, index: number) => {
      const guestIndex = guest[index] ? guest[index] : guest[0];
      return {
        ...roomParams[index],
        guest: isBookingForSomeoneElse ? someoneElseData : guestIndex,
        room_plan_code: item.plan.roomPlanCode || item.room.roomPlanCode,
        room_type_code: item.room.roomId,
        room_count: 1,
        total_price: totalPrice,
        membership_promotion_id: null,
        adult_companion: null,
        kid_tier_a_companion: null
      };
    });

    return roomData;
  },

  roomSelectedParams(state: any, _getters: any, rootState: any) {
    const { selectedRoom } = rootState.hotelDetail;
    // const roomList = state?.bookingData?.roomList;

    const roomParams = state.roomParamsForGetRoomSelected.map(
      (room: types.IRoomModel) => {
        const kidsAgeRange = room.children?.childrenList.map((kid: any) => {
          return {
            age: kid.age,
            bed: kid.bed
          };
        });
        const roomModel = {
          adults: room.adults?.number,
          children: room.children?.childrenList?.length,
          kids_tiers: kidsAgeRange
        };
        return roomModel;
      }
    );

    const firstRoomSelected = selectedRoom[0];

    const roomData = {
      ...roomParams[0],
      room_plan_code:
        firstRoomSelected.plan.roomPlanCode ||
        firstRoomSelected.room.roomPlanCode,
      room_type_code: firstRoomSelected.room.roomId,
      room_count: 1,
      total_price: firstRoomSelected.room?.rate || firstRoomSelected.plan?.rate,
      checkin_date: state.bookingData.checkIn,
      checkout_date: state.bookingData.checkOut
    };

    return selectedRoom.map((room: any) => roomData);
  },

  reservationsData(state: any) {
    return state.reservationData;
  },

  bookingID(state: any) {
    return state.reservationData?.reservation_number;
  },

  byPassToken(state: any) {
    return state.reservationData?.bypass_token;
  },

  hotelDetailRouteParams(
    state: any,
    _getters: any,
    _rootState: any,
    rootGetters: any
  ) {
    const routeParams = {
      checkIndate: state.bookingData.checkIn,
      checkOutdate: state.bookingData.checkOut,
      language: rootGetters["appHeader/fullLanguage"],
      promoCode: state.bookingData.promoCode,
      is_day_use: state.bookingData.is_day_use,
      is_including_occupied: state.bookingData.is_including_occupied,
      type: state.bookingData.type,
      rooms: JSON.stringify(state.bookingData.roomList),
      nights: _getters.totalNight
    };

    return routeParams;
  },

  roomTypeCodes(state: any) {
    return state.bookingData.roomTypeCodes;
  }
};

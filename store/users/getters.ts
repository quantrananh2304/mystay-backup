import moment from "moment";
import { UserState } from "./state";
export default {
  userList: (state: UserState) => {
    return state.data.users;
  },
  signupUserSuccess: (state: UserState) => {
    return state.success;
  },
  loginUserSuccess: (state: UserState) => {
    return state.data.isLogin;
  },
  userData: (state: UserState) => {
    return state.data.userData;
  },
  points: (state: UserState) => {
    return state.data.points;
  },
  reservationsList: (state: any) => {
    const isPast = (checkoutDate: string) =>
      moment(new Date()).isAfter(checkoutDate);

    const reservationsList = state.data?.reservationsList?.map(
      (reservation: any) => {
        let status = reservation.status;
        let statusNumber = 0;

        if (status == "done" && !isPast(reservation.checkout_date)) {
          status = "coming_up";
          statusNumber = 0;
        }

        switch (status) {
          case "coming_up":
            statusNumber = 0;
            break;
          case "done":
            statusNumber = 1;
            break;
          case "cancelled":
            statusNumber = 2;
            break;
          default:
            break;
        }

        const rooms = reservation.rooms.slice(0, 1);

        return {
          ...reservation,
          status,
          rooms,
          statusNumber
        };
      }
    );

    const reservationsListSorting = reservationsList.sort(
      (a: any, b: any) => a.statusNumber - b.statusNumber
    );
    return reservationsListSorting;
  },
  myRewards: (state: UserState) => {
    return state.data.myRewards;
  },

  rankImage: (state: UserState) => {
    const rank = state.data.userData?.rank;

    return rank?.image;
  },

  memberRank: (state: UserState) => {
    const rank = state.data.userData?.rank;

    return rank?.translations_attributes;
  },

  isLogin(state: UserState) {
    return !!state.data.userData;
  },

  hideSignInUp(state: any) {
    return state.data.hideSignInUp;
  },

  isGetReservationsListLoading(state: any){
    return state.data.isGetReservationsListLoading
  }
};

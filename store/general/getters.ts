export default {
  myLocation: (state: any) => {
    return state.data.location;
  },
  userLocation: (state: any) => {
    return state.data.userLocation;
  },
  isNearMe: (state: any) => {
    return state.data.isNearMe;
  },
  isPageLoaded: (state: any) => {
    return state.data.isPageLoaded;
  },
  isMobile(state: any) {
    return state.data.isMobile;
  }
};

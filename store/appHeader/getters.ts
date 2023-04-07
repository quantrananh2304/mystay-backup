export default {
  language: (state: any) => {
    if (state.data.fullLang === "zh-TW") {
      return "tw";
    }

    return state.data?.fullLang.slice(0, 2);
  },
  fullLanguage: (state: any) => state.data.fullLang,
  position: (state: any) => state.position,
  isSignupOpen: (state: any) => state.isSignupOpen,
  isLoginOpen: (state: any) => state.isLoginOpen
};

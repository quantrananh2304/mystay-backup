export const strict = false;
export const namespaced = true;
import { defaultLanguage } from "~/shared/constants/index";

export default (): any => ({
  isFetching: false,
  status: "",
  data: {
    language: defaultLanguage.lang,
    fullLang: defaultLanguage.fullLang,
    currency: "$"
  },
  params: "",
  errorMessage: "",
  actionType: "",
  success: false,
  canLoadMore: null,
  isSignupOpen: false,
  isLoginOpen: false
});

import moment, { LocaleSpecifier } from "moment";

const dateTimeFormat = (
  date: string | Date,
  lang: LocaleSpecifier,
  isYear?: boolean
) => {
  let format = `MMM DD${isYear ? "," : ""} ${isYear ? "YYYY" : ""}`;

  switch (lang) {
    case "ja":
      format = `${isYear ? "YYYY年" : ""} MM月 DD日`;
      break;
    case "ko":
      format = `${isYear ? "YYYY년" : ""} MM월 DD일`;
      break;
    case "zh_Hant":
      format = `${isYear ? "YYYY年" : ""} MM月 DD日`;
      lang = "zh-TW";
      break;
    case "zh_Hans":
      format = `${isYear ? "YYYY年" : ""} MM月 DD日`;
      lang = "zh-CN";
      break;
  }
  return moment(new Date(date),"YYYY-MM-DD")
    .locale(lang)
    .format(format)
    .toString();
};

export default dateTimeFormat;

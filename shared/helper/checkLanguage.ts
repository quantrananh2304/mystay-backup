export const checkLanguage = (lang: string | any): any => {
  const shortLangsArr = ["en", "ja", "ko", "zh", "cn"];
  const fullLangsArr = ["en-US", "ja-JP", "ko-KR", "zh-CN", "zh-TW"];

  let shortLang = lang;
  let fullLang = lang;

  if (lang) {
    if (shortLangsArr.includes(lang)) {
      shortLang = lang;

      switch (lang) {
        case "en":
          fullLang = fullLangsArr[0];
          break;
        case "ja":
          fullLang = fullLangsArr[1];
          break;
        case "ko":
          fullLang = fullLangsArr[2];
          break;
        case "zh":
          fullLang = fullLangsArr[3];
          break;
        case "tw":
          fullLang = fullLangsArr[4];
          break;
        default:
          break;
      }
    } else if (fullLangsArr.includes(lang)) {
      shortLang = lang.slice(0, 2);
      fullLang = lang;
    } else {
      shortLang = "";
      fullLang = "";
    }
  }

  return shortLang && fullLang
    ? {
        shortLang,
        fullLang
      }
    : false;
};

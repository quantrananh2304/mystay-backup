const formatLanguage = (lang: string) => {
  if (lang === "zh") {
    return "zh_Hans";
  }

  if (lang === "tw") {
    return "zh_Hant";
  }

  return lang;
};

export default formatLanguage;

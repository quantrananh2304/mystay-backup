export const guestInfo = (user: any, lang: any, $lang: any) => {
  const guestDefault = {
    email: "",
    name: "",
    first_name: "",
    last_name: "",
    first_name_kana: "",
    last_name_kana: "",
    phone: ""
  };

  if (user) {
    const guest = {
      email: user.email,
      name: user.name,
      first_name: user.first_name,
      last_name: user.last_name,
      first_name_kana: user.first_name_kana,
      last_name_kana: user.last_name_kana,
      phone: user.phone
    };
    return guest;
  }
  // $lang.ENGLISH.SHORT ? user.first_name

  return guestDefault;
};

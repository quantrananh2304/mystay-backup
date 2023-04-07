export const paramsHotelDetail = (bookingData: any, fullLang: string) => {
  return {
    checkIndate: bookingData.checkIn,
    checkOutdate: bookingData.checkOut,
    language: fullLang,
    coupon_code: bookingData.promoCode,
    is_day_use:
      bookingData.checkIn === bookingData.checkOut
        ? true
        : bookingData.is_day_use,
    is_including_occupied: bookingData.is_including_occupied,
    tab: '',
    // type: bookingData.type,
    rooms: JSON.stringify(bookingData.roomList)
  }
}

export const paramsHotelDetailFromWidget = (
  bookingData: any,
  fullLang: string
) => {
  const params: any = {
    // checkIndate: bookingData.checkIn,
    // checkOutdate: bookingData.checkOut,
    language: fullLang,
    coupon_code: bookingData.promoCode,
    // is_day_use:
    //   bookingData.checkIn === bookingData.checkOut
    //     ? true
    //     : bookingData.is_day_use,
    // is_including_occupied: bookingData.is_including_occupied,
    tab: bookingData.tab,
    room_type_codes: bookingData.room_type_codes,
    type: bookingData.type,
    rooms: JSON.stringify(bookingData.roomList)
    // search_type: bookingData.search_type,
    // nights: bookingData.nights
  }

  if (bookingData.search_type === 'undated') {
    params.search_type = bookingData.search_type
    params.nights = bookingData.nights
  } else {
    params.checkIndate = bookingData.checkIn
    params.checkOutdate = bookingData.checkOut
    params.is_day_use =
      bookingData.checkIn === bookingData.checkOut
        ? true
        : bookingData.is_day_use
    params.is_including_occupied = bookingData.is_including_occupied
  }

  return params
}

export const paramsSearchHotel = (bookingData: any, fullLang: string) => {
  return {
    location: bookingData.location,
    checkIndate: bookingData.checkIn,
    checkOutdate: bookingData.checkOut,
    language: fullLang,
    coupon_code: bookingData.promoCode,
    rooms: JSON.stringify(bookingData.roomList)
  }
}

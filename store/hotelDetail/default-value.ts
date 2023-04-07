export const HotelDetailDefaultValue = {
  data: {
    id: 1557,
    name: '',
    latitude: '',
    longitude: '',
    triplabot_code: '',
    is_demo: false,
    is_booking_widget_active: true,
    area: {
      id: 15,
      name: '沖縄'
    },
    address: {
      full_address: '',
      city: '',
      state: '',
      post_code: '',
      country: '',
      country_code: '',
      address_line_1: '',
      address_line_2: '',
      address_line_3: ''
    },
    amenities: [
      {
        id: 1,
        name: 'タオル',
        is_active: true
      }
    ],
    site_controller_config: {
      released: false
    }
  }
}

export const HotelDetailV2DefaultValue = {
  id: '',
  images: [],
  overview: '',
  checkin: '',
  checkout: '',
  location: '',
  email: '',
  phone: '',
  transportations: [
    {
      type: '',
      text: ''
    }
  ],
  amenityTags: [
    {
      id: '',
      type: '',
      text: ''
    }
  ],
  travelGoalTags: [],
  undatedSearch: false
}

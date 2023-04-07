export default {
  hotelsGetterList: (state: any) => {
    return state.data.hotelList
  },

  hotelFilterByMapView: (state: any) => {
    return state.data.hotelFilterByMapView
  },

  districtListFilterGetter: (state: any) => {
    return state.data.districtListFilter.length
      ? state.data.districtListFilter[0]
      : null
  },
  districtListFormat: (state: any) => {
    return state.data.districtList.map((district: any) => {
      return {
        value: district.name,
        text: district.name
      }
    })
  },
  // listAreasForRoute: (state: any, getters: any) => {
  //   let lists: Array<any> = []
  //   getters.hotelsGetterList?.forEach((val: any) => {
  //     lists.push(val.prefecture)
  //     lists.push(val.prefecturesName)
  //     lists.push(val.cityName)
  //   })

  //   const listAreas = lists?.concat(getters.districtListByName)

  //   const listAreasSet = new Set(listAreas)

  //   return listAreasSet || []
  // },
  // districtListByName: (state: any) => {
  //   return state.data.districtList.map((district: any) => {
  //     return district.name
  //   })
  // },
  hotelsDisplayList: (state: any) => {
    return state.data.hotelListForSearchBox.slice(0, 10)
  },
  citySearch: (state: any) => {
    if (state.data.citySearch && state.data.citySearch.length) {
      return state.data.citySearch[0]
    } else if (
      state.data.districtListFilter &&
      state.data.districtListFilter.length
    ) {
      return state.data.districtListFilter[0]
    }
    return ''
  },
  bookingInformation: (state: any) => {
    const areaModal = state.data.areaModal
    const bookingInformation = state.data.bookingInformation
    const isNearMe = state.data.isNearMe
    return {
      areaModal,
      bookingInformation,
      isNearMe
    }
  },

  mapMarkers: (state: any) => {
    return state.data.hotelList
  },

  allHotels: (state: any) => {
    return state.data.hotelFilter
  },

  allMarkers: (state: any) => {
    return state.data.hotelFilter
  },

  hotelSelected: (state: any) => {
    const hotel = state.data.hotelFilter?.filter((hotel: any) => {
      return hotel.triplaHotelId === state.data.hotelID
    })

    return hotel[0] || {}
  },

  tripTypeList: () => {
    return []
  },

  popularFilterList: () => {
    return []
  },

  hotelFilter: (state: any) => {
    const hotelFilterByMapView = state.data.hotelFilterByMapView
    const hotelFilter = state.data.hotelFilter
    const filterModel = state.data.filterModel

    const filters = {
      priceFilter: (item: any) =>
        item.price >= filterModel.price.minPrice &&
        item.price <= filterModel.price.maxPrice,
      prefectureFilter: (item: any) => {
        return (
          item.city
            ?.toLowerCase()
            .includes(filterModel.prefecture?.toLowerCase()) ||
          item.prefecture
            ?.toLowerCase()
            .includes(filterModel.prefecture?.toLowerCase()) ||
          item.district
            ?.toLowerCase()
            .includes(filterModel.prefecture?.toLowerCase())
        )
      }
    }
    const selected = [filters.priceFilter]

    let hotelFilterByPrice = []
    if (filterModel.isFilter) {
      if (filterModel.prefecture) {
        hotelFilterByPrice = hotelFilter.filter((hotel: any) =>
          selected.every(fn => fn(hotel))
        )
      } else {
        hotelFilterByPrice = hotelFilterByMapView.filter((hotel: any) =>
          selected.every(fn => fn(hotel))
        )
      }
    } else {
      hotelFilterByPrice = hotelFilterByMapView
    }

    switch (filterModel.sortBy) {
      case 'mostPopular':
        hotelFilterByPrice.sort((a: any, b: any) => {
          return b.popularOrder - a.popularOrder
        })
        break
      case 'highestToLowest':
        hotelFilterByPrice.sort((a: any, b: any) => {
          return b.price - a.price
        })
        break
      case 'lowestToHighest':
        hotelFilterByPrice.sort((a: any, b: any) => {
          return a.price - b.price
        })
        break
      case 'distance':
        hotelFilterByPrice.sort((a: any, b: any) => {
          return a.distanceToUser - b.distanceToUser
        })
        break

      case 'highReview':
        hotelFilterByPrice.sort((a: any, b: any) => {
          return b.numberOfReviews - a.numberOfReviews
        })
        break
      default:
        break
    }

    return hotelFilterByPrice
  },

  listHotelIDFilter: (_state: any, getters: any) => {
    const hotelFilter = getters.hotelFilter

    const listID = hotelFilter.map((hotel: any) => Number(hotel.triplaHotelId))
    return listID
  },

  listHotelCodeFilter: (state: any, getters: any) => {
    const hotelFilter = getters.hotelFilter

    const listCodes = hotelFilter.map((hotel: any) => hotel.bookingCode)
    return listCodes
  },

  listHotelID: (state: any) => {
    const hotelList = state.data.allHotels
    const listID: Array<any> = []
    if (hotelList.length) {
      hotelList.forEach((hotel: any) => {
        if (hotel?.triplaHotelId) {
          const hotelID = Number(hotel?.triplaHotelId)
          listID.push(hotelID)
        }
      })
    }
    return listID
  },

  maxPrice: (state: any) => {
    const hotelPrice = state.data.hotel_price
    if (hotelPrice.length) {
      return hotelPrice?.reduce((a: any, b: any) => (a.price > b.price ? a : b))
        ?.price
    }

    return 0
  },

  minPrice: (state: any) => {
    const hotelPrice = state.data?.hotel_price
    if (hotelPrice.length) {
      return (
        hotelPrice?.reduce((a: any, b: any) => (a.price < b.price ? a : b))
          ?.price || 0
      )
    }
    return 0
  },

  tiers: (state: any) => {
    return state.data.tiers
  },

  isKidsTierSupport(state: any) {
    const { tiers } = state.data
    const kidType = tiers?.kids_setting?.kids_type
    const acceptType = tiers?.kids_setting?.accept_type
    let isSupport = false
    if (acceptType === 'accept' && kidType.includes('tiers')) {
      isSupport = true
    } else {
      isSupport = false
    }

    return isSupport
  },

  cheapestPrice(state: any) {
    return state.data.cheapestPrice
  },

  expensivePrice(state: any) {
    return state.data.expensivePrice
  }
}

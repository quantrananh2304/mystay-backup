import { IHotelPriceData } from '~/interfaces/hotelListPage'
import { sortAsc } from '~/utils/common'

export class HotelHelper {
  public cityList: Array<any>
  public nearMeParam: number = 4780 / 1000

  constructor(payload: Array<any>) {
    this.cityList = payload.filter(item => item.hotelCount > 0)
  }

  public getHotelList(): Array<any> {
    let hotelList: Array<any> = []

    const prefectures = this.getPrefectures()

    prefectures.map((prefecture: any) => {
      prefecture.hotels.map((hotel: any) => {
        hotelList.push({
          prefecturesName: prefecture.prefecturesName,
          cityNameInAllLanguage: prefecture.nameInAllLanguage || '',
          cityName: prefecture.name || '',
          ...hotel
        })
      })
    })

    return hotelList
  }

  public getPrefectures(): Array<any> {
    let prefectures: Array<any> = []

    this.cityList.forEach(city => {
      city.prefectures.forEach((prefecture: any) => {
        prefectures.push({
          prefecturesName: city.name || '',
          prefecturesInAllLanguage: city.nameInAllLanguage || '',
          cityNameInAllLanguage: prefecture.nameInAllLanguage || '',
          cityName: prefecture.name || '',
          ...prefecture
        })
      })
    })

    return prefectures
  }

  public getHotelNearMe(): Array<any> {
    let hotelNearMe: Array<any> = []

    const hotelList = this.getHotelList()

    hotelNearMe = hotelList.filter(
      (item: any) => item.distanceToUser <= this.nearMeParam
    )

    return hotelNearMe.sort(sortAsc).splice(0, 5)
  }

  public filterHotel(keyword: string): Array<any> {
    const hotelListsOfCity: any = []

    this.cityList.forEach((city: any) => {
      const districtList = city.prefectures
      districtList.forEach((district: any) => {
        district.hotels.forEach((hotel: any) => {
          hotelListsOfCity.push({
            ...hotel,
            city: city.nameInAllLanguage,
            district: district.nameInAllLanguage
          })
        })
      })
    })

    if (keyword) {
      return hotelListsOfCity.filter((hotel: any) => {
        return (
          hotel?.nameInAllLanguage
            ?.toLowerCase()
            .includes(keyword?.toLowerCase()) ||
          hotel.city?.toLowerCase().includes(keyword?.toLowerCase()) ||
          hotel.district?.toLowerCase().includes(keyword?.toLowerCase())
        )
      })
    }

    return hotelListsOfCity
  }

  public filterCity(keyword: string): Array<any> {
    return this.cityList.filter((city: any) => {
      return city?.nameInAllLanguage
        ?.toLowerCase()
        ?.includes(keyword?.toLowerCase())
    })
  }

  public filterPrefecture(keyword: string): Array<any> {
    const prefectures = this.getPrefectures()

    return prefectures.filter((district: any) => {
      return district?.nameInAllLanguage
        ?.toLowerCase()
        ?.includes(keyword?.toLowerCase())
    })
  }

  public hotelMappingPrice(hotelList: Array<any>, hotelPriceList: Array<any>) {
    let hotelMapping: Array<IHotelPriceData> = []
    hotelList.forEach((hotel: any) => {
      let isPrice = false
      hotelPriceList.forEach((hotelPrice: IHotelPriceData) => {
        if (Number(hotel.triplaHotelId) === Number(hotelPrice.hotelID)) {
          isPrice = true
          hotel.price = hotelPrice.lowest_price
          hotel.area = hotelPrice.area
          hotel.address = hotelPrice.address
        }
      })

      hotelMapping.push(hotel)
    })

    return hotelMapping
  }

  public getMinPrice(hotelFilterByMapView: Array<any>) {
    const hotelPrice = hotelFilterByMapView.map(hotel => hotel.price || 0)

    return Math.min(...hotelPrice)
  }

  public getMaxPrice(hotelFilterByMapView: Array<any>) {
    const hotelPrice = hotelFilterByMapView.map(hotel => hotel.price || 0)

    return Math.max(...hotelPrice)
  }
}

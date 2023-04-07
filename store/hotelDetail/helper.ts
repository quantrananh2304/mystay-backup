export class PlanHelper {
  public plans: Array<any> = []
  public sortBy = ''
  public isLogin = false
  public filterModel: any = {}
  public selectedRoom: Array<any> = []
  public planFilter: Array<any> = []

  constructor(
    plans: Array<any>,
    sortBy: string,
    filterModel: any,
    selectedRoom: Array<any>,
    planFilter: Array<any>,
    isLogin: boolean
  ) {
    this.plans = plans
    this.sortBy = sortBy
    this.filterModel = filterModel
    this.selectedRoom = selectedRoom
    this.planFilter = planFilter
    this.isLogin = isLogin
  }

  public planInfo() {
    const planInfo = this.plans.map((hotel: any, hotelIndex: number) => {
      const roomPlans = hotel.rooms.map((room: any) => {
        const firstPicture = room.room_pictures[0]?.picture?.chatbot_header?.url

        const wordpress_thumb_pictures =
          room.room_pictures[0]?.picture?.wordpress_thumb?.url ||
          room.room_pictures[0]?.picture?.chatbot_header?.url

        const wordpress_thumb = room.room_pictures[0]?.picture?.wordpress?.url

        const discount = this.isLogin
          ? room.sign_in_discount
          : room.non_sign_in_discount

        const discountRate =
          discount.total_price_after_discount +
          discount.total_price_after_discount_tax

        const promoCodeName =
          discount?.promotions && discount?.promotions[0]?.name

        return {
          details: room.room_type_description,
          discountRate,
          promoCodeName,
          earn: 125,
          image: firstPicture,
          wordpress_thumb_pictures,
          wordpress_thumb,
          isMemberOnly: true,
          rate: room.total_price + room.tax,
          roomId: room.room_type_code,
          roomLeft: room.room_count,
          roomSliderImages: room.room_pictures,
          roomTitle: room.room_type_name,
          isSmoking: room.is_smoking,
          planCode: `${room.room_type_code}_${hotel.code}_sleeps_${room.sleeps}`,
          sleeps: room.sleeps,
          roomRate: room.room_rate,
          tax: room.tax,
          cancellationFreeDeadline: room.cancellation_free_deadline,
          roomPlanCode: room.room_plan_code,
          room_count: room.room_count,
          max_people: room.max_people,
          min_people: room.min_people
        }
      })

      let roomSort = roomPlans

      // switch (this.sortBy) {
      //   case "price_low_to_high":
      //     roomSort = roomPlans.sort((a: any, b: any) => a.rate - b.rate);
      //     break;
      //   case "price_high_to_low":
      //     roomSort = roomPlans.sort((a: any, b: any) => b.rate - a.rate);
      //     break;
      //   default:
      //     roomSort = roomPlans;
      //     break;
      // }

      const sleeps = roomSort[0]?.sleeps

      const minPrice = Math.min(
        ...roomSort.map((room: any) => {
          if (room.discountRate) {
            return room.discountRate
          }

          return room.rate
        })
      )

      const maxPrice = Math.max(...roomSort.map((room: any) => room.rate))

      const minPriceBeforeDiscount = Math.min(
        ...roomSort.map((room: any) => room.rate)
      )

      const promoCodeName = roomPlans && roomPlans[0].promoCodeName

      return {
        cancellationFreeDeadline: roomSort[0]?.cancellationFreeDeadline,
        cancellationPolicyLink: '',
        rateBeforeDiscount: minPriceBeforeDiscount,
        roomPlanCode: roomSort[0]?.roomPlanCode,
        details: hotel.description,
        isMemberOnly: false,
        picture: hotel.url_plan_pictures[0],
        planId: hotelIndex + 1,
        rate: minPrice,
        maxPrice,
        subContent: roomSort,
        title: hotel.name,
        meals: hotel.meals,
        sleeps,
        code: hotel.code,
        paymentMethod: hotel.payment_method,
        promoCodeName
      }
    })

    return planInfo
  }

  public planLeftFilter() {
    let newPlanFilter = []
    if (this.filterModel.status) {
      const priceRange = this.filterModel.priceRange
      const subContentFilter = this.planFilter.map((plan: any) => {
        const { subContent } = plan
        const subContentFilter = subContent.filter((sub: any) => {
          return sub.rate >= priceRange[0] && sub.rate <= priceRange[1]
        })
        return {
          ...plan,
          subContent: subContentFilter
        }
      })
      newPlanFilter = subContentFilter.filter((room: any) => {
        return room.subContent.length
      })
    } else {
      newPlanFilter = this.planFilter
    }

    let planSort = []

    switch (this.sortBy) {
      case 'price_low_to_high':
        planSort = newPlanFilter.sort((a: any, b: any) => a.rate - b.rate)
        break
      case 'price_high_to_low':
        planSort = newPlanFilter.sort((a: any, b: any) => b.rate - a.rate)
        break
      default:
        planSort = newPlanFilter
        break
    }
    return planSort
  }
}

export class RoomHelper {
  roomStatus: any = {}
  sortBy = ''
  roomList: Array<any> = []
  roomPlanCode: any = {}
  filterModel: any = {}
  isSmoking = false
  isLogin = false
  constructor(
    roomStatus: any,
    sortBy: string,
    roomList: Array<any>,
    roomPlanCode: any,
    filterModel: any,
    isSmoking: boolean,
    isLogin: boolean
  ) {
    this.roomStatus = roomStatus
    this.sortBy = sortBy
    this.roomList = roomList
    this.roomPlanCode = roomPlanCode
    this.filterModel = filterModel
    this.isSmoking = isSmoking
    this.isLogin = isLogin
  }

  public roomInfo() {
    const rooms = this.roomList.map((room: any) => {
      const planList = room.room_plan.map((plan: any, index: number) => {
        const discount = this.isLogin
          ? plan.sign_in_discount
          : plan.non_sign_in_discount
        const discountRate =
          discount.total_price_after_discount +
          discount.total_price_after_discount_tax
        const promoCodeName =
          discount?.promotions && discount?.promotions[0]?.name
        return {
          details: plan.hotel_plan_description,
          discountRate,
          promoCodeName,
          isActive: true,
          isMemberOnly: false,
          rate: plan.total_price + plan.tax,
          title: plan.room_plan_name,
          image: plan.url_plan_pictures && plan.url_plan_pictures[0],
          roomRate: plan.room_rate,
          planCode: `${room.room_type_code}_${plan.hotel_plan_code}_sleeps_${plan.sleeps}`,
          planId: index,
          code: plan.hotel_plan_code,
          sleeps: plan.sleeps,
          tax: plan.tax,
          paymentMethod: plan.payment_method,
          cancellationFreeDeadline: plan.cancellation_free_deadline,
          cancellationPolicyLink: plan.cancellation_policy_link,
          roomPlanCode: plan.room_plan_code,
          roomId: room.room_type_code,
          room_count: room.room_count,
          max_people: room.max_people,
          min_people: room.min_people
        }
      })

      const minPrice = Math.min(
        ...planList.map((plan: any) => {
          if (plan.discountRate) {
            return plan.discountRate
          }

          return plan.rate
        })
      )

      const minPriceBeforeDiscount = Math.min(
        ...planList.map((plan: any) => plan.rate)
      )

      const promoCodeName = planList && planList[0].promoCodeName

      const firstPicture = room.room_pictures[0]?.picture?.chatbot_header?.url

      const wordpress_thumb_pictures =
        room.room_pictures[0]?.picture?.wordpress_thumb?.url ||
        room.room_pictures[0]?.picture?.chatbot_header?.url

      const wordpress_thumb = room.room_pictures[0]?.picture?.wordpress?.url

      return {
        ...room,
        roomTitle: room.room_type_name,
        details: room.room_type_description,
        picture: firstPicture,
        wordpress_thumb_pictures,
        wordpress_thumb,
        rate: minPrice,
        promoCodeName,
        rateBeforeDiscount: minPriceBeforeDiscount,
        roomId: room.room_type_code,
        roomLeft: room.room_count,
        roomSliderImages: room.room_pictures,
        isSmoking: room.is_smoking,
        subContent: planList,
        sleeps: this.roomStatus?.adults?.number,
        tax: 0
      }
    })

    return rooms
  }

  public roomFilter() {
    let newRoom = []
    if (this.filterModel.status) {
      const priceRange = this.filterModel.priceRange
      const subContentFilter = this.roomList.map((room: any) => {
        const { subContent } = room
        const subContentFilter = subContent.filter((sub: any) => {
          return sub.rate >= priceRange[0] && sub.rate <= priceRange[1]
        })

        let minPrice = subContentFilter[0]?.rate
        let maxPrice = subContentFilter[0]?.rate

        subContentFilter.forEach((room: any) => {
          if (room.rate < minPrice) {
            minPrice = room.rate
          }
          if (maxPrice < room.rate) {
            maxPrice = room.rate
          }
        })

        return {
          ...room,
          rate: minPrice,
          maxPrice,
          subContent: subContentFilter
        }
      })
      newRoom = subContentFilter.filter((room: any) => {
        return room.subContent.length
      })
    } else {
      newRoom = this.roomList
    }

    let roomSort = []

    switch (this.sortBy) {
      case 'price_low_to_high':
        roomSort = newRoom.sort((a: any, b: any) => a.rate - b.rate)
        break
      case 'price_high_to_low':
        roomSort = newRoom.sort((a: any, b: any) => b.rate - a.rate)
        break
      default:
        roomSort = newRoom
        break
    }

    return roomSort
  }
}

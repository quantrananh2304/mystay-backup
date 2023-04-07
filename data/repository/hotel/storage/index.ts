import StorageGateway from '../../../gateway/storage'
import { TokenType } from '../../../constants'
import ResponseModel from '../../../../models/response'

const saveResult = (data: any) => {
  return StorageGateway.doUpdateSearchResult(TokenType.recentSearch, data)
}

const setLocation = (location: any) => {
  return StorageGateway.doUpdateJson(TokenType.Location, location)
}

const setInitialooking = (booking: any) => {
  const data = localStorage.getItem(TokenType.Booking)
  if (!data) {
    return StorageGateway.doUpdateJson(TokenType.Booking, booking)
  } else {
    const bookingData = JSON.parse(data)
    const newBooking = { ...bookingData, ...booking }
    return StorageGateway.doUpdateJson(TokenType.Booking, newBooking)
  }
}

const getInitialooking = (): Promise<ResponseModel<string>> => {
  return StorageGateway.doGet(TokenType.Booking)
}

export default {
  saveResult,
  setLocation,
  setInitialooking,
  getInitialooking
}

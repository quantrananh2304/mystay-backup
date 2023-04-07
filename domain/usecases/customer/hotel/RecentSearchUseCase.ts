import { IUseCase } from '../../../../shared/interfaces/common/usecase'
import ResponseModel from '../../../../models/response'
import HotelRepository from '../../../../data/repository/hotel'
import ValidationResult from '../../../../models/validationResult'

export default class RecentSearchUseCase implements IUseCase {
  private hotelRepository: HotelRepository

  constructor (private searchParams: any) {
    this.hotelRepository = new HotelRepository()
  }

  validate = (): ValidationResult => {
    if (this.searchParams) {
      return new ValidationResult(true)
    }
    return new ValidationResult(false, 'Hotel ID is empty')
  }

  execute = (): Promise<ResponseModel<string>> => {
    return new Promise((resolve, reject) => {
      const validationResult = this.validate()
      if (validationResult.isValid) {
        this.hotelRepository
          .saveSearchResult(this.searchParams)
          .then((response: any) => {
            const data = response && response.data
            if (data) {
              resolve(data)
            } else {
              reject(ResponseModel.createError(500, 'Customer token is null'))
            }
          })
          .catch(reject)
      }
    })
  }
}

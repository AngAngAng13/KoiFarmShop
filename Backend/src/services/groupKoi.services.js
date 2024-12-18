import { ObjectId } from 'mongodb'
import databaseService from './database.service.js'
import { ErrorWithStatus } from '../models/Errors.js'
import { MANAGER_MESSAGES } from '../constants/managerMessage.js'
import HTTP_STATUS from '../constants/httpStatus.js'

class GroupKoisService {
  async getAllGroupKoi() {
    try {
      const groupKoi = await databaseService.groupKois.find({}).toArray()
      return groupKoi
    } catch (error) {
      console.error('Error fetching groupKois:', error)
      throw error
    }
  }

  async getGroupKoi(groupKoiID) {
    const groupKoiObjectID = new ObjectId(groupKoiID)
    const groupKoi = await databaseService.groupKois.findOne({ _id: groupKoiObjectID })
    if (groupKoi == null) {
      throw new ErrorWithStatus({
        message: MANAGER_MESSAGES.GROUP_KOI_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return groupKoi
  }
}

const groupKoisService = new GroupKoisService()
export default groupKoisService

import adminService from '../services/admin.service.js'
import { ADMINS_MESSAGES } from '../constants/messages.js'

export const getUser = async (req, res) => {
  const result = await adminService.getUser()
  res.json({
    result
  })
}

export const getOrder = async (req, res) => {
  const result = await adminService.getOrder()
  res.json({
    result
  })
}

export const getKois = async (req, res) => {
  const result = await adminService.getKoi()
  res.json({
    result
  })
}

export const addKoi = async (req, res) => {
  try {
    const result = await adminService.addKoi(req.body)
    // result trả về success "true" nếu thành công và ngược lại trả về false khi validate dữ liệu đầu vào fail
    // message do Joi trả về khi validate
    if (!result.success) {
      return res.status(400).json({
        message: result.message
      })
    }
    res.json({
      message: result.message,
      result
    })
  } catch (error) {
    console.log(error)
  }
}

export const updateKoi = async (req, res) => {
  try {
    const { KoiID } = req.params
    const result = await adminService.updateKoi(KoiID, req.body)
    // result trả về success "true" nếu thành công và ngược lại trả về false khi validate dữ liệu đầu vào fail
    // message do Joi trả về khi validate
    if (!result.success) {
      return res.status(400).json({
        message: result.message
      })
    }
    res.json({
      message: result.message,
      result
    })
  } catch (error) {
    console.log(error)
  }
}

export const updateStatusKoi = async (req, res) => {
  try {
    const { KoiID } = req.params
    const result = await adminService.updateStatusKoi(KoiID)
    // result trả về success "true" nếu thành công và ngược lại trả về false khi validate dữ liệu đầu vào fail
    // message do Joi trả về khi validate
    if (!result.success) {
      return res.status(400).json({
        message: result.message
      })
    }
    res.json({
      message: result.message,
      result
    })
  } catch (error) {
    console.log(error)
  }
}

import CryptoJS from 'crypto-js'
import databaseService from './database.service.js'
import { ObjectId } from 'mongodb'

export const callback = async (req, res) => {
  let result = {}
  console.log(req.body)
  try {
    const config = {
      app_id: '2554',
      key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf'
    }

    let dataStr = req.body.data
    let reqMac = req.body.mac

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString()

    // Kiểm tra callback hợp lệ
    if (reqMac !== mac) {
      result.returncode = -1
      result.returnmessage = 'mac not equal'
    } else {
      const parsedData = JSON.parse(dataStr)
      const embedData = JSON.parse(parsedData.embed_data) // Phân tích cú pháp embed_data
      const reqOrderDetails = embedData.orderDetails // Thông tin đơn hàng

      console.log('Order details from embed_data:', reqOrderDetails)

      const koiIDs = reqOrderDetails.Items.map((item) => item.KoiID)

      for (const koiID of koiIDs) {
        await databaseService.kois.findOneAndUpdate(
          { _id: new ObjectId(koiID) }, // Tìm kiếm theo _id và trạng thái
          { $set: { Status: 0 } }, // Cập nhật trạng thái thành 1
          { new: true } // Trả về đối tượng đã cập nhật
        )
      }

      if (!reqOrderDetails) {
        result.returncode = -1
        result.returnmessage = 'No order data found in embed_data'
      } else {
        // PHẦN CỦA M NÈ TRƯỜNG LÊ
        const reqOrderCookie = req.cookies && req.cookies.order ? JSON.parse(req.cookies.order) : {}
        console.log(reqOrderCookie)
        const result = await saveOrderToDatabase(reqOrderCookie)
        res.clearCookie('order')

        await databaseService.order.findOneAndUpdate(
          { _id: new ObjectId(OrderID) },
          { $set: { Status: 2 } },
          { new: true }
        )
        result.returncode = 1
        result.returnmessage = 'success'
      }
    }
  } catch (ex) {
    result.returncode = 0 // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message
  }

  res.json(result)
}

export const saveOrderToDatabase = async (reqOrderCookie) => {
  // console.log("Cookies DT received:", reqOrderDTCookie);
  console.log('Cookies received:', reqOrderCookie)
  //check order cookie có exist
  if (!reqOrderCookie) {
    return res.status(400).json({ error: 'No order data found in cookies' })
  }

  // const newOrderDT = {
  //   _id: new ObjectId(),
  //   Items: reqOrderDTCookie.Items,
  //   TotalPrice: reqOrderDTCookie.TotalPrice
  // }

  // const orderDT = await databaseService.orderDetail.insertOne(newOrderDT)
  // if(orderDT.insertedId){
  //   newOrderDT._id = orderDT.insertedId
  // }

  const newOrder = {
    _id: new ObjectId(),
    UserID: reqOrderCookie.UserID,
    // OrderDetailID: newOrderDT._id,
    OrderDetailID: reqOrderCookie.OrderDetailID,
    ShipAddress: reqOrderCookie.ShipAddress,
    Description: reqOrderCookie.Description,
    OrderDate: reqOrderCookie.OrderDate || new Date(),
    Status: reqOrderCookie.Status || 1
  }

  const order = await databaseService.order.insertOne(newOrder)
  if (order.insertedId) {
    newOrder._id = order.insertedId
  } else {
    return {
      message: 'Fail to save'
    }
  }
  return order
}

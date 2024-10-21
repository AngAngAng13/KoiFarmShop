import axios from 'axios'
import CryptoJS from 'crypto-js'
import moment from 'moment'

const zaloPayment = async (req, res) => {
  const config = {
    app_id: '2554',
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
  }

  const embed_data = {
    redirecturl: 'https://www.facebook.com/',
  }

  const items = [{}]
  const transID = Math.floor(Math.random() * 1000000)
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    app_user: 'user123',
    app_time: Date.now(), // milliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: req.body.total,
    description: `KOI Shop - Payment for the order + ${Math.floor(100000 + Math.random() * 900000)}`,
    bank_code: '',
    callback_url: 'https://f559-171-247-187-77.ngrok-free.app/payment/callback'
  }

  // Thay đổi dòng này để bao gồm order_id
  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

  try {
    const result = await axios.post(config.endpoint, null, { params: order })
    res.json(result.data) // Gửi phản hồi về phía client
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message }) // Gửi lỗi nếu có
  }
}

export default zaloPayment

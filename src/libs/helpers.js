import Vue from 'vue'
import moment from 'moment'

moment.locale('id')

export const generateRandomStr = (length = 10) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i + 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const clientKeyMidtrans = process.env.VUE_APP_CLIENT_KEY_MIDTRANS_PAYMENT
export const kirimEmailConfig = {
  token: process.env.VUE_APP_KIRIMEMAIL_TOKEN,
  username: process.env.VUE_APP_KIRIMEMAIL_USERNAME,
}
Vue.prototype.$moment = moment

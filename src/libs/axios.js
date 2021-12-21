import Vue from 'vue'

// axios
import axios from 'axios'
import useJwt from '@core/auth/jwt/useJwt'

const { jwt } = useJwt(axios, {})
const token = jwt.getToken()

// instance for main komerce
const axiosIns = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 14000,
  headers: {
    'Application-Name': 'Web Komerce',
  },
})

const komshipAxiosIns = axios.create({
  // You can add your headers here
  headers: {
    Authorization: `Bearer ${token}`,
  },
  baseURL: process.env.VUE_APP_BASE_URL_KOMSHIP,
  timeout: 14000,
})

axiosIns.interceptors.response.use(
  response => response,
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.status === 403) {
      window.location = '/unauthenticated'
    }
    /* eslint-disable comma-dangle */
    return Promise.reject(error)
  }
)

komshipAxiosIns.interceptors.response.use(
  response => response,
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.status === 403) {
      window.location = '/unauthenticated'
    }
    /* eslint-disable comma-dangle */
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axiosIns
Vue.prototype.$http_komship = komshipAxiosIns

export default axiosIns

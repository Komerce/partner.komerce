// axios
import axios2 from 'axios'
import useJwt from '@/auth/jwt/useJwt'

const token = useJwt.getToken()

axios2.defaults.baseURL = process.env.VUE_APP_BASE_URL_KOMSHIP
axios2.defaults.headers.common = { Authorization: `Bearer ${token}` }

export default axios2

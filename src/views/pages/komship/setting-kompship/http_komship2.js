import httpKomship2 from 'axios'
import useJwt from '@/auth/jwt/useJwt'

const token = useJwt.getToken()

httpKomship2.defaults.baseURL = 'https://komshipdev.komerce.id/api'
httpKomship2.defaults.headers.common = { Authorization: `bearer ${token}` }
export default httpKomship2

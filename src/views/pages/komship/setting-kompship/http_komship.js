import httpKomship from 'axios'
import useJwt from '@/auth/jwt/useJwt'

const token = useJwt.getToken()

httpKomship.defaults.baseURL = 'https://komshipdev.komerce.id/api'
httpKomship.defaults.headers.common = { Authorization: `bearer ${token}` }
export default httpKomship

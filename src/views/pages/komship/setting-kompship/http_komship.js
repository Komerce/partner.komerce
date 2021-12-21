import httpKomship from 'axios'
import useJwt from '@/auth/jwt/useJwt'

const token = useJwt.getToken()

httpKomship.defaults.baseURL = 'https://komship.komerce.id/api'
httpKomship.defaults.headers.common = { Authorization: `bearer ${token}` }
export default httpKomship

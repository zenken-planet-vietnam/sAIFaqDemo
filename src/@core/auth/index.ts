import useJwt from './useJwt'
import axios from '@/axios'

const { jwt } = useJwt(axios, {})
export default jwt

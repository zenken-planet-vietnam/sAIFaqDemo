import JwtService from './jwtService'

export default function useJwt(axiosIns: any, jwtOverrideConfig: any) {
  const jwt = new JwtService(axiosIns, jwtOverrideConfig)

  return {
    jwt,
  }
}




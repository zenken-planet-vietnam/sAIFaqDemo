import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  // Will be used by this service for making API calls
  axiosIns: any = null

  // jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // For Refreshing Token
  subscribers: any = []

  constructor(axiosIns: any, jwtOverrideConfig: any) {
    this.axiosIns = axiosIns
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config: any) => {
        // Get token from localStorage
        const accessToken = this.getToken()
        // If token is present add it to request's Authorization Header
        if (accessToken && config.url !== this.jwtConfig.refreshEndpoint && config.url != this.jwtConfig.loginEndpoint) {
          if(config.url.includes('fnt'))
           config.headers.Authorization = `${this.jwtConfig.tokenType} ${this.getUserToken}`
          else 
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${this.getToken}`
        }
        return config
      },
      (error: any) => Promise.reject(error),
    )

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        const { response, config } = error
        const originalRequest = config
        // if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then((r: any) => {
              this.isAlreadyFetchingAccessToken = false
              const { data } = r
              // Update accessToken in localStorage
              this.setToken(data.data.access_token)
              // this.setRefreshToken(r.data.refreshToken)
              this.onAccessTokenFetched(data.data.access_token)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber((accessToken: any) => {
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axiosIns(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      },
    )
  }

  onAccessTokenFetched(accessToken: any) {
    this.subscribers = this.subscribers.filter((callback: any) => callback(accessToken))
  }

  addSubscriber(callback: any) {
    this.subscribers.push(callback)
  }


  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getUserToken() {
    return localStorage.getItem(this.jwtConfig.userStorageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  healthcheck() {
    return this.axiosIns.get("/healthcheck/")
  }


  setToken(value: any) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setUserToken(value: any) {
    localStorage.setItem(this.jwtConfig.userStorageTokenKeyName, value)
  }

  setRefreshToken(value: any) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  setUserRefreshToken(value: any) {
    localStorage.setItem(this.jwtConfig.userStorageRefreshTokenKeyName, value)
  }


  login(...args: any) {
    return this.axiosIns.post(this.jwtConfig.loginEndpoint, ...args)
  }

  userLogin(...args: any) {
    return this.axiosIns.post(this.jwtConfig.userLoginEndpoint, ...args)
  }
  refreshToken() {
    return this.axiosIns.post(this.jwtConfig.refreshEndpoint, {
      refresh_token: this.getRefreshToken(),
    })
  }

}

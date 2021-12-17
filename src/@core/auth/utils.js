import useJwt from '../auth'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName)
}
// can navigate
export const canNavigate = (route) => {
  return route.meta && route.meta.layout === 'full'
}




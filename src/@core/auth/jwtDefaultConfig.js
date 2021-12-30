export default {
  // Endpoints
  loginEndpoint: 'admin/login/',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: 'admin/check/',
  logoutEndpoint: '/jwt/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storageF
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}

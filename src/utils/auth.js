import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RefreshTokenKey = 'vue_admin_template_refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeToken() {
  Cookies.remove(RefreshTokenKey)
  return Cookies.remove(TokenKey)
}

import base64 from "base-64"

const ID_TOKEN_KEY = `id_token`
const ACCESS_TOKEN_KEY = `access_token`
const EXPIRES_AT = `expires_at`


export const decodeToken = token => {
  if (!token || token.length < 10) return null
  const base64Url = token.split(".")[1]
  const base = base64Url.replace("-", "+").replace("_", "/")
  return JSON.parse(base64.decode(base))
}

export const isValidToken = token => {
  if (!token || token.length < 10) return false
  const decoded = decodeToken(token)
  return decoded && new Date().getTime() < decoded.exp * 1000
}

export const setAccessToken = token =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token)

export const setIdToken = token => localStorage.setItem(ID_TOKEN_KEY, token)

export const setExpiresAt = expiresAt =>
  localStorage.setItem(EXPIRES_AT, expiresAt)

export const getAccessToken = () =>
  typeof localStorage !== `undefined`
    ? localStorage.getItem(ACCESS_TOKEN_KEY)
    : null

export const getIdToken = () =>
  typeof localStorage !== `undefined`
    ? localStorage.getItem(ID_TOKEN_KEY)
    : null

export const getExpiresAt = () => localStorage.getItem(EXPIRES_AT)

export const clearIdToken = () => localStorage.removeItem(ID_TOKEN_KEY)

export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY)

export const clearExpiresAt = () => localStorage.removeItem(EXPIRES_AT)

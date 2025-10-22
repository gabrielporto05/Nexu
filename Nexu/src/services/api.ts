import axios from 'axios'
import { getToken, deleteToken } from 'src/utils/token'
import { router } from 'expo-router'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json'
  },
  timeout: 5000
})

api.interceptors.request.use(async config => {
  const token = await getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    try {
      const resp = error?.response

      const serverError =
        resp?.data?.error ||
        resp?.data?.data?.error ||
        resp?.data?.message ||
        (typeof resp?.data === 'string' ? resp.data : undefined)

      const normalized = typeof serverError === 'string' ? serverError.toLowerCase() : ''

      const isTokenExpired =
        normalized.includes('token is expired') ||
        normalized.includes('token expired') ||
        normalized.includes('token is invalid') ||
        normalized.includes('jwt expired') ||
        normalized.includes('session expired')

      if (isTokenExpired) {
        await deleteToken()
        setTimeout(() => {
          router.replace('/auth/login')
        }, 0)
      }
    } catch (e) {
      console.warn('Error handling interceptor:', e)
    }

    return Promise.reject(error)
  }
)

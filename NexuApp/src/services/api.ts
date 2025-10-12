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
  response => {
    return response
  },
  async error => {
    if (error.response?.status === 401) {
      await deleteToken()

      setTimeout(() => {
        router.replace('/auth/login')
      }, 0)
    }

    return Promise.reject(error)
  }
)

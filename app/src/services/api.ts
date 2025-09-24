import axios from 'axios'
import { getToken } from 'src/utils/token'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json'
  },
  timeout: 3000
})

api.interceptors.request.use(async config => {
  const token = await getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

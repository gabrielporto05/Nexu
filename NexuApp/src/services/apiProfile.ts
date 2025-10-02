import { api } from './api'

const fetchUserProfile = async (token: string) => {
  const response = await api.get('/profile/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export { fetchUserProfile }

import { api } from './api'

const fetchUserProfile = async (token: string) => {
  const response = await api.get('/profile/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

const updateAvatar = async (image: FormData) => {
  const response = await api.patch('/profile/me/avatar', image, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

const deleteAvatar = async () => {
  await api.delete('/profile/me/avatar')
}

export { fetchUserProfile, updateAvatar, deleteAvatar }

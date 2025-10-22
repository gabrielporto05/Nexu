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

const changePassword = async (user: number, data: { current_password: string; new_password: string }) => {
  await api.patch(`/users/${user}/update-password`, data)
}

export { fetchUserProfile, updateAvatar, deleteAvatar, changePassword }

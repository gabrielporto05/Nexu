import { api } from 'src/services/api'

const followUser = (userId: number) => {
  const response = api.post(`/users/${userId}/follow`)

  return response
}

export { followUser }

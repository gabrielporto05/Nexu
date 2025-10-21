import { api } from 'src/services/api'
import { GetUsersResponse } from 'src/utils/types'

const followUser = async (user: number) => {
  const response = await api.post(`/users/${user}/follow`)

  return response
}

const unfollowUser = async (user: number) => {
  const response = await api.delete(`/users/${user}/unfollow`)

  return response
}

const getConnections = async (user: number) => {
  const reponse = await api.get<GetUsersResponse>(`/users/${user}/connections`)

  return reponse.data
}

const getFollowers = async (user: number) => {
  const response = await api.post(`/users/${user}/followers`)

  return response
}

const getFollowing = async (user: number) => {
  const response = await api.post(`/users/${user}/following`)

  return response
}

export { followUser, unfollowUser, getConnections, getFollowers, getFollowing }

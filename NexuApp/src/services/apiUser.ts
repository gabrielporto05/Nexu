import { api } from 'src/services/api'
import { GetUserResponse, GetUsersResponse } from 'src/utils/types'

const getUsersByNameOrNick = async (payload: string) => {
  const response = await api.get<GetUsersResponse>(`/users?nameOrNick=${payload}`)

  return response.data
}

const getUserById = async (user: number) => {
  const response = await api.get<GetUserResponse>(`/users/${user}`)

  return response.data
}

const updateUserInfo = async (name: string, nick: string, user: number) => {
  await api.put(`/users/${user}`, { name, nick })
}

export { getUsersByNameOrNick, getUserById, updateUserInfo }

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

const deleteUserById = async (user: number) => {
  await api.delete(`/users/${user}`)
}

export { getUsersByNameOrNick, getUserById, updateUserInfo, deleteUserById }

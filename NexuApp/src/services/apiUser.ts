import { api } from 'src/services/api'
import { GetUsersResponse } from 'src/utils/types'

const GetUsersByNameOrNick = async (payload: string) => {
  const response = await api.get<GetUsersResponse>(`/users?nameOrNick=${payload}`)

  return response.data
}

export { GetUsersByNameOrNick }

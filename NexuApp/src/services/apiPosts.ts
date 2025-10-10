import { api } from 'src/services/api'
import { GetPostsResponse } from 'src/utils/types'

const GetAllPosts = async () => {
  const response = await api.get<GetPostsResponse>('/posts')

  return response.data
}

export { GetAllPosts }

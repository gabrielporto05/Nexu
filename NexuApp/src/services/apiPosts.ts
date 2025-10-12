import { api } from 'src/services/api'
import { GetPostsResponse } from 'src/utils/types'

const getAllPosts = async () => {
  const response = await api.get<GetPostsResponse>('/posts')

  return response.data
}

const getAllPostsUserById = async (user: number) => {
  const response = await api.get<GetPostsResponse>(`/users/${user}/posts`)

  return response.data
}

export { getAllPostsUserById, getAllPosts }

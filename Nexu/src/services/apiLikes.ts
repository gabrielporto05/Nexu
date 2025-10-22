import { api } from 'src/services/api'
import { GetPostsResponse } from 'src/utils/types'

const like = async (post: number) => {
  const response = await api.patch(`/posts/${post}/like`)

  return response.data
}

const unlike = async (post: number) => {
  const response = await api.patch<GetPostsResponse>(`/posts/${post}/unlike`)

  return response.data
}

export { like, unlike }

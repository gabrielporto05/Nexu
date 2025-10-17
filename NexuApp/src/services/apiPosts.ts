import { api } from 'src/services/api'
import { GetPostsResponse } from 'src/utils/types'

const createPost = async (payload: FormData) => {
  const response = await api.post('/posts', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

const getAllPosts = async () => {
  const response = await api.get<GetPostsResponse>('/posts')

  return response.data
}

const getAllPostsUserById = async (user: number) => {
  const response = await api.get<GetPostsResponse>(`/users/${user}/posts`)

  return response.data
}

export { createPost, getAllPostsUserById, getAllPosts }

export type UserType = {
  id: number
  name: string
  nick: string
  email: string
  avatar?: string
  created_at: string
}

export type PostType = {
  id: number
  title: string
  description: string
  image?: string
  likes: number
  author_id: number
  user: UserType
  created_at: string
}

export type GetUsersResponse = {
  message: string
  data: UserType[]
}

export type GetUserResponse = {
  message: string
  data: UserType
}

export type GetPostsResponse = {
  message: string
  data: PostType[]
}

export type GetPostResponse = {
  message: string
  data: PostType
}

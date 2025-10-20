export type UserType = {
  id: number
  name: string
  nick: string
  email: string
  avatar?: string
  followersCount: number
  followingCount: number
  postsCount: number
  likesCount: number
  created_at: string
}

export type PostType = {
  id: number
  description: string
  image?: string
  likes: number
  likedByUser: boolean
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

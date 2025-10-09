export type UserType = {
  id: string
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
  author_id: string
  created_at: string
}

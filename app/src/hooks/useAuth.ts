import { useState, useEffect } from 'react'
import { deleteToken, getToken } from 'src/utils/token'
import { fetchUserProfile } from 'src/services/apiAuth'
import { UserType } from 'src/utils/types'

export const useAuth = () => {
  const [user, setUser] = useState<UserType>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const token = await getToken()

      if (token) {
        const { data } = await fetchUserProfile(token)
        setUser(data)
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.data?.error

      if (errorMessage === 'Token is expired') {
        await deleteToken()
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return { user, loading, isAuthenticated: !!user }
}

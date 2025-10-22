import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, setToken, deleteToken } from 'src/utils/token'
import { fetchUserProfile } from 'src/services/apiProfile'
import { ForgotPasswordSchemaType, LoginSchemaType, RegisterSchemaType } from 'src/schemas/authSchema'
import { ForgotPassword, Login, Register } from 'src/services/apiAuth'
import { useRouter } from 'expo-router'
import { UserType } from 'src/utils/types'

type AuthContextType = {
  user: UserType | null
  refreshUser: () => Promise<void>
  loading: boolean
  signIn: (data: LoginSchemaType) => Promise<string>
  singUp: (data: RegisterSchemaType) => Promise<string>
  signOut: () => Promise<void>
  forgotPassword: (data: ForgotPasswordSchemaType) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')

  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUser = async () => {
    const token = await getToken()
    if (!token) {
      setLoading(false)

      return
    }

    try {
      const { data } = await fetchUserProfile(token)
      setUser(data)
    } catch {
      await deleteToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const signIn = async (data: LoginSchemaType): Promise<string> => {
    const response = await Login(data)
    await setToken(response.data)
    await loadUser()
    router.replace('/home')

    return response.message
  }

  const signOut = async () => {
    await deleteToken()
    setUser(null)
    router.replace('/auth/login')
  }

  const singUp = async (data: RegisterSchemaType): Promise<string> => {
    const response = await Register(data)
    await loadUser()

    router.replace('/auth/login')

    return response.message
  }

  const forgotPassword = async (data: ForgotPasswordSchemaType): Promise<string> => {
    const response = await ForgotPassword(data)

    return response.message
  }

  return (
    <AuthContext.Provider value={{ user, refreshUser: loadUser, loading, signIn, singUp, signOut, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

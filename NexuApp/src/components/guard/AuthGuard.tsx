import { useAuth } from 'src/context/auth/AuthContext'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user])

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return <>{children}</>
}

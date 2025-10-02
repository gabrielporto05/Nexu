import { useAuth } from 'src/context/AuthContext'
import { useEffect } from 'react'
import { router } from 'expo-router'
import TextNexu from 'src/components/ui/TextNexu'
import { Image, View } from 'react-native'

export default function HomePage() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user])

  if (loading || !user) return null

  console.log('Avatar: ', `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}`)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      <TextNexu>Bem-vindo, {user.name}</TextNexu>
    </View>
  )
}

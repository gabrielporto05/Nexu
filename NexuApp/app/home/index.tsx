import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { Image, View } from 'react-native'

export default function HomePage() {
  const { user } = useAuth()

  if (!user) return null

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

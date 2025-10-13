import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { Image, View } from 'react-native'
import Loading from 'src/components/Loanding'

const CreatPostPage = () => {
  const { user } = useAuth()

  if (!user) return <Loading />

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      <TextNexu variant='titleLarge'>CreatPostPage</TextNexu>
      <TextNexu>Bem-vindo, {user.name}</TextNexu>
    </View>
  )
}

export default CreatPostPage

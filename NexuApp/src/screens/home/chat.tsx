import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from 'src/components/Loanding'

type ChatPageProps = {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const ChatPage = ({ handleScroll }: ChatPageProps) => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  if (!user) return <Loading />

  return (
    <ScrollView
      onScroll={handleScroll}
      style={{ flex: 1, padding: 20, marginTop: top }}
      keyboardShouldPersistTaps='handled'
      scrollEventThrottle={16}
    >
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      <TextNexu variant='titleLarge'>ChatPage</TextNexu>
      <TextNexu>Bem-vindo, {user.name}</TextNexu>
    </ScrollView>
  )
}

export default ChatPage

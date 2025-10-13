import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from 'src/components/Loanding'
import { UserType } from 'src/utils/types'
import { useCallback, useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'
import { getConnections } from 'src/services/apiFollower'
import { Card } from 'react-native-paper'
import { router } from 'expo-router'
import { useDebounce } from 'src/hooks/useDebounce'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'

type ChatPageProps = {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const ChatsPage = ({ handleScroll }: ChatPageProps) => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  if (!user) return <Loading />

  const [search, setSearch] = useState('')
  const [connections, setConnections] = useState<UserType[]>([])

  const debouncedSearch = useDebounce(search, 500)

  const fetchConnections = useCallback(async () => {
    try {
      const { data } = await getConnections(user.id)
      setConnections(data)
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao buscar conexões')
      })
    }
  }, [user.id])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return (
    <ScrollView
      onScroll={handleScroll}
      style={{ flex: 1, padding: 20, marginTop: top }}
      keyboardShouldPersistTaps='handled'
      scrollEventThrottle={16}
    >
      <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold', marginBottom: 20 }}>
        Conversas
      </TextNexu>

      <TextInputNexu
        placeholder='Converse com seus amigos'
        mode='outlined'
        value={search}
        onChangeText={setSearch}
        style={{
          marginBottom: 30,
          backgroundColor: '#ffffff0',
          width: '100%',
          height: 40
        }}
        left={<TextInputNexu.Icon icon='magnify' />}
        autoCapitalize='none'
      />

      {connections.map(connection => (
        <Card
          key={connection.id}
          style={{
            padding: 5,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: '#D9D9D9'
          }}
          onPress={() => {
            router.push(`/home/chat/${connection.id}`)
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${connection.avatar}` }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
              resizeMode='cover'
            />
            <View>
              <TextNexu variant='titleMedium' style={{ fontWeight: 'bold' }}>
                {connection.name}
              </TextNexu>
              <TextNexu variant='bodyLarge' style={{ color: '#999' }}>
                @{connection.nick}
              </TextNexu>
            </View>
          </View>
        </Card>
      ))}

      {connections.length === 0 && (
        <TextNexu
          variant='bodyLarge'
          style={{
            textAlign: 'center',
            color: '#999',
            marginTop: 40
          }}
        >
          Nenhuma conexão encontrada.
        </TextNexu>
      )}
    </ScrollView>
  )
}

export default ChatsPage

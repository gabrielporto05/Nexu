import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { getConnections } from 'src/services/apiFollower'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import Toast from 'react-native-toast-message'
import Loading from 'src/components/Loanding'
import { Ionicons } from '@expo/vector-icons'
import { UserType } from 'src/utils/types'
import { Card } from 'react-native-paper'
import { router } from 'expo-router'

const ChatsScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  if (!user) return <Loading />

  const [search, setSearch] = useState('')
  const [connections, setConnections] = useState<UserType[]>([])

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

      {!connections || connections.length === 0 ? (
        <View style={{ height: '100%', padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
          <Ionicons name='chatbubble-ellipses-outline' size={48} style={{ marginBottom: 12 }} />
          <TextNexu variant='titleLarge' style={{ textAlign: 'center' }}>
            Vc ainda não tem conexões.
          </TextNexu>
          <TextNexu variant='bodyLarge' style={{ textAlign: 'center', marginTop: 4 }}>
            Conecte-se com outros usuários para iniciar conversas.
          </TextNexu>
        </View>
      ) : (
        connections.map(connection => (
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
        ))
      )}
    </ScrollView>
  )
}

export default ChatsScreen

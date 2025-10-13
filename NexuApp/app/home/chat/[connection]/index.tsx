import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { getUserById } from 'src/services/apiUser'
import { UserType } from 'src/utils/types'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'
import Loading from 'src/components/Loanding'

const Chat = () => {
  const { connection } = useLocalSearchParams()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserById(Number(connection))
        setUser(data)
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: getErrorMessage(err, 'Erro ao buscar usuário')
        })
      }
    }

    if (connection) fetchUser()
  }, [connection])

  if (!user) return <Loading />

  return (
    <ScrollView>
      <TextNexu variant='titleLarge'>Chat com {user.name}</TextNexu>
    </ScrollView>
  )
}

export default Chat

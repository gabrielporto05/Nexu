import { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import TextNexu from 'src/components/ui/TextNexu'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { Card } from 'react-native-paper'
import { getUsersByNameOrNick } from 'src/services/apiUser'
import { UserType } from 'src/utils/types'
import { useDebounce } from 'src/hooks/useDebounce'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useProfileNavigation } from 'src/context/ProfileNavigationContext'
import { TabEnum } from 'src/components/navigation/BottomTabNavigator'

type SearchPageProps = {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  setActiveTab: (tab: TabEnum) => void
}

const SearchPage = ({ handleScroll, setActiveTab }: SearchPageProps) => {
  const { top } = useSafeAreaInsets()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserType[]>([])

  const { navigateToProfile } = useProfileNavigation()

  const handleUserPress = (userId: number) => {
    navigateToProfile(userId)

    setActiveTab(TabEnum.PERFIL)
  }

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsersByNameOrNick(debouncedSearch)
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: getErrorMessage(err, 'Erro ao buscar usuários')
        })
      }
    }

    if (debouncedSearch.trim().length > 0) {
      fetchUsers()
      return
    }

    setUsers([])
  }, [debouncedSearch])

  return (
    <ScrollView
      onScroll={handleScroll}
      style={{ flex: 1, padding: 20, marginTop: top }}
      keyboardShouldPersistTaps='handled'
      scrollEventThrottle={16}
    >
      <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold', marginBottom: 20 }}>
        Buscar
      </TextNexu>

      <TextInputNexu
        placeholder='Busque pelo seu influencer preferido...'
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

      {users.map(user => (
        <Card
          key={user.id}
          style={{
            padding: 5,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: '#D9D9D9'
          }}
          onPress={() => handleUserPress(user.id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
              style={{ width: 60, height: 60, borderRadius: 30, marginRight: 12 }}
              resizeMode='cover'
            />
            <View>
              <TextNexu variant='titleMedium' style={{ fontWeight: 'bold' }}>
                {user.name}
              </TextNexu>
              <TextNexu variant='bodyLarge' style={{ color: '#999' }}>
                @{user.nick}
              </TextNexu>
            </View>
          </View>
        </Card>
      ))}

      {users.length === 0 && (
        <TextNexu
          variant='bodyLarge'
          style={{
            textAlign: 'center',
            color: '#999',
            marginTop: 40
          }}
        >
          {debouncedSearch.trim().length > 0
            ? `Nenhum usuário encontrado com o termo "${debouncedSearch}".`
            : 'Digite algo para buscar usuários.'}
        </TextNexu>
      )}
    </ScrollView>
  )
}

export default SearchPage

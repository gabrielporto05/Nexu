import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { router } from 'expo-router'
import Loading from 'src/components/Loanding'

type ConfigOptionsType = {
  label: string
  icon: string
  route: string
  danger?: boolean
}

const configOptions: ConfigOptionsType[] = [
  {
    label: 'Editar informações pessoais',
    icon: 'create-outline',
    route: '/home/edit-profile'
  },
  {
    label: 'Alterar foto de perfil',
    icon: 'image-outline',
    route: '/home/change-avatar'
  },
  {
    label: 'Alterar senha',
    icon: 'lock-closed-outline',
    route: '/home/change-password'
  },
  {
    label: 'Privacidade e segurança',
    icon: 'shield-checkmark-outline',
    route: '/home/privacy-settings'
  },
  {
    label: 'Excluir conta',
    icon: 'trash-outline',
    route: '/home/delete-account',
    danger: true
  }
]

const ConfigPerfilPage = () => {
  const { top } = useSafeAreaInsets()
  const { user, signOut } = useAuth()

  if (!user) return <Loading />

  return (
    <ScrollView style={{ flex: 1, marginTop: top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name='arrow-back' size={28} color='black' />
        </TouchableOpacity>
        <TextNexu variant='headlineMedium' style={{ fontWeight: 'bold' }}>
          Configurações de Perfil
        </TextNexu>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
          style={{ width: 150, height: 150, borderRadius: 100 }}
          resizeMode='cover'
        />
        <TextNexu variant='titleLarge' style={{ marginTop: 12 }}>
          {user.name}
        </TextNexu>
        <TextNexu variant='bodyLarge'>@{user.nick}</TextNexu>
      </View>

      <View style={{ marginTop: 10, width: '100%' }}>
        {configOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
              backgroundColor: '#fff'
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon as any}
              size={24}
              color={item.danger ? '#FF6B6B' : '#855CF8'}
              style={{ marginRight: 12 }}
            />
            <TextNexu
              variant='titleMedium'
              style={{
                color: item.danger ? '#FF6B6B' : '#000',
                fontWeight: '500'
              }}
            >
              {item.label}
            </TextNexu>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={signOut}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            backgroundColor: '#fff'
          }}
          activeOpacity={0.7}
        >
          <Ionicons name='log-out-outline' size={24} color='#FF6B6B' style={{ marginRight: 12 }} />
          <TextNexu variant='titleMedium' style={{ color: '#FF6B6B', fontWeight: '500' }}>
            Sair da conta
          </TextNexu>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ConfigPerfilPage

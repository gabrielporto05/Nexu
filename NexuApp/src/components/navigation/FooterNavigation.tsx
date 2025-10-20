import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, TouchableOpacity } from 'react-native'
import { usePathname, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export enum TabEnum {
  HOME = '/home',
  SEARCH = '/home/search',
  CREATE_POST = '/home/creat-post',
  CHAT = '/home/chats',
  PERFIL = '/home/perfil'
}

type TabButtonType = {
  icon: keyof typeof Ionicons.glyphMap
  route: TabEnum
}

const TabBarOptions: TabButtonType[] = [
  { icon: 'home', route: TabEnum.HOME },
  { icon: 'search', route: TabEnum.SEARCH },
  { icon: 'add-circle-sharp', route: TabEnum.CREATE_POST },
  { icon: 'chatbubble', route: TabEnum.CHAT },
  { icon: 'person', route: TabEnum.PERFIL }
]

const FooterNavigation = () => {
  const { bottom } = useSafeAreaInsets()
  const router = useRouter()
  const pathName = usePathname()

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        paddingBottom: bottom + 16,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#222'
      }}
    >
      {TabBarOptions.map((tab, index) => {
        const isActive = pathName === tab.route

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!isActive) router.push(tab.route)
            }}
            style={{
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 8,
              position: 'relative'
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={tab.icon} size={26} color={isActive ? '#855CF8' : '#999'} style={{ marginBottom: 4 }} />
            {isActive && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -10,
                  width: 40,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#855CF8'
                }}
              />
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default FooterNavigation

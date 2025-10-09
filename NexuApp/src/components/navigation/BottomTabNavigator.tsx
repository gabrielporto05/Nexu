import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export enum TabEnum {
  FEED = 'feed',
  SEARCH = 'search',
  CREATE_POST = 'create_post',
  CHAT = 'chat',
  PERFIL = 'perfil'
}

type TabButtonType = {
  icon: keyof typeof Ionicons.glyphMap
  active: boolean
  onPress: VoidFunction
}

type CustomTabBarProps = {
  activeTab: TabEnum
  setActiveTab: (tab: TabEnum) => void
}

const TabBarOptions: TabButtonType[] = [
  { icon: 'home', active: false, onPress: () => {} },
  { icon: 'search', active: false, onPress: () => {} },
  { icon: 'add-circle-sharp', active: false, onPress: () => {} },
  { icon: 'chatbubble', active: false, onPress: () => {} },
  { icon: 'person', active: false, onPress: () => {} }
]

const CustomTabBar = ({ activeTab, setActiveTab }: CustomTabBarProps) => {
  const { bottom } = useSafeAreaInsets()

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: bottom + 20,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#222',
        position: 'relative'
      }}
    >
      {Object.values(TabEnum).map((tabKey, index) => {
        const tab = TabBarOptions[index]
        const isActive = activeTab === tabKey

        return (
          <TouchableOpacity
            key={tabKey}
            onPress={() => setActiveTab(tabKey)}
            style={{
              alignItems: 'center',
              position: 'relative',
              flex: 1,
              paddingHorizontal: 8
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={tab.icon} size={24} color={isActive ? '#855CF8' : '#999'} style={{ marginBottom: 4 }} />

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

export default CustomTabBar

import { View, TouchableOpacity, Text } from 'react-native'
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
  { icon: 'create', active: false, onPress: () => {} },
  { icon: 'chatbubble', active: false, onPress: () => {} },
  { icon: 'person', active: false, onPress: () => {} }
]

const CustomTabBar = ({ activeTab, setActiveTab }: CustomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: 40,
        backgroundColor: '#000',
        borderTopWidth: 1,
        borderTopColor: '#222',
        position: 'relative'
      }}
    >
      {Object.values(TabEnum).map((tabKey, index) => {
        const tab = TabBarOptions[index]
        const isActive = activeTab === tabKey

        if (tabKey === TabEnum.CREATE_POST) {
          return (
            <TouchableOpacity
              key={tabKey}
              onPress={() => setActiveTab(tabKey)}
              style={{
                position: 'absolute',
                top: -35,
                left: '50%',
                marginLeft: -35,
                zIndex: 10
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  borderWidth: 2,
                  borderColor: 'rgba(133, 92, 248, 0.3)',
                  backgroundColor: 'transparent'
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 0,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'rgba(133, 92, 248, 0.4)',
                  opacity: 0.5
                }}
              />

              <View
                style={{
                  backgroundColor: '#855CF8',
                  borderRadius: 30,
                  width: 60,
                  height: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: '#000',
                  shadowColor: '#855CF8',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 8
                }}
              >
                <Ionicons name='add' size={32} color='#fff' />
              </View>
            </TouchableOpacity>
          )
        }

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

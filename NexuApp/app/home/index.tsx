// app/home/index.tsx
import { useState } from 'react'
import { View } from 'react-native'
import FeedPage from 'src/screens/home/feed'
import SearchPage from 'src/screens/home/search'
import ChatPage from 'src/screens/home/chat'
import ProfilePage from 'src/screens/home/profile'
import CustomTabBar, { TabEnum } from 'src/components/navigation/BottomTabNavigator'
import CreatPostPage from 'src/screens/home/creat-post'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.FEED)

  const renderScreen = () => {
    switch (activeTab) {
      case TabEnum.FEED:
        return <FeedPage />
      case TabEnum.SEARCH:
        return <SearchPage />
      case TabEnum.CREATE_POST:
        return <CreatPostPage />
      case TabEnum.CHAT:
        return <ChatPage />
      case TabEnum.PERFIL:
        return <ProfilePage />
      default:
        return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <CustomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  )
}

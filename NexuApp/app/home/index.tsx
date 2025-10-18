import CustomTabBar, { TabEnum } from 'src/components/navigation/BottomTabNavigator'
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { useProfileNavigation } from 'src/context/ProfileNavigationContext'
import CreatPostPage from 'src/screens/home/creat-post'
import * as Animatable from 'react-native-animatable'
import ProfilePage from 'src/screens/home/profile'
import SearchPage from 'src/screens/home/search'
import ChatsPage from 'src/screens/home/chats'
import FeedPage from 'src/screens/home/feed'
import { useRef, useState } from 'react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabEnum>(TabEnum.FEED)
  const [showTabBar, setShowTabBar] = useState(true)
  const { navigateToOwnProfile, isViewingOtherProfile } = useProfileNavigation()

  const handleTabPress = (tab: TabEnum) => {
    if (tab === TabEnum.PERFIL && isViewingOtherProfile) {
      navigateToOwnProfile()
    }
    setActiveTab(tab)
  }

  const lastScrollY = useRef(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y
    const deltaY = currentY - lastScrollY.current

    if (currentY <= 0) {
      setShowTabBar(true)
      lastScrollY.current = currentY
      return
    }

    if (Math.abs(deltaY) < 2) return

    if (deltaY > 0) {
      setShowTabBar(false)
    } else {
      setShowTabBar(true)
    }

    lastScrollY.current = currentY
  }

  const renderScreen = () => {
    switch (activeTab) {
      case TabEnum.FEED:
        return <FeedPage handleScroll={handleScroll} />
      case TabEnum.SEARCH:
        return <SearchPage handleScroll={handleScroll} setActiveTab={setActiveTab} />
      case TabEnum.CREATE_POST:
        return <CreatPostPage />
      case TabEnum.CHAT:
        return <ChatsPage handleScroll={handleScroll} />
      case TabEnum.PERFIL:
        return <ProfilePage handleScroll={handleScroll} />
      default:
        return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#eeeeee' }}>{renderScreen()}</View>
      <Animatable.View
        animation={showTabBar ? 'fadeInUp' : 'fadeOutDown'}
        duration={300}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        useNativeDriver
      >
        <CustomTabBar activeTab={activeTab} setActiveTab={handleTabPress} />
      </Animatable.View>
    </View>
  )
}

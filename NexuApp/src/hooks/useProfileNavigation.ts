import { useProfileNavigation as useProfileNavigationContext } from 'src/context/ProfileNavigationContext'
import { TabEnum } from 'src/components/navigation/BottomTabNavigator'

export const useProfileNavigation = () => {
  const context = useProfileNavigationContext()

  const navigateToUserProfile = (userId: number, setActiveTab?: (tab: TabEnum) => void) => {
    context.navigateToProfile(userId)

    if (setActiveTab) {
      setActiveTab(TabEnum.PERFIL)
    }
  }

  return {
    ...context,
    navigateToUserProfile
  }
}

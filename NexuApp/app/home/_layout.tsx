import FooterNavitagion from 'src/components/navigation/FooterNavigation'
import AuthGuard from 'src/components/guard/AuthGuard'
import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }} />
      <FooterNavitagion />
    </AuthGuard>
  )
}

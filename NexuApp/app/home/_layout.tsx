import { ProfileNavigationProvider } from 'src/context/ProfileNavigationContext'
import AuthGuard from 'src/components/guard/AuthGuard'
import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <ProfileNavigationProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGuard>
    </ProfileNavigationProvider>
  )
}

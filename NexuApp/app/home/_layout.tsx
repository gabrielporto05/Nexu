import AuthGuard from 'src/components/guard/AuthGuard'
import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <AuthGuard>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthGuard>
  )
}

import AuthGuard from 'src/components/guard/AuthGuard'
import { Slot } from 'expo-router'

export default function HomeLayout() {
  return (
    <AuthGuard>
      <Slot />
    </AuthGuard>
  )
}

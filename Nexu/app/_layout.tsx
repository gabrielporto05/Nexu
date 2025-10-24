import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as PaperProvider } from 'react-native-paper'
import { AuthProvider } from 'src/context/auth/AuthContext'
import { ThemeProvider } from 'src/context/theme/ThemeContext'
import { ToastWrapper } from 'src/utils/toast'
import { StatusBar } from 'expo-status-bar'
import { Slot } from 'expo-router'
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk'
import Loading from 'src/components/Loanding'

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold
  })

  if (!fontsLoaded && !fontError) return <Loading />

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PaperProvider>
            <StatusBar style='auto' />
            <Slot />
            <ToastWrapper />
          </PaperProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

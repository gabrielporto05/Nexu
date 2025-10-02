import { Slot } from 'expo-router'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk'
import { ToastWrapper } from 'src/utils/toast'
import { AuthProvider } from 'src/context/AuthContext'

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold
  })

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>
          <StatusBar />
          <Slot />
          <ToastWrapper />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

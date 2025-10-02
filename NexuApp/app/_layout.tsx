import { Slot } from 'expo-router'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, View, Text } from 'react-native'
import theme from 'src/theme/theme'

import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk'

export default function Layout() {
  const colorScheme = useColorScheme()

  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold
  })

  console.log('Fonts loaded:', fontsLoaded)
  console.log('Font error:', fontError)

  if (fontError) {
    console.error('Error loading fonts:', fontError)
  }

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Carregando fontes...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme[colorScheme || 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  )
}

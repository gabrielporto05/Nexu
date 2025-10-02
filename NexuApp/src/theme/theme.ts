import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper'

const fontConfig = {
  fontFamily: 'SpaceGrotesk_400Regular',
  headlineLarge: {
    fontFamily: 'SpaceGrotesk_700Bold'
  },
  headlineMedium: {
    fontFamily: 'SpaceGrotesk_700Bold'
  },
  headlineSmall: {
    fontFamily: 'SpaceGrotesk_700Bold'
  },
  titleLarge: {
    fontFamily: 'SpaceGrotesk_700Bold'
  },
  titleMedium: {
    fontFamily: 'SpaceGrotesk_500Medium'
  },
  titleSmall: {
    fontFamily: 'SpaceGrotesk_500Medium'
  },
  bodyLarge: {
    fontFamily: 'SpaceGrotesk_400Regular'
  },
  bodyMedium: {
    fontFamily: 'SpaceGrotesk_400Regular'
  },
  bodySmall: {
    fontFamily: 'SpaceGrotesk_400Regular'
  },
  labelLarge: {
    fontFamily: 'SpaceGrotesk_500Medium'
  },
  labelMedium: {
    fontFamily: 'SpaceGrotesk_500Medium'
  },
  labelSmall: {
    fontFamily: 'SpaceGrotesk_500Medium'
  }
}

const customTheme = {
  light: {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...MD3LightTheme.colors,
      primary: '#855CF8',
      background: '#FFFFFF',
      text: '#333333'
    }
  },
  dark: {
    ...MD3DarkTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#855CF8',
      background: '#121212',
      text: '#FFFFFF'
    }
  }
}

export default customTheme

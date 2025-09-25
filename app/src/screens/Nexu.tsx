import { Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { RootStackParamList } from 'src/utils/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuth } from 'src/hooks/useAuth'
import { NexuApenasSemFundoLogo } from 'src/utils/imgs'

const NexuPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigation.navigate('Home')

        return
      }

      const timer = setTimeout(() => {
        navigation.navigate('Login')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, loading])

  return (
    <View style={styles.container}>
      <Image source={NexuApenasSemFundoLogo} style={styles.logo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05021B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%',
    height: '100%'
  }
})

export default NexuPage

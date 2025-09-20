import { Image, StyleSheet, View } from 'react-native'
import { NexuApenasSemFundoLogo } from 'src/utils/imgs'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { RootStackParamList } from 'src/utils/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const NexuPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Image source={NexuApenasSemFundoLogo} style={styles.logo} resizeMode='contain' />
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

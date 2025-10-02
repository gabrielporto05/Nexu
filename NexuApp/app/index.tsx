import { useEffect } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'

export default function IndexPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require('../assets/NexuApenasSemFundo.png')} style={styles.logo} resizeMode='contain' />
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

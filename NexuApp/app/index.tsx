import { View, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useAuth } from 'src/context/AuthContext'

export default function IndexPage() {
  const { user } = useAuth()

 useEffect(() => {
  const timer = setTimeout(() => {
    const getRedirectPath = () => {
      return user ? '/home' : '/auth/login'
    }

    router.replace(getRedirectPath())
  }, 2000)

  return () => clearTimeout(timer)
}, [user])


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

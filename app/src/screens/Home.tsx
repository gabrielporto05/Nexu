import { StyleSheet, Text, View } from 'react-native'
import { useAuth } from 'src/hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'src/utils/types'

const HomePage = () => {
  const { user, isAuthenticated, loading } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.navigate('Login')
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, {user.name || 'usuário'}!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default HomePage

import { StyleSheet, Text, View } from 'react-native'

const ForgotPasswordPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ForgotPassword</Text>
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

export default ForgotPasswordPage

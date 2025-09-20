import { StyleSheet, Text, View } from 'react-native'
import { LoginSchema, LoginSchemaType } from 'src/schemas/authSchema'
import { useForm } from 'react-hook-form'

const LoginPage = () => {
  const form = useForm<LoginSchemaType>({
    resolver: LoginSchema,
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { handleSubmit } = form

  const onSubmit = (data: LoginSchemaType) => {
    console.log(data)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
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

export default LoginPage

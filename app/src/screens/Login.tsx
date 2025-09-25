import { Image, StyleSheet, Text, View } from 'react-native'
import { LoginSchema, LoginSchemaType } from 'src/schemas/authSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'src/utils/types'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { Login } from 'src/services/apiAuth'
import { getErrorMessage } from 'src/utils/errorHandler'
import { NexuApenasSemFundoPretaLogo } from 'src/utils/imgs'

const LoginPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const { message } = await Login(data)

      Toast.show({
        type: 'success',
        text1: message
      })

      navigation.navigate('Home')
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao logar')
      })
    }
  }

  return (
    <View style={styles.container}>
      <Image source={NexuApenasSemFundoPretaLogo} style={styles.logo} />
      <View style={styles.containerForm}>
        <Text style={styles.title}>
          Entre <br /> com suas credenciais!
        </Text>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={styles.inputLabel}>Email</Text>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='chines@email.com'
                  mode='outlined'
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.email}
                  style={styles.input}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </View>

          <View>
            <Text style={styles.inputLabel}>Password</Text>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='********'
                  mode='outlined'
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.password}
                  style={styles.input}
                  secureTextEntry={true}
                />
              )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <Text
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Esqueci minha senha
          </Text>
        </View>

        <Button
          buttonColor='#855CF8'
          mode='contained'
          onPress={handleSubmit(onSubmit)}
          style={{ marginVertical: 50, paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>Entrar</Text>
        </Button>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>-Ou entre com-</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 50 }}>
          <View
            style={{
              height: 100,
              width: 100,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-google' size={50} />
          </View>
          <View
            style={{
              height: 100,
              width: 100,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-github' size={50} />
          </View>
          <View
            style={{
              height: 100,
              width: 100,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-facebook' size={50} />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontSize: 16 }}>
            Não possui uma conta?{' '}
            <Text
              style={{ color: 'blue', textDecorationLine: 'underline' }}
              onPress={() => navigation.navigate('Register')}
            >
              Registre-se
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  containerForm: {
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#ffffff0'
  },
  error: {
    color: '#FF6B6B',
    marginBottom: 8,
    marginLeft: 4
  }
})

export default LoginPage

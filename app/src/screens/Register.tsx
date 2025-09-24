import { Image, StyleSheet, Text, View } from 'react-native'
import { RegisterSchema, RegisterSchemaType } from 'src/schemas/authSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInput, Button } from 'react-native-paper'
import { NexuApenasSemFundoPretaLogo } from 'src/utils/imgs'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'src/utils/types'
import Toast from 'react-native-toast-message'
import { Register } from 'src/services/apiAuth'
import { getErrorMessage } from 'src/utils/errorHandler'

const RegisterPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      nick: '',
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const { message } = await Register(data)

      Toast.show({
        type: 'success',
        text1: message
      })

      navigation.navigate('Login')
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(error, 'Erro ao registrar')
      })
    }
  }

  return (
    <View style={styles.container}>
      <Image source={NexuApenasSemFundoPretaLogo} style={styles.logo} />
      <View style={styles.containerForm}>
        <Text style={styles.title}>
          Registre-se <br /> com suas credenciais!
        </Text>

        <View style={{ gap: 16 }}>
          {['name', 'nick', 'email', 'password', 'confirm_password'].map(field => (
            <View key={field}>
              <Text style={styles.inputLabel}>
                {field === 'confirm_password' ? 'Confirme a senha' : field.charAt(0).toUpperCase() + field.slice(1)}
              </Text>
              <Controller
                control={control}
                name={field as keyof RegisterSchemaType}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={
                      field === 'email'
                        ? 'chines@email.com'
                        : field.includes('password')
                        ? '********'
                        : field.includes('name')
                        ? 'Chines Porto'
                        : field.includes('nick')
                        ? 'chines05'
                        : ''
                    }
                    mode='outlined'
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors[field as keyof RegisterSchemaType]}
                    style={styles.input}
                    secureTextEntry={field.includes('password')}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                    keyboardType={field === 'email' ? 'email-address' : 'default'}
                  />
                )}
              />
              {errors[field as keyof RegisterSchemaType] && (
                <Text style={styles.error}>{errors[field as keyof RegisterSchemaType]?.message}</Text>
              )}
            </View>
          ))}
        </View>

        <Button
          buttonColor='#855CF8'
          mode='contained'
          onPress={handleSubmit(onSubmit)}
          style={{ marginVertical: 50, paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>Registrar</Text>
        </Button>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>
            Já possui uma conta?{' '}
            <Text
              style={{ color: 'blue', textDecorationLine: 'underline' }}
              onPress={() => navigation.navigate('Login')}
            >
              Faça Login!
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

export default RegisterPage

import { Image, StyleSheet, View } from 'react-native'
import { LoginSchema, LoginSchemaType } from 'src/schemas/authSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { Login } from 'src/services/apiAuth'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useRouter } from 'expo-router'
import TextNexu from 'src/components/ui/TextNexu'
import TextInputNexu from 'src/components/ui/TextInputNexu'
import ButtonNexu from 'src/components/ui/ButtonNexu'
import { useAuth } from 'src/context/AuthContext'

const LoginPage = () => {
  const router = useRouter()
  const { signIn } = useAuth()

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
      const message = await signIn(data)

      Toast.show({
        type: 'success',
        text1: message!
      })

      router.replace('/home')
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao logar')
      })
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center'
      }}
    >
      <Image source={require('../../assets/NexuApenasSemFundoPreta.png')} style={{ alignSelf: 'center', flex: 0.4 }} />
      <View
        style={{
          flex: 1
        }}
      >
        <TextNexu
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 32,
            textAlign: 'center'
          }}
        >
          Entre <TextNexu>com suas credenciais!</TextNexu>
        </TextNexu>

        <View style={{ gap: 16 }}>
          <View>
            <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Email</TextNexu>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputNexu
                  placeholder='chines@email.com'
                  mode='outlined'
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.email}
                  style={{
                    marginBottom: 5,
                    backgroundColor: '#ffffff0'
                  }}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              )}
            />
            {errors.email && (
              <TextNexu
                style={{
                  color: '#FF6B6B',
                  marginBottom: 8,
                  marginLeft: 4
                }}
              >
                {errors.email.message}
              </TextNexu>
            )}
          </View>

          <View>
            <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>Password</TextNexu>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputNexu
                  placeholder='********'
                  mode='outlined'
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.password}
                  style={{
                    marginBottom: 5,
                    backgroundColor: '#ffffff0'
                  }}
                  secureTextEntry={true}
                />
              )}
            />
            {errors.password && (
              <TextNexu
                style={{
                  color: '#FF6B6B',
                  marginBottom: 8,
                  marginLeft: 4
                }}
              >
                {errors.password.message}
              </TextNexu>
            )}
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <TextNexu style={{ color: 'blue', fontSize: 16 }} onPress={() => router.push('/auth/forgot-password')}>
            Esqueci minha senha
          </TextNexu>
        </View>

        <ButtonNexu
          buttonColor='#855CF8'
          onPress={handleSubmit(onSubmit)}
          style={{ marginVertical: 30, paddingVertical: 8 }}
        >
          <TextNexu style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>Entrar</TextNexu>
        </ButtonNexu>

        <View style={{ alignItems: 'center' }}>
          <TextNexu style={{ fontSize: 18 }}>-Ou entre com-</TextNexu>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
          <View
            style={{
              height: 80,
              width: 80,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-google' size={40} />
          </View>
          <View
            style={{
              height: 80,
              width: 80,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-github' size={40} />
          </View>
          <View
            style={{
              height: 80,
              width: 80,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name='logo-facebook' size={40} />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <TextNexu style={{ fontSize: 16 }}>
            Não possui uma conta?{' '}
            <TextNexu style={{ color: 'blue' }} onPress={() => router.push('/auth/register')}>
              Registre-se
            </TextNexu>
          </TextNexu>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  logo: {},
  containerForm: {},
  title: {},
  inputLabel: {},
  input: {},
  error: {
    color: '#FF6B6B',
    marginBottom: 8,
    marginLeft: 4
  }
})

export default LoginPage

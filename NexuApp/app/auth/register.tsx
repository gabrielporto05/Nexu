import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Toast from 'react-native-toast-message'
import { RegisterSchema, RegisterSchemaType } from 'src/schemas/authSchema'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useRouter } from 'expo-router'
import type { KeyboardTypeOptions } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import ButtonNexu from 'src/components/ui/ButtonNexu'
import { useAuth } from 'src/context/AuthContext'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { useState } from 'react'

const RegisterPage = () => {
  const router = useRouter()
  const { singUp } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      const message = await singUp(data)

      Toast.show({
        type: 'success',
        text1: message || 'Conta criada com sucesso!'
      })
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao registrar')
      })
    }
  }

  const fields: {
    label: string
    name: keyof RegisterSchemaType
    placeholder: string
    keyboardType?: KeyboardTypeOptions
  }[] = [
    { label: 'Nome', name: 'name', placeholder: 'Seu nome completo' },
    { label: 'Nick', name: 'nick', placeholder: 'Seu @nick' },
    { label: 'Email', name: 'email', placeholder: 'seu@email.com', keyboardType: 'email-address' },
    { label: 'Senha', name: 'password', placeholder: '********' },
    { label: 'Confirmar Senha', name: 'confirm_password', placeholder: '********' }
  ]

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: '#fff'
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View>
          <Image
            source={require('../../assets/NexuApenasSemFundoPreta.png')}
            style={{ alignSelf: 'center', flex: 0.4 }}
          />
          <View style={{ flex: 1.2 }}>
            <TextNexu style={{ fontSize: 40, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
              Registre-se
            </TextNexu>
            <TextNexu style={{ fontSize: 30, color: '#000', marginBottom: 32, textAlign: 'center' }}>
              Crie sua conta agora!
            </TextNexu>

            <View style={{ gap: 16 }}>
              {fields.map(field => (
                <View key={field.name}>
                  <TextNexu style={{ fontSize: 22, fontWeight: 'bold', color: '#000' }}>{field.label}</TextNexu>
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInputNexu
                        placeholder={field.placeholder}
                        mode='outlined'
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        error={!!errors[field.name]}
                        style={{ marginBottom: 5, backgroundColor: '#ffffff0' }}
                        keyboardType={field.keyboardType}
                        secureTextEntry={
                          field.name === 'password'
                            ? !showPassword
                            : field.name === 'confirm_password'
                            ? !showConfirmPassword
                            : false
                        }
                        right={
                          (field.name === 'password' || field.name === 'confirm_password') && (
                            <TextInputNexu.Icon
                              icon={
                                field.name === 'password'
                                  ? showPassword
                                    ? 'eye-off'
                                    : 'eye'
                                  : showConfirmPassword
                                  ? 'eye-off'
                                  : 'eye'
                              }
                              onPress={() =>
                                field.name === 'password'
                                  ? setShowPassword(prev => !prev)
                                  : setShowConfirmPassword(prev => !prev)
                              }
                            />
                          )
                        }
                        autoCapitalize='none'
                      />
                    )}
                  />
                  {errors[field.name] && (
                    <TextNexu style={{ color: '#FF6B6B', marginBottom: 8, marginLeft: 4 }}>
                      {errors[field.name]?.message}
                    </TextNexu>
                  )}
                </View>
              ))}
            </View>

            <ButtonNexu
              buttonColor='#855CF8'
              onPress={handleSubmit(onSubmit)}
              style={{ marginVertical: 30, paddingVertical: 8 }}
            >
              <TextNexu style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>Registrar</TextNexu>
            </ButtonNexu>

            <View style={{ alignItems: 'center' }}>
              <TextNexu style={{ fontSize: 18 }}>
                Já possui uma conta?{' '}
                <TextNexu style={{ color: 'blue' }} onPress={() => router.push('/auth/login')}>
                  Faça login
                </TextNexu>
              </TextNexu>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterPage

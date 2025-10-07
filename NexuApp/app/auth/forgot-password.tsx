import { KeyboardAvoidingView, Platform, ScrollView, View, Image } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import ButtonNexu from 'src/components/ui/ButtonNexu'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { ForgotPasswordSchemaType } from 'src/schemas/authSchema'
import { useAuth } from 'src/context/AuthContext'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordSchemaType>({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    setLoading(true)
    try {
      const message = await forgotPassword(data)
      Toast.show({
        type: 'success',
        text1: message
      })

      setTimeout(() => {
        setLoading(false)
        router.replace('/auth/password-sent')
      }, 1500)
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao recuperar senha')
      })
    } finally {
      setLoading(false)
    }
  }

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
            style={{ alignSelf: 'center', width: '100%', height: 150 }}
          />
          <View>
            <View>
              <TextNexu style={{ fontSize: 40, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
                Recuperar Senha
              </TextNexu>
              <TextNexu style={{ fontSize: 30, color: '#000', marginBottom: 32, textAlign: 'center' }}>
                Insira seu e-mail para receber uma nova senha
              </TextNexu>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <TextNexu style={{ fontSize: 22, fontWeight: 'bold', color: '#000' }}>Email</TextNexu>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputNexu
                      placeholder='seu@email.com'
                      mode='outlined'
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={!!errors.email}
                      style={{ marginBottom: 5, backgroundColor: '#ffffff0' }}
                      keyboardType='email-address'
                      autoCapitalize='none'
                    />
                  )}
                />
                {errors.email && (
                  <TextNexu style={{ color: '#FF6B6B', marginBottom: 8, marginLeft: 4 }}>
                    {errors.email.message}
                  </TextNexu>
                )}
              </View>
            </View>

            <ButtonNexu
              buttonColor='#855CF8'
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={{ marginVertical: 30, paddingVertical: 8 }}
            >
              <TextNexu style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>Enviar nova senha</TextNexu>
            </ButtonNexu>

            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <TextNexu style={{ fontSize: 18 }}>
                Lembrou sua senha?{' '}
                <TextNexu style={{ color: 'blue' }} onPress={() => router.push('/auth/login')}>
                  Voltar ao login
                </TextNexu>
              </TextNexu>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default ForgotPasswordPage

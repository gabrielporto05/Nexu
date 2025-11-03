import { KeyboardAvoidingView, Platform, ScrollView, View, TouchableOpacity } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { ForgotPasswordSchemaType } from 'src/schemas/authSchema'
import { useAuth } from 'src/context/auth/AuthContext'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'src/context/theme/ThemeContext'

const ForgotPasswordScreen = () => {
  const { forgotPassword } = useAuth()
  const router = useRouter()
  const { theme, colors } = useTheme()
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordSchemaType>({
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      const message = await forgotPassword(data)
      Toast.show({ type: 'success', text1: message })
      setTimeout(() => router.replace('/auth/password-sent'), 1500)
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao recuperar senha') })
    }
  }

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? [colors.background, colors.surface, colors.card]
          : [colors.surface, colors.background, colors.background]
      }
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View
            animation='fadeInDown'
            duration={1000}
            delay={200}
            style={{ marginBottom: 40, alignItems: 'center' }}
          >
            <Ionicons name='key' size={48} color={colors.primary} style={{ marginBottom: 16 }} />
            <TextNexu style={{ fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 8 }}>
              Esqueceu a senha?
            </TextNexu>
            <TextNexu style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 }}>
              Insira seu e-mail e enviaremos{'\n'}uma nova senha para você
            </TextNexu>
          </Animatable.View>

          <Animatable.View
            animation='fadeInUp'
            duration={1000}
            delay={400}
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 24,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: `${colors.primary}33`
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name='mail'
                  size={20}
                  color={focusedField === 'email' ? colors.primary : colors.textSecondary}
                />
                <TextNexu
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: focusedField === 'email' ? colors.primary : colors.textSecondary,
                    marginLeft: 8
                  }}
                >
                  Email
                </TextNexu>
              </View>

              <Controller
                control={control}
                name='email'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: errors.email
                        ? colors.error
                        : focusedField === 'email'
                          ? colors.primary
                          : colors.border,
                      borderRadius: 16,
                      backgroundColor: colors.inputBackground,
                      overflow: 'hidden'
                    }}
                  >
                    <TextInputNexu
                      placeholder='seu@email.com'
                      placeholderTextColor={colors.placeholder}
                      mode='flat'
                      value={value}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => {
                        setFocusedField(null)
                        onBlur()
                      }}
                      onChangeText={onChange}
                      error={!!errors.email}
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        paddingHorizontal: 16,
                        color: colors.text
                      }}
                      keyboardType='email-address'
                      autoCapitalize='none'
                      underlineColor='transparent'
                      activeUnderlineColor='transparent'
                    />
                  </View>
                )}
              />

              {errors.email && (
                <Animatable.View animation='shake' style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name='alert-circle' size={16} color={colors.error} />
                  <TextNexu style={{ color: colors.error, marginLeft: 6, fontSize: 13 }}>
                    {errors.email.message}
                  </TextNexu>
                </Animatable.View>
              )}
            </View>

            <Animatable.View animation='pulse' iterationCount='infinite' duration={3000}>
              <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.9}>
                <LinearGradient
                  colors={[colors.primary, '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 18,
                    borderRadius: 16,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.6,
                    shadowRadius: 16,
                    elevation: 12
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    {isSubmitting ? (
                      <>
                        <Animatable.View animation='rotate' iterationCount='infinite' duration={1000}>
                          <Ionicons name='sync' size={22} color='#FFF' />
                        </Animatable.View>
                        <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Enviando...</TextNexu>
                      </>
                    ) : (
                      <>
                        <Ionicons name='paper-plane' size={22} color='#FFF' />
                        <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>
                          Enviar Nova Senha
                        </TextNexu>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          <Animatable.View
            animation='fadeInUp'
            duration={1000}
            delay={600}
            style={{ alignItems: 'center', marginTop: 32 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextNexu style={{ fontSize: 15, color: colors.textSecondary }}>Lembrou sua senha? </TextNexu>
              <TouchableOpacity onPress={() => router.push('/auth/login')} activeOpacity={0.7}>
                <TextNexu style={{ fontSize: 15, color: colors.primary, fontWeight: 'bold' }}>Voltar ao login</TextNexu>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default ForgotPasswordScreen

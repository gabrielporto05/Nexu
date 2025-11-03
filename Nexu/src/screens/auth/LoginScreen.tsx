import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { LoginSchema, LoginSchemaType } from 'src/schemas/authSchema'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { useTheme } from 'src/context/theme/ThemeContext'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useAuth } from 'src/context/auth/AuthContext'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'
import TextNexu from 'src/components/ui/TextNexu'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'

const LoginScreen = () => {
  const router = useRouter()
  const { signIn } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const { theme, colors } = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await signIn(data)
      router.replace('/home')
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao logar')
      })
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
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 24,
            paddingBottom: bottom + 20
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View
            animation='fadeInDown'
            duration={1000}
            delay={300}
            style={{ marginBottom: 40, alignItems: 'center' }}
          >
            <TextNexu
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: 8
              }}
            >
              Bem-vindo de volta!
            </TextNexu>
            <TextNexu style={{ fontSize: 16, color: colors.textSecondary }}>
              Entre com suas credenciais para continuar
            </TextNexu>
          </Animatable.View>

          <Animatable.View
            animation='fadeInUp'
            duration={1000}
            delay={500}
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
            <Animatable.View animation='fadeInRight' duration={800} delay={700} style={{ marginBottom: 20 }}>
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
            </Animatable.View>

            <Animatable.View animation='fadeInRight' duration={800} delay={900} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name='lock-closed'
                  size={20}
                  color={focusedField === 'password' ? colors.primary : colors.textSecondary}
                />
                <TextNexu
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: focusedField === 'password' ? colors.primary : colors.textSecondary,
                    marginLeft: 8
                  }}
                >
                  Senha
                </TextNexu>
              </View>
              <Controller
                control={control}
                name='password'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: errors.password
                        ? colors.error
                        : focusedField === 'password'
                          ? colors.primary
                          : colors.border,
                      borderRadius: 16,
                      backgroundColor: colors.inputBackground,
                      overflow: 'hidden',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <TextInputNexu
                      placeholder='Digite sua senha'
                      placeholderTextColor={colors.placeholder}
                      mode='flat'
                      value={value}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => {
                        setFocusedField(null)
                        onBlur()
                      }}
                      onChangeText={onChange}
                      error={!!errors.password}
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        paddingHorizontal: 16,
                        flex: 1,
                        color: colors.text
                      }}
                      secureTextEntry={!showPassword}
                      underlineColor='transparent'
                      activeUnderlineColor='transparent'
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(prev => !prev)}
                      style={{ paddingHorizontal: 16 }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Animatable.View animation='shake' style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name='alert-circle' size={16} color={colors.error} />
                  <TextNexu style={{ color: colors.error, marginLeft: 6, fontSize: 13 }}>
                    {errors.password.message}
                  </TextNexu>
                </Animatable.View>
              )}
            </Animatable.View>

            <Animatable.View animation='fadeIn' duration={800} delay={1100}>
              <TouchableOpacity
                onPress={() => router.push('/auth/forgot-password')}
                style={{ alignSelf: 'flex-end', marginBottom: 24 }}
                activeOpacity={0.7}
              >
                <TextNexu style={{ color: '#855CF8', fontSize: 14, fontWeight: '600' }}>Esqueceu a senha?</TextNexu>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation='pulse' iterationCount='infinite' duration={3000}>
              <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.9}>
                <LinearGradient
                  colors={[`${colors.primary}`, '#7C3AED']}
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
                        <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Entrando...</TextNexu>
                      </>
                    ) : (
                      <>
                        <Ionicons name='log-in' size={22} color='#FFF' />
                        <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Entrar</TextNexu>
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
            delay={1300}
            style={{ alignItems: 'center', marginTop: 32 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextNexu style={{ fontSize: 15, color: colors.textSecondary }}>Não possui uma conta? </TextNexu>
              <TouchableOpacity onPress={() => router.push('/auth/register')} activeOpacity={0.7}>
                <TextNexu style={{ fontSize: 15, color: colors.primary, fontWeight: 'bold' }}>Registre-se</TextNexu>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default LoginScreen

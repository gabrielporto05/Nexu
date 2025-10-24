import { KeyboardAvoidingView, Platform, ScrollView, View, TouchableOpacity } from 'react-native'
import { RegisterSchema, RegisterSchemaType } from 'src/schemas/authSchema'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { getErrorMessage } from 'src/utils/errorHandler'
import type { KeyboardTypeOptions } from 'react-native'
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
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RegisterScreen = () => {
  const router = useRouter()
  const { singUp } = useAuth()
  const { bottom } = useSafeAreaInsets()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
    formState: { errors, isSubmitting }
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
    icon: string
  }[] = [
    { label: 'Nome', name: 'name', placeholder: 'Seu nome completo', icon: 'person' },
    { label: 'Nick', name: 'nick', placeholder: 'Seu @nick', icon: 'at' },
    { label: 'Email', name: 'email', placeholder: 'seu@email.com', keyboardType: 'email-address', icon: 'mail' },
    { label: 'Senha', name: 'password', placeholder: '********', icon: 'lock-closed' },
    { label: 'Confirmar Senha', name: 'confirm_password', placeholder: '********', icon: 'shield-checkmark' }
  ]

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 24,
            paddingTop: 60,
            paddingBottom: bottom + 20
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View
            animation='fadeInDown'
            duration={1000}
            delay={200}
            style={{ marginBottom: 30, alignItems: 'center' }}
          >
            <TextNexu
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: 8
              }}
            >
              Crie sua conta
            </TextNexu>
            <TextNexu style={{ fontSize: 15, color: '#9CA3AF' }}>Preencha os dados para começar</TextNexu>
          </Animatable.View>

          <Animatable.View
            animation='fadeInUp'
            duration={1000}
            delay={400}
            style={{
              backgroundColor: '#1E1E38',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#855CF8',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: 'rgba(133, 92, 248, 0.3)'
            }}
          >
            {fields.map((field, index) => (
              <Animatable.View
                key={field.name}
                animation='fadeInRight'
                duration={700}
                delay={600 + index * 100}
                style={{ marginBottom: 16 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons
                    name={field.icon as any}
                    size={18}
                    color={focusedField === field.name ? '#855CF8' : '#6B7280'}
                  />
                  <TextNexu
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: focusedField === field.name ? '#855CF8' : '#9CA3AF',
                      marginLeft: 8
                    }}
                  >
                    {field.label}
                  </TextNexu>
                </View>

                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: errors[field.name]
                          ? '#EF4444'
                          : focusedField === field.name
                            ? '#855CF8'
                            : '#374151',
                        borderRadius: 16,
                        backgroundColor: '#0F0F23',
                        overflow: 'hidden',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <TextInputNexu
                        placeholder={field.placeholder}
                        placeholderTextColor='#6B7280'
                        mode='flat'
                        value={value}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => {
                          setFocusedField(null)
                          onBlur()
                        }}
                        onChangeText={onChange}
                        error={!!errors[field.name]}
                        style={{
                          backgroundColor: 'transparent',
                          fontSize: 15,
                          paddingHorizontal: 16,
                          flex: 1,
                          color: '#FFFFFF'
                        }}
                        keyboardType={field.keyboardType}
                        secureTextEntry={
                          field.name === 'password'
                            ? !showPassword
                            : field.name === 'confirm_password'
                              ? !showConfirmPassword
                              : false
                        }
                        autoCapitalize='none'
                        underlineColor='transparent'
                        activeUnderlineColor='transparent'
                      />
                      {(field.name === 'password' || field.name === 'confirm_password') && (
                        <TouchableOpacity
                          onPress={() =>
                            field.name === 'password'
                              ? setShowPassword(prev => !prev)
                              : setShowConfirmPassword(prev => !prev)
                          }
                          style={{ paddingHorizontal: 16 }}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={
                              field.name === 'password'
                                ? showPassword
                                  ? 'eye'
                                  : 'eye-off'
                                : showConfirmPassword
                                  ? 'eye'
                                  : 'eye-off'
                            }
                            size={20}
                            color='#6B7280'
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                />

                {errors[field.name] && (
                  <Animatable.View
                    animation='shake'
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
                  >
                    <Ionicons name='alert-circle' size={14} color='#EF4444' />
                    <TextNexu style={{ color: '#EF4444', marginLeft: 6, fontSize: 12 }}>
                      {errors[field.name]?.message}
                    </TextNexu>
                  </Animatable.View>
                )}
              </Animatable.View>
            ))}

            <Animatable.View animation='pulse' iterationCount='infinite' duration={3000} style={{ marginTop: 8 }}>
              <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.9}>
                <LinearGradient
                  colors={['#9B7EF8', '#855CF8', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 16,
                    shadowColor: '#855CF8',
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
                          <Ionicons name='sync' size={20} color='#FFF' />
                        </Animatable.View>
                        <TextNexu style={{ fontSize: 17, fontWeight: 'bold', color: '#FFF' }}>Criando...</TextNexu>
                      </>
                    ) : (
                      <>
                        <Ionicons name='person-add' size={20} color='#FFF' />
                        <TextNexu style={{ fontSize: 17, fontWeight: 'bold', color: '#FFF' }}>Criar Conta</TextNexu>
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
            delay={1200}
            style={{ alignItems: 'center', marginTop: 24, marginBottom: 24 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextNexu style={{ fontSize: 14, color: '#9CA3AF' }}>Já possui uma conta? </TextNexu>
              <TouchableOpacity onPress={() => router.push('/auth/login')} activeOpacity={0.7}>
                <TextNexu style={{ fontSize: 14, color: '#855CF8', fontWeight: 'bold' }}>Faça login</TextNexu>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default RegisterScreen

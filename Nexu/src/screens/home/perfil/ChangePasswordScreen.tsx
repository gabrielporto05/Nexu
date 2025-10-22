import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import TextNexu from 'src/components/ui/TextNexu'
import { LinearGradient } from 'expo-linear-gradient'
import Toast from 'react-native-toast-message'
import * as Animatable from 'react-native-animatable'
import { useAuth } from 'src/context/auth/AuthContext'
import { router } from 'expo-router'
import { changePassword } from 'src/services/apiProfile'
import { Ionicons } from '@expo/vector-icons'
import { ChangePasswordSchema, ChangePasswordSchemaType } from 'src/schemas/ChangePasswordSchema'
import { getErrorMessage } from 'src/utils/errorHandler'
import Loading from 'src/components/Loanding'

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF'
}

const ChangePasswordScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: ''
    }
  })

  if (!user) return <Loading />

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    try {
      await changePassword(user.id, data)
      Toast.show({ type: 'success', text1: 'Senha alterada com sucesso!' })
      router.back()
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao alterar senha')
      })
    }
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={[styles.container, { paddingTop: top }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
            <Ionicons name='arrow-back' size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Animatable.View animation='fadeInDown' duration={600} style={{ marginBottom: 8 }}>
            <TextNexu variant='headlineLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
              Alterar senha
            </TextNexu>
            <TextNexu style={{ color: COLORS.subtext, marginTop: 6 }}>
              Informe sua senha atual e escolha uma nova senha segura
            </TextNexu>
          </Animatable.View>

          <Animatable.View animation='fadeInUp' duration={700} style={[styles.card, { backgroundColor: COLORS.card }]}>
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name='lock-closed'
                  size={20}
                  color={focusedField === 'current_password' ? COLORS.primary : COLORS.subtext}
                />
                <TextNexu
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: focusedField === 'current_password' ? COLORS.primary : COLORS.subtext,
                    marginLeft: 8
                  }}
                >
                  Senha atual
                </TextNexu>
              </View>

              <Controller
                control={control}
                name='current_password'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: errors.current_password
                        ? '#EF4444'
                        : focusedField === 'current_password'
                          ? COLORS.primary
                          : '#374151',
                      borderRadius: 16,
                      backgroundColor: '#0F0F23',
                      overflow: 'hidden',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <TextInputNexu
                      placeholder='Digite sua senha atual'
                      placeholderTextColor={COLORS.subtext}
                      value={value}
                      onFocus={() => setFocusedField('current_password')}
                      onBlur={() => {
                        setFocusedField(null)
                        onBlur()
                      }}
                      onChangeText={onChange}
                      secureTextEntry={!showCurrent}
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        paddingHorizontal: 16,
                        flex: 1,
                        color: COLORS.text
                      }}
                      error={!!errors.current_password}
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrent(prev => !prev)}
                      style={{ paddingHorizontal: 16 }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showCurrent ? 'eye' : 'eye-off'} size={22} color='#6B7280' />
                    </TouchableOpacity>
                  </View>
                )}
              />

              {errors.current_password && (
                <Animatable.View animation='shake' style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name='alert-circle' size={16} color='#EF4444' />
                  <TextNexu style={{ color: '#EF4444', marginLeft: 6, fontSize: 13 }}>
                    {errors.current_password.message}
                  </TextNexu>
                </Animatable.View>
              )}
            </View>

            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons
                  name='lock-closed'
                  size={20}
                  color={focusedField === 'new_password' ? COLORS.primary : COLORS.subtext}
                />
                <TextNexu
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: focusedField === 'new_password' ? COLORS.primary : COLORS.subtext,
                    marginLeft: 8
                  }}
                >
                  Nova senha
                </TextNexu>
              </View>

              <Controller
                control={control}
                name='new_password'
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: errors.new_password
                        ? '#EF4444'
                        : focusedField === 'new_password'
                          ? COLORS.primary
                          : '#374151',
                      borderRadius: 16,
                      backgroundColor: '#0F0F23',
                      overflow: 'hidden',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <TextInputNexu
                      placeholder='Crie uma nova senha'
                      placeholderTextColor={COLORS.subtext}
                      value={value}
                      onFocus={() => setFocusedField('new_password')}
                      onBlur={() => {
                        setFocusedField(null)
                        onBlur()
                      }}
                      onChangeText={onChange}
                      secureTextEntry={!showNew}
                      autoCapitalize='none'
                      returnKeyType='done'
                      maxLength={72}
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        paddingHorizontal: 16,
                        flex: 1,
                        color: COLORS.text
                      }}
                      error={!!errors.new_password}
                    />
                    <TouchableOpacity
                      onPress={() => setShowNew(prev => !prev)}
                      style={{ paddingHorizontal: 16 }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showNew ? 'eye' : 'eye-off'} size={22} color='#6B7280' />
                    </TouchableOpacity>
                  </View>
                )}
              />

              {errors.new_password && (
                <Animatable.View animation='shake' style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Ionicons name='alert-circle' size={16} color='#EF4444' />
                  <TextNexu style={{ color: '#EF4444', marginLeft: 6, fontSize: 13 }}>
                    {errors.new_password.message}
                  </TextNexu>
                </Animatable.View>
              )}

              <View style={{ marginTop: 8 }}>
                <TextNexu style={{ color: COLORS.subtext, fontSize: 13 }}>
                  A senha deve ter no mínimo 8 caracteres, incluir letras maiúsculas, minúsculas e números.
                </TextNexu>
              </View>
            </View>

            <View style={{ marginTop: 6 }}>
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                activeOpacity={0.9}
                style={{ borderRadius: 12, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#9B7EF8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveBtn}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color='#fff' />
                  ) : (
                    <TextNexu style={{ color: '#fff', fontWeight: '700' }}>Alterar senha</TextNexu>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  card: {
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F23',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 15
  },
  iconBtn: {
    padding: 8
  },
  saveBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },
  errorText: { color: '#FF6B6B', marginTop: 8 }
})

export default ChangePasswordScreen

import React, { useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from 'src/context/auth/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import { deleteAvatar, updateAvatar } from 'src/services/apiProfile'
import { updateUserInfo } from 'src/services/apiUser'
import { useForm, Controller } from 'react-hook-form'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { getErrorMessage } from 'src/utils/errorHandler'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF',
  danger: '#FF6B6B'
}

const UpdatePerfilScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user, refreshUser } = useAuth()
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '', nick: user?.nick || '' }
  })

  if (!user) return null

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9
    })
    if (!result.canceled) setSelectedImage(result.assets[0])
  }

  const handleAvatarUpload = async () => {
    if (!selectedImage) return
    const formData = new FormData()
    const filename = selectedImage.uri.split('/').pop() || `avatar_${user.id}.jpg`
    const match = /\.(\w+)$/.exec(filename)
    const ext = match ? match[1] : 'jpg'
    const mimeType = `image/${ext}`

    if (Platform.OS === 'web') {
      const response = await fetch(selectedImage.uri)
      const blob = await response.blob()
      // @ts-ignore
      formData.append('avatar', new File([blob], filename, { type: mimeType }))
    } else {
      formData.append('avatar', { uri: selectedImage.uri, name: filename, type: mimeType } as any)
    }

    await updateAvatar(formData)
  }

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar()
      setSelectedImage(null)
      await refreshUser()
      Toast.show({ type: 'success', text1: 'Avatar removido' })
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao remover avatar') })
    }
  }

  const onSubmit = async (data: { name: string; nick: string }) => {
    setLoading(true)
    try {
      await updateUserInfo(data.name, data.nick, user.id)
      if (selectedImage) await handleAvatarUpload()
      await refreshUser()
      Toast.show({ type: 'success', text1: 'Perfil atualizado com sucesso!' })
      router.back()
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao atualizar perfil') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={[styles.container, { paddingTop: top }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name='arrow-back' size={22} color={COLORS.text} />
            </TouchableOpacity>
            <Animatable.View animation='fadeInDown' duration={400}>
              <TextNexu style={styles.title}>Atualizar perfil</TextNexu>
              <TextNexu style={styles.subtitle}>Altere suas informações e avatar</TextNexu>
            </Animatable.View>
          </View>

          <Animatable.View animation='fadeInUp' duration={600} style={[styles.card, { backgroundColor: COLORS.card }]}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={[styles.avatarBorder, { borderColor: COLORS.primary }]}>
                <Image
                  source={{
                    uri: selectedImage?.uri || `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}`
                  }}
                  style={styles.avatarBig}
                  resizeMode='cover'
                />
              </View>

              <View style={{ flexDirection: 'row', marginTop: 12, gap: 12 }}>
                <TouchableOpacity onPress={pickImage} style={styles.smallBtn}>
                  <Ionicons name='image-outline' size={18} color='#fff' />
                  <TextNexu style={styles.smallBtnText}>Novo</TextNexu>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteAvatar}
                  style={[styles.smallBtn, { backgroundColor: COLORS.danger }]}
                >
                  <Ionicons name='trash-outline' size={18} color='#fff' />
                  <TextNexu style={styles.smallBtnText}>Remover</TextNexu>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 6 }}>
              <TextNexu style={{ color: COLORS.subtext, marginBottom: 8 }}>Nome</TextNexu>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, value } }) => (
                  <TextInputNexu placeholder='Seu nome' value={value} onChangeText={onChange} style={styles.input} />
                )}
              />
            </View>

            <View style={{ marginTop: 12 }}>
              <TextNexu style={{ color: COLORS.subtext, marginBottom: 8 }}>Nick</TextNexu>
              <Controller
                control={control}
                name='nick'
                render={({ field: { onChange, value } }) => (
                  <TextInputNexu placeholder='@seuNick' value={value} onChangeText={onChange} style={styles.input} />
                )}
              />
            </View>

            <View style={{ marginTop: 18 }}>
              <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} activeOpacity={0.9}>
                <View style={styles.saveBtnWrap}>
                  {loading ? (
                    <ActivityIndicator color='#fff' />
                  ) : (
                    <TextNexu style={styles.saveBtnText}>Salvar alterações</TextNexu>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 6 },
  backBtn: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subtitle: { color: COLORS.subtext, marginTop: 6 },
  card: {
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8
  },
  avatarBorder: { borderWidth: 3, padding: 4, borderRadius: 90 },
  avatarBig: { width: 120, height: 120, borderRadius: 60 },
  smallBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  smallBtnText: { color: '#fff', fontWeight: '700', marginLeft: 6 },
  input: { backgroundColor: '#0F0F23' },
  saveBtnWrap: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6
  },
  saveBtnText: { color: '#fff', fontWeight: '800' }
})

export default UpdatePerfilScreen

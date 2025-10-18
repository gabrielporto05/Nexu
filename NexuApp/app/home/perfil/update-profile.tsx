// src/app/home/perfil/update-profile.tsx
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'
import { useState } from 'react'
import { deleteAvatar, updateAvatar } from 'src/services/apiProfile'
import { updateUserInfo } from 'src/services/apiUser'
import { useForm, Controller } from 'react-hook-form'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { getErrorMessage } from 'src/utils/errorHandler'

const UpdateProfilePage = () => {
  const { top } = useSafeAreaInsets()
  const { user, refreshUser } = useAuth()

  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      nick: user?.nick || ''
    }
  })

  if (!user) return null

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0])
    }
  }

  const handleAvatarUpload = async () => {
    try {
      if (!selectedImage) return

      const formData = new FormData()
      const filename = selectedImage.uri.split('/').pop() || `avatar_${user.id}.jpg`
      const match = /\.(\w+)$/.exec(filename)
      const ext = match ? match[1] : 'jpg'
      const mimeType = `image/${ext}`

      if (Platform.OS === 'web') {
        const response = await fetch(selectedImage.uri)
        const blob = await response.blob()
        formData.append('avatar', new File([blob], filename, { type: mimeType }))
      } else {
        formData.append('avatar', {
          uri: selectedImage.uri,
          name: filename,
          type: mimeType
        } as any)
      }

      await updateAvatar(formData)
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao atualizar avatar') })
    }
  }

  const handleDeleteAvatar = async () => {
    await deleteAvatar()
    setSelectedImage(null)
    await refreshUser()
  }

  const onSubmit = async (data: { name: string; nick: string }) => {
    setLoading(true)
    try {
      const payload = {
        name: user.name === data.name,
        nick: data.nick
      }

      await updateUserInfo(data.name, data.nick, user.id)
      if (selectedImage) await handleAvatarUpload()
      await refreshUser()
      Toast.show({ type: 'success', text1: 'Perfil atualizado com sucesso!' })
      router.back()
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
      <ScrollView style={{ flex: 1, marginTop: top, padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name='arrow-back' size={28} color='#855CF8' />
          </TouchableOpacity>
          <TextNexu variant='headlineMedium' style={{ fontWeight: 'bold', color: '#333' }}>
            Atualizar Perfil
          </TextNexu>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <View style={{ borderWidth: 3, borderColor: '#855CF8', borderRadius: 100, padding: 4 }}>
            <Image
              source={{
                uri: selectedImage?.uri || `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}`
              }}
              style={{ width: 160, height: 160, borderRadius: 100 }}
              resizeMode='cover'
            />
          </View>

          <TouchableOpacity
            onPress={pickImage}
            style={{
              marginTop: 20,
              backgroundColor: '#855CF8',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Ionicons name='image-outline' size={20} color='#fff' />
            <TextNexu variant='titleMedium' style={{ color: '#fff' }}>
              Selecionar nova imagem
            </TextNexu>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAvatar}
            style={{
              marginTop: 12,
              backgroundColor: '#FF6B6B',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 50
            }}
          >
            <TextNexu variant='bodyMedium' style={{ color: '#fff' }}>
              Remover foto atual
            </TextNexu>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 20 }}>
          <TextNexu style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Nome</TextNexu>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <TextInputNexu
                placeholder='Seu nome'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={{ backgroundColor: '#fff' }}
              />
            )}
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <TextNexu style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Nick</TextNexu>
          <Controller
            control={control}
            name='nick'
            render={({ field: { onChange, value } }) => (
              <TextInputNexu
                placeholder='@seuNick'
                mode='outlined'
                value={value}
                onChangeText={onChange}
                style={{ backgroundColor: '#fff' }}
              />
            )}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          style={{
            backgroundColor: '#855CF8',
            paddingVertical: 14,
            borderRadius: 50,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8
          }}
        >
          {loading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <>
              <Ionicons name='save-outline' size={20} color='#fff' />
              <TextNexu variant='titleMedium' style={{ color: '#fff' }}>
                Salvar alterações
              </TextNexu>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default UpdateProfilePage

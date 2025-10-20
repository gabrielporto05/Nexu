import { View, Image, ScrollView, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { PostSchema, PostSchemaType } from 'src/schemas/postSchema'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ButtonNexu from 'src/components/ui/ButtonNexu'
import { createPost } from 'src/services/apiPosts'
import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import * as ImagePicker from 'expo-image-picker'
import Toast from 'react-native-toast-message'
import Loading from 'src/components/Loanding'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'

const CreatPostScreen = () => {
  const { user } = useAuth()
  const { top } = useSafeAreaInsets()
  const [imageUri, setImageUri] = useState<string | null>(null)

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      description: ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  const onSubmit = async (data: PostSchemaType) => {
    try {
      const formData = new FormData()
      formData.append('description', data.description)

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg'
        const match = /\.(\w+)$/.exec(filename)
        const ext = match ? match[1].toLowerCase() : 'jpg'
        const mimeType = `image/${ext}`

        let fileSize = 0

        if (Platform.OS === 'web') {
          const response = await fetch(imageUri)
          const blob = await response.blob()
          fileSize = blob.size

          if (fileSize > 5 * 1024 * 1024) {
            Toast.show({ type: 'error', text1: 'A imagem não pode ter mais de 5MB.' })
            return
          }

          formData.append('image', new File([blob], filename, { type: mimeType }))
        } else {
          const response = await fetch(imageUri)
          const blob = await response.blob()
          fileSize = blob.size

          if (fileSize > 5 * 1024 * 1024) {
            Toast.show({ type: 'error', text1: 'A imagem não pode ter mais de 5MB.' })
            return
          }

          formData.append('image', {
            uri: imageUri,
            name: filename,
            type: mimeType
          } as any)
        }
      } else {
        formData.append('image', '')
      }

      await createPost(formData)

      Toast.show({ type: 'success', text1: 'Post criado com sucesso!' })
      router.push('/home')
    } catch (err) {
      console.error('Erro ao criar post:', err)
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao criar post') })
    }
  }

  if (!user) return <Loading />

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, marginTop: top }}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Controller
            control={control}
            name='description'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputNexu
                placeholder='O que você está pensando?'
                mode='flat'
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.description}
                multiline
                numberOfLines={12}
                style={{
                  fontSize: 18,
                  textAlignVertical: 'top',
                  backgroundColor: '#fff',
                  borderBottomWidth: 0,
                  minHeight: 200
                }}
              />
            )}
          />
          {errors.description && (
            <TextNexu style={{ color: '#FF6B6B', marginTop: 4 }}>{errors.description.message}</TextNexu>
          )}
        </View>

        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 14,
              minHeight: 280,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: imageUri ? 0 : 1.5,
              borderColor: '#ccc',
              overflow: 'hidden'
            }}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: '100%',
                  height: undefined,
                  aspectRatio: 1.2
                }}
                resizeMode='cover'
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name='image-outline' size={40} color='#999' />
                <TextNexu style={{ fontSize: 16, color: '#666', marginTop: 10 }}>
                  Toque para adicionar uma imagem
                </TextNexu>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          left: 20
        }}
      >
        <ButtonNexu
          buttonColor='#855CF8'
          onPress={handleSubmit(onSubmit)}
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            elevation: 4
          }}
        >
          <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Publicar</TextNexu>
        </ButtonNexu>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CreatPostScreen

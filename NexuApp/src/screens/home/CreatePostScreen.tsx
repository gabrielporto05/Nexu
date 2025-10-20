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
      if (!imageUri) {
        Toast.show({ type: 'error', text1: 'Selecione uma imagem antes de publicar.' })
        return
      }

      const formData = new FormData()
      formData.append('description', data.description)

      const filename = imageUri.split('/').pop() || 'image.jpg'
      const match = /\.(\w+)$/.exec(filename)
      const ext = match ? match[1] : 'jpg'
      const mimeType = `image/${ext}`

      if (Platform.OS === 'web') {
        const response = await fetch(imageUri)
        const blob = await response.blob()
        formData.append('image', new File([blob], filename, { type: mimeType }))
      } else {
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: mimeType
        } as any)
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={{ flex: 1, marginTop: top, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps='handled'
      >
        <TextNexu style={{ fontSize: 28, fontWeight: 'bold', marginVertical: 20 }}>Nova publicação</TextNexu>

        <View style={{ marginBottom: 20 }}>
          <TextNexu style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>Descrição</TextNexu>
          <Controller
            control={control}
            name='description'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputNexu
                placeholder='Escreva sua descrição aqui...'
                mode='outlined'
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.description}
                numberOfLines={5}
                multiline
                style={{ backgroundColor: '#fff', paddingTop: 12 }}
              />
            )}
          />
          {errors.description && (
            <TextNexu style={{ color: '#FF6B6B', marginTop: 4 }}>{errors.description.message}</TextNexu>
          )}
        </View>

        <View style={{ marginBottom: 30 }}>
          <TextNexu style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Imagem</TextNexu>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: '#ccc9',
              borderRadius: 12,
              minHeight: 300,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: '100%',
                  aspectRatio: 1.1,
                  borderRadius: 12
                }}
                resizeMode='cover'
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name='image' size={32} />
                <TextNexu style={{ fontSize: 16, marginTop: 8 }}>Toque para selecionar uma imagem</TextNexu>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ButtonNexu buttonColor='#855CF8' onPress={handleSubmit(onSubmit)} style={{ paddingVertical: 12 }}>
          <TextNexu style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Publicar</TextNexu>
        </ButtonNexu>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CreatPostScreen

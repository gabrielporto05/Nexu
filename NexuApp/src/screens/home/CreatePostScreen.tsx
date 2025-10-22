import React, { useState } from 'react'
import {
  View,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PostSchema, PostSchemaType } from 'src/schemas/postSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'
import TextNexu from 'src/components/ui/TextNexu'
import { createPost } from 'src/services/apiPosts'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useAuth } from 'src/context/auth/AuthContext'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import Loading from 'src/components/Loanding'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'

const { width } = Dimensions.get('window')

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  accentStart: '#9B7EF8',
  accentEnd: '#7C3AED',
  text: '#FFFFFF',
  subtext: '#9CA3AF'
}

const CreatPostScreen = () => {
  const { user } = useAuth()
  const { top } = useSafeAreaInsets()
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: { description: '' }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9
      })

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri)
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao selecionar imagem' })
    }
  }

  const removeImage = () => setImageUri(null)

  const onSubmit = async (data: PostSchemaType) => {
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('description', data.description)

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg'
        const match = /\.(\w+)$/.exec(filename)
        const ext = match ? match[1].toLowerCase() : 'jpg'
        const mimeType = `image/${ext}`

        const response = await fetch(imageUri)
        const blob = await response.blob()
        const fileSize = blob.size

        if (fileSize > 5 * 1024 * 1024) {
          Toast.show({ type: 'error', text1: 'A imagem não pode ter mais de 5MB.' })
          setIsSubmitting(false)
          return
        }

        if (Platform.OS === 'web') {
          formData.append('image', new File([blob], filename, { type: mimeType }))
        } else {
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

      Toast.show({ type: 'success', text1: 'Post publicado com sucesso!' })
      router.push('/home')
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao criar post') })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return <Loading />

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={[styles.container, { paddingTop: top }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>
          <Animatable.View animation='fadeInDown' duration={600} style={styles.header}>
            <TextNexu variant='headlineLarge' style={{ color: COLORS.text, fontWeight: 'bold' }}>
              Criar publicação
            </TextNexu>
            <TextNexu style={{ color: COLORS.subtext, marginTop: 6 }}>
              Compartilhe uma ideia, foto ou pensamento com sua comunidade
            </TextNexu>
          </Animatable.View>

          <Animatable.View animation='fadeInUp' duration={700} style={[styles.card, { backgroundColor: COLORS.card }]}>
            <View style={styles.editorRow}>
              <Ionicons name='person-circle' size={36} color={COLORS.primary} />
              <TextNexu style={{ color: COLORS.text, fontWeight: '600', marginLeft: 10 }}>{user.name}</TextNexu>
            </View>

            <Controller
              control={control}
              name='description'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputNexu
                  placeholder='O que você está pensando?'
                  placeholderTextColor={COLORS.subtext}
                  mode='flat'
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={!!errors.description}
                  multiline
                  numberOfLines={8}
                  style={styles.textArea}
                />
              )}
            />
            {errors.description && <TextNexu style={styles.errorText}>{errors.description.message}</TextNexu>}

            <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.imagePicker}>
              {!imageUri ? (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name='image-outline' size={36} color={COLORS.subtext} />
                  <TextNexu style={{ color: COLORS.subtext, marginTop: 8 }}>Toque para adicionar imagem</TextNexu>
                </View>
              ) : (
                <View>
                  <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode='cover' />
                  <TouchableOpacity style={styles.removeBtn} onPress={removeImage} activeOpacity={0.8}>
                    <Ionicons name='close' size={16} color='#FFF' />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </Animatable.View>

          <View style={styles.footerSpace} />
        </ScrollView>

        <View style={styles.publishWrap}>
          <Animatable.View animation='pulse' iterationCount='infinite' duration={3000}>
            <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.9}>
              <LinearGradient
                colors={['#9B7EF8', '#855CF8', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 18,
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
                        <Ionicons name='sync' size={22} color='#FFF' />
                      </Animatable.View>
                      <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Publicando...</TextNexu>
                    </>
                  ) : (
                    <>
                      <Ionicons name='log-in' size={22} color='#FFF' />
                      <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Publicar</TextNexu>
                    </>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 120 },
  header: { alignItems: 'flex-start', marginBottom: 12 },
  card: {
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8
  },
  editorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  textArea: {
    minHeight: 140,
    borderRadius: 12,
    backgroundColor: '#0F0F23',
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12
  },
  errorText: { color: '#FF6B6B', marginBottom: 8 },
  imagePicker: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A44'
  },
  imagePlaceholder: {
    height: 180,
    width: '100%',
    backgroundColor: '#141426',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewImage: {
    width: width - 48,
    height: 300,
    borderRadius: 12
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 10
  },
  publishWrap: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    right: 20
  },
  footerSpace: { height: 28 }
})

export default CreatPostScreen

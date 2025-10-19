import { ScrollView, View, Image, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useCallback, useEffect, useState } from 'react'
import { like, unlike } from 'src/services/apiLikes'
import { getAllPosts } from 'src/services/apiPosts'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/AuthContext'
import { ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import Loading from 'src/components/Loanding'
import { PostType } from 'src/utils/types'
import { Modal } from 'react-native'

type FeedPageProps = {
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const FeedPage = ({ handleScroll }: FeedPageProps) => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  const [posts, setPosts] = useState<PostType[]>([])
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('date')
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})

  const [isRefreshing, setIsRefreshing] = useState(false)

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const fetchPosts = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const { data } = await getAllPosts()
      setPosts(data)
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao buscar posts')
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

  if (!user || isRefreshing) return <Loading />

  const handleLikeAndUnlike = async (post: PostType) => {
    try {
      if (post.likedByUser) {
        await unlike(post.id)
        post.likedByUser = false
        post.likes -= 1
      } else {
        await like(post.id)
        post.likedByUser = true
        post.likes += 1
      }
      setPosts([...posts])
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao curtir/descurtir post' })
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, marginTop: top }}
      keyboardShouldPersistTaps='handled'
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold' }}>
            Home
          </TextNexu>
          {isRefreshing ? (
            <ActivityIndicator size={24} color='#855CF8' />
          ) : (
            <Ionicons
              onPress={() => {
                fetchPosts()
                setSortBy('date')
              }}
              name='refresh-outline'
              size={28}
              color='#855CF8'
            />
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
          <TextNexu
            style={{ color: sortBy === 'date' ? '#855CF8' : '#999' }}
            onPress={() => setSortBy('date')}
            variant='bodyLarge'
          >
            Mais recentes
          </TextNexu>
          <TextNexu
            style={{ color: sortBy === 'likes' ? '#855CF8' : '#999' }}
            onPress={() => setSortBy('likes')}
            variant='bodyLarge'
          >
            Mais likes
          </TextNexu>
        </View>
      </View>

      {!posts || posts.length === 0 ? (
        <View style={{ height: '100%', padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
          <Ionicons name='chatbubble-ellipses-outline' size={48} style={{ marginBottom: 12 }} />
          <TextNexu variant='titleLarge' style={{ textAlign: 'center' }}>
            Ainda não há nenhum post publicado.
          </TextNexu>
          <TextNexu variant='bodyLarge' style={{ textAlign: 'center', marginTop: 4 }}>
            Toque no botão de atualizar para tentar novamente.
          </TextNexu>
        </View>
      ) : (
        [...posts]
          .sort((a, b) => {
            if (sortBy === 'likes') return b.likes - a.likes
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          .map(post => {
            return (
              <View
                key={post.id}
                style={{
                  backgroundColor: '#eeeeee',
                  borderBottomWidth: 1,
                  borderBottomColor: '#855CF8'
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                    paddingHorizontal: 12,
                    paddingTop: 12
                  }}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${post.user.avatar}` }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                    resizeMode='cover'
                  />
                  <View>
                    <TextNexu variant='titleMedium' style={{ fontWeight: 'bold' }}>
                      {post.user.name}
                    </TextNexu>
                    <TextNexu variant='bodySmall' style={{ color: '#777' }}>
                      @{post.user.nick}
                    </TextNexu>
                  </View>
                </View>

                {post.image && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      setSelectedImage(`${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}`)
                    }
                  >
                    <Image
                      source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}` }}
                      style={{
                        width: '100%',
                        aspectRatio: 1.1,
                        marginBottom: 12
                      }}
                      resizeMode='cover'
                    />
                  </TouchableOpacity>
                )}

                <View style={{ paddingHorizontal: 12, marginBottom: 12 }}>
                  <TextNexu variant='titleLarge' style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {post.title}
                  </TextNexu>
                  <TextNexu variant='bodyLarge' style={{ color: '#333', marginBottom: 8 }}>
                    {expandedPosts[post.id] || post.description.length <= 200
                      ? post.description
                      : `${post.description.slice(0, 130)}...`}
                  </TextNexu>
                  {post.description.length > 130 && (
                    <TextNexu
                      variant='bodyMedium'
                      style={{ color: '#855CF8', marginBottom: 8 }}
                      onPress={() => toggleExpand(post.id)}
                    >
                      {expandedPosts[post.id] ? 'ver menos' : 'ver mais'}
                    </TextNexu>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <TouchableOpacity onPress={() => handleLikeAndUnlike(post)} activeOpacity={0.7}>
                        <Ionicons
                          name={post.likedByUser ? 'heart' : 'heart-outline'}
                          size={24}
                          color={post.likedByUser ? '#855CF8' : '#999'}
                        />
                      </TouchableOpacity>
                      <TextNexu variant='bodyLarge' style={{ color: '#855CF8' }}>
                        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                      </TextNexu>
                    </View>
                    <TextNexu variant='bodySmall' style={{ color: '#777' }}>
                      {new Date(post.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TextNexu>
                  </View>
                </View>
              </View>
            )
          })
      )}

      <Modal visible={!!selectedImage} transparent animationType='fade' onRequestClose={() => setSelectedImage(null)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: 40,
              right: 30,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: 8,
              borderRadius: 20
            }}
            activeOpacity={0.7}
          >
            <Ionicons name='close' size={28} color='#fff' />
          </TouchableOpacity>

          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          )}
        </View>
      </Modal>
    </ScrollView>
  )
}

export default FeedPage

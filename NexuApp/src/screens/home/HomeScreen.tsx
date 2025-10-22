import { ScrollView, View, Image, TouchableOpacity, RefreshControl } from 'react-native'
import ImageExpandModal from 'src/components/modals/ImageExpandModal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useCallback, useEffect, useState } from 'react'
import { like, unlike } from 'src/services/apiLikes'
import { getAllPosts } from 'src/services/apiPosts'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/AuthContext'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import Loading from 'src/components/Loanding'
import { PostType } from 'src/utils/types'

const HomeScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  const [posts, setPosts] = useState<PostType[]>([])
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('date')
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchPosts()
    setIsRefreshing(false)
  }

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
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#855CF8']} />}
    >
      <View style={{ padding: 20 }}>
        <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold' }}>
          Nexu
        </TextNexu>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
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
            Ainda não há nenhum post publicado por vc ou por suas conexões.
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
                  <TextNexu
                    variant='bodyLarge'
                    style={{ color: '#333', marginBottom: 8 }}
                    numberOfLines={expandedPosts[post.id] ? undefined : post.image ? 3 : 6}
                    ellipsizeMode='tail'
                    onTextLayout={e => {
                      const maxLines = post.image ? 3 : 6
                      const lines = e.nativeEvent.lines.length

                      if (lines > maxLines && !expandedPosts[post.id]) {
                        setExpandedPosts(prev => ({ ...prev, [post.id]: false }))
                      }
                    }}
                  >
                    {post.description}
                  </TextNexu>

                  {(post.description.split('\n').length > (post.image ? 3 : 6) || post.description.length > 180) && (
                    <TouchableOpacity
                      onPress={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    >
                      <TextNexu style={{ color: '#855CF8', fontWeight: 'bold', marginBottom: 8 }}>
                        {expandedPosts[post.id] ? 'ver menos' : 'ver mais'}
                      </TextNexu>
                    </TouchableOpacity>
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

      <ImageExpandModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </ScrollView>
  )
}

export default HomeScreen

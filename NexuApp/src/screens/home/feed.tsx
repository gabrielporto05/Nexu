import { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from 'src/context/AuthContext'
import TextNexu from 'src/components/ui/TextNexu'
import { PostType } from 'src/utils/types'
import { Ionicons } from '@expo/vector-icons'
import { getAllPosts } from 'src/services/apiPosts'
import { ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'

type FeedPageProps = {
  setShowTabBar: (value: boolean) => void
}

const FeedPage = ({ setShowTabBar }: FeedPageProps) => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  const [posts, setPosts] = useState<PostType[]>([])
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('date')
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})

  const [isRefreshing, setIsRefreshing] = useState(false)

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const lastScrollY = useRef(0)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y
    const deltaY = currentY - lastScrollY.current

    if (Math.abs(deltaY) < 2) return

    if (deltaY > 0) {
      setShowTabBar(false)
    } else {
      setShowTabBar(true)
    }

    lastScrollY.current = currentY
  }

  const fetchPosts = async () => {
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
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (!user) return null

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
            <Ionicons onPress={fetchPosts} name='refresh-outline' size={28} color='#855CF8' />
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

      {posts.length === 0 ? (
        <TextNexu variant='bodyLarge' style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
          Nenhum post disponível no momento.
        </TextNexu>
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
                  backgroundColor: '#f5f5f5',
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

                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}` }}
                  style={{ width: '100%', height: 200, marginBottom: 12 }}
                  resizeMode='cover'
                />
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
                      <Ionicons name='heart-outline' size={24} color='#855CF8' />
                      <TextNexu variant='bodyLarge' style={{ color: '#855CF8' }}>
                        {post.likes} likes
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
    </ScrollView>
  )
}

export default FeedPage

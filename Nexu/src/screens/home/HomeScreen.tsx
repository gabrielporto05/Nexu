import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, RefreshControl, StyleSheet, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getErrorMessage } from 'src/utils/errorHandler'
import { like, unlike } from 'src/services/apiLikes'
import { getAllPosts } from 'src/services/apiPosts'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/auth/AuthContext'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import Loading from 'src/components/Loanding'
import { PostType } from 'src/utils/types'
import ImageExpandModal from 'src/components/modals/ImageExpandModal'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'

const { width } = Dimensions.get('window')

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF'
}

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
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao buscar posts') })
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchPosts()
    setIsRefreshing(false)
  }

  if (!user) return <Loading />

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
      setPosts(prev => [...prev])
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao curtir/descurtir post' })
    }
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={{ flex: 1, paddingTop: top }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps='handled'
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <View style={styles.headerContainer}>
          <Animatable.View animation='zoomIn' duration={600}>
            <TextNexu variant='headlineLarge' style={{ color: COLORS.text, fontWeight: 'bold' }}>
              Nexu
            </TextNexu>
          </Animatable.View>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <TextNexu
              style={{ color: sortBy === 'date' ? COLORS.primary : COLORS.subtext, marginRight: 12 }}
              onPress={() => setSortBy('date')}
              variant='bodyLarge'
            >
              Mais recentes
            </TextNexu>
            <TextNexu
              style={{ color: sortBy === 'likes' ? COLORS.primary : COLORS.subtext }}
              onPress={() => setSortBy('likes')}
              variant='bodyLarge'
            >
              Mais likes
            </TextNexu>
          </View>
        </View>

        {!posts || posts.length === 0 ? (
          <View style={{ height: 300, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons
              name='chatbubble-ellipses-outline'
              size={64}
              color={COLORS.subtext}
              style={{ marginBottom: 12 }}
            />
            <TextNexu variant='titleLarge' style={{ textAlign: 'center', color: COLORS.text }}>
              Ainda não há nenhum post publicado por você ou por suas conexões.
            </TextNexu>
            <TextNexu variant='bodyLarge' style={{ textAlign: 'center', marginTop: 8, color: COLORS.subtext }}>
              Atualize a tela ou publique algo novo.
            </TextNexu>
          </View>
        ) : (
          [...posts]
            .sort((a, b) => {
              if (sortBy === 'likes') return b.likes - a.likes
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })
            .map((post, idx) => {
              const isExpanded = !!expandedPosts[post.id]
              const maxLines = post.image ? 3 : 6
              return (
                <Animatable.View
                  key={post.id}
                  animation='fadeInUp'
                  duration={500}
                  delay={idx * 60}
                  style={[
                    styles.card,
                    {
                      backgroundColor: COLORS.card,
                      borderColor: COLORS.primary + '33'
                    }
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingTop: 12
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${post.user.avatar}` }}
                        style={[styles.avatar, { borderColor: COLORS.primary }]}
                        resizeMode='cover'
                      />
                      <View style={{ marginLeft: 10 }}>
                        <TextNexu variant='titleMedium' style={{ fontWeight: '700', color: COLORS.text }}>
                          {post.user.name}
                        </TextNexu>
                        <TextNexu variant='bodySmall' style={{ color: COLORS.subtext }}>
                          @{post.user.nick}
                        </TextNexu>
                      </View>
                    </View>

                    <TextNexu variant='bodySmall' style={{ color: COLORS.subtext }}>
                      {new Date(post.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TextNexu>
                  </View>

                  {post.image && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() =>
                        setSelectedImage(`${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}`)
                      }
                      style={{ marginTop: 12 }}
                    >
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}` }}
                        style={styles.postImage}
                        resizeMode='cover'
                      />
                    </TouchableOpacity>
                  )}

                  <View style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
                    <TextNexu
                      variant='bodyLarge'
                      style={{ color: COLORS.text, lineHeight: 20, marginBottom: 6 }}
                      numberOfLines={isExpanded ? undefined : maxLines}
                      ellipsizeMode='tail'
                    >
                      {post.description}
                    </TextNexu>

                    {(post.description.split('\n').length > maxLines || post.description.length > maxLines * 80) && (
                      <TouchableOpacity
                        onPress={() => setExpandedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      >
                        <TextNexu style={{ color: COLORS.primary, fontWeight: '700' }}>
                          {isExpanded ? 'ver menos' : 'ver mais'}
                        </TextNexu>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => handleLikeAndUnlike(post)}
                        activeOpacity={0.8}
                        style={styles.likeButton}
                      >
                        <Animatable.View
                          animation={post.likedByUser ? 'bounceIn' : undefined}
                          duration={350}
                          iterationCount={1}
                          style={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Ionicons
                            name={post.likedByUser ? 'heart' : 'heart-outline'}
                            size={22}
                            color={post.likedByUser ? COLORS.primary : COLORS.subtext}
                          />
                        </Animatable.View>
                      </TouchableOpacity>
                      <TextNexu variant='bodyLarge' style={{ color: COLORS.primary, marginLeft: 8 }}>
                        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                      </TextNexu>
                    </View>
                  </View>
                </Animatable.View>
              )
            })
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      <ImageExpandModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  card: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  postImage: { width: '100%', height: (width - 64) * 0.9, alignSelf: 'center' },
  cardFooter: {
    paddingHorizontal: 12,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  likeButton: {
    padding: 6,
    borderRadius: 8
  }
})

export default HomeScreen

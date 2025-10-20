import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getAllPostsUserById } from 'src/services/apiPosts'
import { router, useLocalSearchParams } from 'expo-router'
import { getErrorMessage } from 'src/utils/errorHandler'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { PostType, UserType } from 'src/utils/types'
import { getUserById } from 'src/services/apiUser'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/AuthContext'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import Loading from 'src/components/Loanding'
import { useEffect, useState } from 'react'
import ImageExpandModal from 'src/components/modals/ImageExpandModal'

const PerfilScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()
  const { id } = useLocalSearchParams()

  const targetUserId = id ? Number(id) : user?.id
  const isViewingOtherProfile = id && Number(id) !== user?.id

  const [profileUser, setProfileUser] = useState<UserType | null>(null)
  const [sortBy, setSortBy] = useState<'likes' | 'date'>('date')
  const [posts, setPosts] = useState<PostType[]>([])
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const fetchProfile = async () => {
    if (!targetUserId) return

    try {
      const [userData, postsData] = await Promise.all([getUserById(targetUserId), getAllPostsUserById(targetUserId)])

      setProfileUser(userData.data)
      setPosts(postsData.data)
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao carregar perfil')
      })
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [targetUserId])

  if (!profileUser || !user) return <Loading />

  return (
    <ScrollView style={{ flex: 1, marginTop: top }} keyboardShouldPersistTaps='handled' scrollEventThrottle={16}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {isViewingOtherProfile && (
              <Ionicons name='arrow-back' size={24} color='black' onPress={() => router.back()} />
            )}
            <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold' }}>
              {isViewingOtherProfile ? 'Perfil' : 'Meu Perfil'}
            </TextNexu>
          </View>

          {!isViewingOtherProfile && (
            <Ionicons
              onPress={() => router.push('/home/perfil/config-perfil')}
              name='settings-outline'
              size={30}
              color='black'
            />
          )}
        </View>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${profileUser.avatar}` }}
          style={{ width: 130, height: 130, borderRadius: 100, alignSelf: 'center' }}
          resizeMode='cover'
        />
        <View style={{ alignItems: 'center', marginTop: 20, gap: 5 }}>
          <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
            {profileUser.name}
          </TextNexu>
          <TextNexu variant='titleLarge'>@{profileUser.nick}</TextNexu>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              {profileUser.followersCount}
            </TextNexu>
            <TextNexu variant='bodyLarge'>Seguidores</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              {profileUser.followingCount}
            </TextNexu>
            <TextNexu variant='bodyLarge'>Seguindo</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              {profileUser.postsCount}
            </TextNexu>
            <TextNexu variant='bodyLarge'>Posts</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              {profileUser.likesCount}
            </TextNexu>
            <TextNexu variant='bodyLarge'>Likes</TextNexu>
          </View>
        </View>
      </View>
      <View>
        <TextNexu variant='titleLarge' style={{ fontWeight: 'bold', marginLeft: 20 }}>
          {isViewingOtherProfile ? 'Posts' : 'Meus posts'}
        </TextNexu>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: 20 }}>
          <TextNexu
            style={{
              color: sortBy === 'date' ? '#855CF8' : '#999'
            }}
            onPress={() => setSortBy('date')}
            variant='bodyLarge'
          >
            Mais recentes
          </TextNexu>
          <TextNexu
            style={{
              color: sortBy === 'likes' ? '#855CF8' : '#999'
            }}
            onPress={() => setSortBy('likes')}
            variant='bodyLarge'
          >
            Mais likes
          </TextNexu>
        </View>

        {!posts || posts.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <Ionicons name='chatbubble-ellipses-outline' size={48} style={{ marginBottom: 12 }} />
            <TextNexu variant='titleLarge' style={{ textAlign: 'center' }}>
              {isViewingOtherProfile
                ? 'Este usuário ainda não fez nenhuma publicação.'
                : 'Você ainda não fez nenhuma publicação.'}
            </TextNexu>
          </View>
        ) : (
          [...posts]
            .sort((a, b) => {
              if (sortBy === 'likes') return b.likes - a.likes
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })
            .map(post => {
              const isExpanded = expandedPosts[post.id] === true
              const isLong = post.description.length > 130

              return (
                <View
                  key={post.id}
                  style={{ backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#855CF8' }}
                >
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
                  <View style={{ padding: 12 }}>
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
                      <TextNexu variant='bodyLarge' style={{ color: '#855CF8' }}>
                        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                      </TextNexu>
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
      </View>

      <ImageExpandModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </ScrollView>
  )
}

export default PerfilScreen

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { deletePostById, getAllPostsUserById } from 'src/services/apiPosts'
import { router, useLocalSearchParams } from 'expo-router'
import { getErrorMessage } from 'src/utils/errorHandler'
import { Image, ScrollView, TouchableOpacity, View, Modal } from 'react-native'
import { PostType, UserType } from 'src/utils/types'
import { getUserById } from 'src/services/apiUser'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/AuthContext'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import Loading from 'src/components/Loanding'
import { useEffect, useState } from 'react'
import ImageExpandModal from 'src/components/modals/ImageExpandModal'
import { followUser, unfollowUser } from 'src/services/apiFollower'

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
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null)

  const handleEditPost = (post: PostType) => {
    setVisibleMenu(null)
    router.push(`/home/edit-post/${post.id}`)
  }

  const handleDeletePost = async (post: number) => {
    setVisibleMenu(null)
    try {
      await deletePostById(post)
      setPosts(prev => prev.filter(p => p.id !== post))
      Toast.show({ type: 'success', text1: 'Post excluído com sucesso!' })
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao excluir post') })
    }
  }

  const fetchUserProfile = async () => {
    if (!targetUserId) return

    try {
      const userData = await getUserById(targetUserId)
      setProfileUser(userData.data)
    } catch (err) {
      console.error('Erro ao buscar usuário:', err)
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao carregar usuário')
      })
    }
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

  const handleFollowOrUnfollowUser = async () => {
    if (!profileUser) return

    try {
      profileUser.following ? await unfollowUser(profileUser.id) : await followUser(profileUser.id)
      Toast.show({
        type: 'success',
        text1: `${profileUser.following ? 'Deixou de seguir' : `Seguindo ${profileUser.name}`}`
      })
      fetchUserProfile()
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: getErrorMessage(err, 'Erro ao atualizar status de seguir')
      })
    }
  }

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
        {isViewingOtherProfile && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              paddingHorizontal: 20,
              gap: 12
            }}
          >
            <TouchableOpacity
              onPress={handleFollowOrUnfollowUser}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: profileUser.following ? '#F3F4F6' : '#855CF8',
                gap: 8,
                shadowColor: profileUser.following ? 'transparent' : '#855CF8',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: profileUser.following ? 0 : 5
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={profileUser.following ? 'checkmark-circle' : 'person-add'}
                size={20}
                color={profileUser.following ? '#6B7280' : '#FFFFFF'}
              />
              <TextNexu
                variant='bodyMedium'
                style={{
                  fontWeight: '600',
                  color: profileUser.following ? '#6B7280' : '#FFFFFF'
                }}
              >
                {profileUser.following ? 'Seguindo' : 'Seguir'}
              </TextNexu>
            </TouchableOpacity>

            {profileUser.following && (
              <TouchableOpacity
                onPress={() => router.push(`/home/chat/${profileUser.id}`)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: '#F3F4F6',
                  borderWidth: 1,
                  borderColor: '#E5E7EB'
                }}
                activeOpacity={0.8}
              >
                <Ionicons name='chatbubble-ellipses' size={20} color='#855CF8' />
              </TouchableOpacity>
            )}
          </View>
        )}
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
              return (
                <View
                  key={post.id}
                  style={{ backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#855CF8' }}
                >
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}
                  >
                    <TextNexu variant='titleMedium' style={{ fontWeight: 'bold', color: '#333' }}>
                      @{profileUser.nick}
                    </TextNexu>
                    {!isViewingOtherProfile && (
                      <TouchableOpacity
                        onPress={() => setVisibleMenu(visibleMenu === post.id ? null : post.id)}
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 10,
                          padding: 4
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name='ellipsis-vertical' size={20} color='#555' />
                      </TouchableOpacity>
                    )}

                    {visibleMenu === post.id && !isViewingOtherProfile && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -80,
                          right: 12,
                          backgroundColor: 'white',
                          borderRadius: 8,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          zIndex: 20,
                          minWidth: 120
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleEditPost(post)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name='create-outline' size={18} color='#555' style={{ marginRight: 8 }} />
                          <TextNexu variant='bodyMedium'>Editar</TextNexu>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeletePost(post.id)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 12
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name='trash-outline' size={18} color='#FF6B6B' style={{ marginRight: 8 }} />
                          <TextNexu variant='bodyMedium' style={{ color: '#FF6B6B' }}>
                            Excluir
                          </TextNexu>
                        </TouchableOpacity>
                      </View>
                    )}
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

                  <View style={{ padding: 12 }}>
                    <TextNexu
                      variant='bodyLarge'
                      style={{ color: '#333', marginBottom: 8 }}
                      numberOfLines={expandedPosts[post.id] ? undefined : post.image ? 3 : 6}
                      ellipsizeMode='tail'
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

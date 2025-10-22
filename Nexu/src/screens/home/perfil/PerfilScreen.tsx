import React, { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Image, TouchableOpacity, RefreshControl, StyleSheet, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import { LinearGradient } from 'expo-linear-gradient'

import { getErrorMessage } from 'src/utils/errorHandler'
import TextNexu from 'src/components/ui/TextNexu'
import Loading from 'src/components/Loanding'
import ImageExpandModal from 'src/components/modals/ImageExpandModal'

import { useAuth } from 'src/context/auth/AuthContext'
import { getUserById } from 'src/services/apiUser'
import { getAllPostsUserById, deletePostById } from 'src/services/apiPosts'
import { followUser, unfollowUser } from 'src/services/apiFollower'
import Toast from 'react-native-toast-message'
import { PostType, UserType } from 'src/utils/types'

const { width } = Dimensions.get('window')

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF'
}

const PerfilScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()
  const { id } = useLocalSearchParams()

  const targetUserId = id ? Number(id) : user?.id
  const isViewingOtherProfile = id && Number(id) !== user?.id

  const [profileUser, setProfileUser] = useState<UserType | null>(null)
  const [posts, setPosts] = useState<PostType[]>([])
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return
    try {
      const [userData, postsData] = await Promise.all([getUserById(targetUserId), getAllPostsUserById(targetUserId)])
      setProfileUser(userData.data)
      setPosts(postsData.data)
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao carregar perfil') })
    }
  }, [targetUserId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchProfile()
    setIsRefreshing(false)
  }

  const handleEditPost = (post: PostType) => {
    setVisibleMenu(null)
    router.push(`/home/edit-post/${post.id}`)
  }

  const handleDeletePost = async (postId: number) => {
    setVisibleMenu(null)
    try {
      await deletePostById(postId)
      setPosts(prev => prev.filter(p => p.id !== postId))
      Toast.show({ type: 'success', text1: 'Post excluído com sucesso!' })
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao excluir post') })
    }
  }

  const handleFollowToggle = async () => {
    if (!profileUser || !user) return
    try {
      if (profileUser.following) {
        await unfollowUser(profileUser.id)
        Toast.show({ type: 'success', text1: `Deixou de seguir ${profileUser.name}` })
      } else {
        await followUser(profileUser.id)
        Toast.show({ type: 'success', text1: `Agora você segue ${profileUser.name}` })
      }
      const { data } = await getUserById(profileUser.id)
      setProfileUser(data)
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao atualizar seguimento') })
    }
  }

  if (!profileUser || !user) return <Loading />

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={{ flex: 1, paddingTop: top }}>
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps='handled'
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Animatable.View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            animation='zoomIn'
            duration={600}
          >
            {isViewingOtherProfile && (
              <Ionicons name='arrow-back-outline' size={32} color={COLORS.text} onPress={() => router.back()} />
            )}
            <TextNexu variant='headlineLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
              {isViewingOtherProfile ? 'Perfil' : 'Meu Perfil'}
            </TextNexu>
          </Animatable.View>
          {!isViewingOtherProfile && (
            <TouchableOpacity onPress={() => router.push('/home/perfil/config-perfil')} style={styles.headerAction}>
              <Ionicons name='settings-outline' size={32} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${profileUser.avatar}` }}
            style={styles.avatarLarge}
            resizeMode='cover'
          />
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
              {profileUser.name}
            </TextNexu>
            <TextNexu variant='bodyLarge' style={{ color: COLORS.subtext }}>
              @{profileUser.nick}
            </TextNexu>
          </View>

          {isViewingOtherProfile && (
            <View style={styles.followRow}>
              <TouchableOpacity
                onPress={handleFollowToggle}
                style={[
                  styles.followBtn,
                  {
                    backgroundColor: profileUser.following ? '#F3F4F6' : COLORS.primary,
                    shadowColor: profileUser.following ? 'transparent' : COLORS.primary
                  }
                ]}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={profileUser.following ? 'checkmark-circle' : 'person-add'}
                  size={18}
                  color={profileUser.following ? '#6B7280' : '#fff'}
                  style={{ marginRight: 8 }}
                />
                <TextNexu style={{ color: profileUser.following ? '#6B7280' : '#fff', fontWeight: '700' }}>
                  {profileUser.following ? 'Seguindo' : 'Seguir'}
                </TextNexu>
              </TouchableOpacity>

              {profileUser.following && (
                <TouchableOpacity
                  onPress={() => router.push(`/home/chat/${profileUser.id}`)}
                  style={styles.messageBtn}
                  activeOpacity={0.85}
                >
                  <Ionicons name='chatbubble-ellipses' size={18} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
                {profileUser.followersCount}
              </TextNexu>
              <TextNexu style={{ color: COLORS.subtext }}>Seguidores</TextNexu>
            </View>
            <View style={styles.stat}>
              <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
                {profileUser.followingCount}
              </TextNexu>
              <TextNexu style={{ color: COLORS.subtext }}>Seguindo</TextNexu>
            </View>
            <View style={styles.stat}>
              <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
                {profileUser.postsCount}
              </TextNexu>
              <TextNexu style={{ color: COLORS.subtext }}>Posts</TextNexu>
            </View>
            <View style={styles.stat}>
              <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800' }}>
                {profileUser.likesCount}
              </TextNexu>
              <TextNexu style={{ color: COLORS.subtext }}>Likes</TextNexu>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
          <TextNexu variant='titleLarge' style={{ color: COLORS.text, fontWeight: '800', marginBottom: 8 }}>
            {isViewingOtherProfile ? 'Posts' : 'Meus posts'}
          </TextNexu>
        </View>

        {!posts || posts.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <Ionicons
              name='chatbubble-ellipses-outline'
              size={56}
              color={COLORS.subtext}
              style={{ marginBottom: 12 }}
            />
            <TextNexu variant='titleLarge' style={{ textAlign: 'center' }}>
              {isViewingOtherProfile
                ? 'Este usuário ainda não fez nenhuma publicação.'
                : 'Você ainda não fez nenhuma publicação.'}
            </TextNexu>
          </View>
        ) : (
          [...posts]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((post, idx) => {
              const isExpanded = !!expandedPosts[post.id]
              const maxLines = post.image ? 3 : 6

              return (
                <Animatable.View
                  key={post.id}
                  animation='fadeInUp'
                  delay={idx * 40}
                  style={[styles.postCard, { backgroundColor: COLORS.card, borderColor: COLORS.primary + '22' }]}
                >
                  <View style={styles.postHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${profileUser.avatar}` }}
                        style={styles.avatarSmall}
                        resizeMode='cover'
                      />
                      <View style={{ marginLeft: 10 }}>
                        <TextNexu variant='titleMedium' style={{ color: COLORS.text, fontWeight: '700' }}>
                          {profileUser.name}
                        </TextNexu>
                        <TextNexu variant='bodySmall' style={{ color: COLORS.subtext }}>
                          @{profileUser.nick}
                        </TextNexu>
                      </View>
                    </View>

                    {!isViewingOtherProfile && (
                      <TouchableOpacity
                        onPress={() => setVisibleMenu(visibleMenu === post.id ? null : post.id)}
                        style={styles.menuToggle}
                        activeOpacity={0.8}
                      >
                        <Ionicons name='ellipsis-vertical' size={20} color={COLORS.subtext} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {visibleMenu === post.id && !isViewingOtherProfile && (
                    <View style={styles.menuBox}>
                      <TouchableOpacity onPress={() => handleDeletePost(post.id)} style={styles.menuItem}>
                        <Ionicons name='trash-outline' size={18} color='#FF6B6B' style={{ marginRight: 8 }} />
                        <TextNexu style={{ color: '#FF6B6B' }}>Excluir</TextNexu>
                      </TouchableOpacity>
                    </View>
                  )}

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

                  <View style={{ paddingVertical: 12 }}>
                    <TextNexu
                      variant='bodyLarge'
                      style={{ color: COLORS.text, lineHeight: 20, marginBottom: 8 }}
                      numberOfLines={isExpanded ? undefined : maxLines}
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

                    <View style={styles.postFooter}>
                      <TextNexu style={{ color: COLORS.primary }}>
                        {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                      </TextNexu>
                      <TextNexu variant='bodySmall' style={{ color: COLORS.subtext }}>
                        {new Date(post.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TextNexu>
                    </View>
                  </View>
                </Animatable.View>
              )
            })
        )}
      </ScrollView>

      <ImageExpandModal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  headerAction: { padding: 8 },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12
  },
  avatarLarge: {
    width: 130,
    height: 130,
    borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  followRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
    gap: 12
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 6
  },
  messageBtn: {
    marginLeft: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  stat: { alignItems: 'center' },
  emptyState: { padding: 20, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  postCard: {
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarSmall: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: COLORS.primary },
  menuToggle: { padding: 6, marginLeft: 8 },
  menuBox: {
    position: 'absolute',
    top: 50,
    right: 28,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    zIndex: 40,
    borderWidth: 1,
    borderColor: COLORS.primary + '22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6 },
  postImage: { width: width - 64, height: (width - 64) * 0.9, borderRadius: 12, alignSelf: 'center' },
  postFooter: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
})

export default PerfilScreen

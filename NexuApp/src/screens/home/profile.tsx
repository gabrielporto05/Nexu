import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image, ScrollView, View } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { useAuth } from 'src/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { PostType } from 'src/utils/types'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { getAllPostsUserById } from 'src/services/apiPosts'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'

const ProfilePage = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  if (!user) return null

  const [sortBy, setSortBy] = useState<'likes' | 'date'>('date')
  const [posts, setPosts] = useState<PostType[]>([])

  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({})

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getAllPostsUserById(user.id)
        setPosts(data)
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: getErrorMessage(err, 'Erro ao buscar posts')
        })
      }
    }

    fetchPosts()
  }, [])

  return (
    <ScrollView style={{ flex: 1, marginTop: top }}>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <TextNexu variant='headlineLarge' style={{ fontWeight: 'bold' }}>
            Perfil
          </TextNexu>
          <Ionicons
            onPress={() => router.push('/home/perfil/config-perfil')}
            name='settings-outline'
            size={30}
            color='black'
          />
        </View>
        <Image
          source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
          style={{ width: 130, height: 130, borderRadius: 100, alignSelf: 'center' }}
          resizeMode='cover'
        />
        <View style={{ alignItems: 'center', marginTop: 20, gap: 5 }}>
          <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
            {user.name}
          </TextNexu>
          <TextNexu variant='titleLarge'>@{user.nick}</TextNexu>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }}>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              12.938
            </TextNexu>
            <TextNexu variant='bodyLarge'>Seguidores</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              875
            </TextNexu>
            <TextNexu variant='bodyLarge'>Seguindo</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              2
            </TextNexu>
            <TextNexu variant='bodyLarge'>Posts</TextNexu>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TextNexu variant='titleLarge' style={{ fontWeight: 'bold' }}>
              87.124
            </TextNexu>
            <TextNexu variant='bodyLarge'>Likes</TextNexu>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 40 }}>
        <TextNexu variant='titleLarge' style={{ fontWeight: 'bold', marginLeft: 20 }}>
          Meus Posts
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

        {[...posts]
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
                <Image
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/images_posts/${post.image}` }}
                  style={{ width: '100%', height: 200, marginBottom: 12 }}
                  resizeMode='cover'
                />
                <View style={{ padding: 12 }}>
                  <TextNexu variant='titleLarge' style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {post.title}
                  </TextNexu>
                  <TextNexu variant='bodyLarge' style={{ color: '#333', marginBottom: 8 }}>
                    {isExpanded || !isLong ? post.description : `${post.description.slice(0, 130)}...`}
                  </TextNexu>
                  {isLong && (
                    <TextNexu
                      variant='bodyMedium'
                      style={{ color: '#855CF8', marginBottom: 8 }}
                      onPress={() => toggleExpand(post.id)}
                    >
                      {isExpanded ? 'ver menos' : 'ver mais'}
                    </TextNexu>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextNexu variant='bodyLarge' style={{ color: '#855CF8' }}>
                      {post.likes} likes
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
          })}
      </View>
    </ScrollView>
  )
}

export default ProfilePage

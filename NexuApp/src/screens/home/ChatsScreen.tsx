import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getConnections } from 'src/services/apiFollower'
import { getErrorMessage } from 'src/utils/errorHandler'
import TextNexu from 'src/components/ui/TextNexu'
import Toast from 'react-native-toast-message'
import { UserType } from 'src/utils/types'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from 'src/context/auth/AuthContext'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF'
}

const ChatsScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [connections, setConnections] = useState<UserType[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchConnections = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data } = await getConnections(user.id)
      setConnections(Array.isArray(data) ? data : [])
    } catch (err) {
      Toast.show({ type: 'error', text1: getErrorMessage(err, 'Erro ao buscar conexões') })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchConnections()
    setIsRefreshing(false)
  }

  const handleOpenChat = (connectionId: number) => {
    router.push(`/home/chat/${connectionId}`)
  }

  const filtered = connections.filter(c => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.nick.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    )
  })

  if (!user) return null

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={{ flex: 1, paddingTop: top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps='handled'
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <Animatable.View animation='fadeInDown' duration={700}>
            <TextNexu variant='headlineLarge' style={{ color: COLORS.text, fontWeight: '700', marginTop: 8 }}>
              Conversas
            </TextNexu>
          </Animatable.View>
          <TextNexu style={{ color: COLORS.subtext, marginTop: 6 }}>Converse com suas conexões</TextNexu>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name='search' size={20} color={COLORS.subtext} style={{ marginRight: 10 }} />
            <TextInputNexu
              placeholder='Buscar por nome ou @nick'
              placeholderTextColor={COLORS.subtext}
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              autoCapitalize='none'
              returnKeyType='search'
              clearButtonMode='while-editing'
              maxLength={50}
            />
            {isLoading ? <ActivityIndicator size='small' color={COLORS.primary} /> : null}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          {isLoading && connections.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size='large' color={COLORS.primary} />
              <TextNexu style={{ color: COLORS.subtext, marginTop: 12 }}>Carregando conversas...</TextNexu>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Ionicons name='chatbubble-ellipses' size={56} color={COLORS.subtext} style={{ marginBottom: 12 }} />
              <TextNexu style={{ color: COLORS.subtext, textAlign: 'center', marginHorizontal: 20 }}>
                {connections.length === 0
                  ? 'Você ainda não tem conexões. Conecte-se com outros usuários para iniciar conversas.'
                  : `Nenhuma conversa encontrada para "${search}".`}
              </TextNexu>
            </View>
          ) : (
            filtered.map((c, idx) => (
              <Animatable.View key={c.id} animation='fadeInUp' delay={idx * 40} style={styles.card}>
                <TouchableOpacity onPress={() => handleOpenChat(c.id)} activeOpacity={0.85} style={styles.cardLeft}>
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${c.avatar}` }}
                    style={styles.avatar}
                    resizeMode='cover'
                  />
                  <View style={{ flex: 1 }}>
                    <TextNexu variant='titleMedium' style={{ color: COLORS.text, fontWeight: '700' }}>
                      {c.name}
                    </TextNexu>
                    <TextNexu variant='bodySmall' style={{ color: COLORS.subtext }}>
                      @{c.nick}
                    </TextNexu>
                  </View>
                </TouchableOpacity>

                <View style={{ marginLeft: 12 }}>
                  <TouchableOpacity onPress={() => handleOpenChat(c.id)} style={styles.openBtn} activeOpacity={0.8}>
                    <Ionicons name='chatbubble' size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15
  },
  clearBtn: {
    marginLeft: 12,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12, borderWidth: 2, borderColor: COLORS.primary },
  openBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'transparent'
  }
})

export default ChatsScreen

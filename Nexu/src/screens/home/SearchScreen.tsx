import React, { useEffect, useState } from 'react'
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getUsersByNameOrNick } from 'src/services/apiUser'
import { getErrorMessage } from 'src/utils/errorHandler'
import { useDebounce } from 'src/hooks/useDebounce'
import TextNexu from 'src/components/ui/TextNexu'
import { useTheme } from 'src/context/theme/ThemeContext'
import Toast from 'react-native-toast-message'
import { UserType } from 'src/utils/types'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { TextInputNexu } from 'src/components/ui/TextInputNexu'

const SearchScreen = () => {
  const { top } = useSafeAreaInsets()
  const { theme, colors } = useTheme()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleUserPress = (userID: number) => {
    router.push(`/home/perfil?id=${userID}`)
  }

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const { data } = await getUsersByNameOrNick(debouncedSearch)
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: getErrorMessage(err, 'Erro ao buscar usuários')
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (debouncedSearch.trim().length > 0) {
      fetchUsers()
      return
    }

    setUsers([])
  }, [debouncedSearch])

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? [colors.background, colors.surface, colors.card]
          : [colors.surface, colors.background, colors.background]
      }
      style={{ flex: 1, paddingTop: top }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <Animatable.View animation='fadeInDown' duration={700}>
            <TextNexu variant='headlineLarge' style={{ color: colors.text, fontWeight: '700', marginTop: 8 }}>
              Buscar
            </TextNexu>
          </Animatable.View>
          <TextNexu style={{ color: colors.textSecondary, marginTop: 6 }}>Encontre pessoas para seguir</TextNexu>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
            <Ionicons name='search' size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
            <TextInputNexu
              placeholder='Busque pelo seu influencer preferido...'
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: colors.text }]}
              autoCapitalize='none'
              returnKeyType='search'
              clearButtonMode='while-editing'
              maxLength={50}
            />
            {isLoading ? <ActivityIndicator size='small' color={colors.primary} /> : null}
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          {isLoading && users.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size='large' color={colors.primary} />
              <TextNexu style={{ color: colors.textSecondary, marginTop: 12 }}>Buscando usuários...</TextNexu>
            </View>
          ) : users.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Ionicons name='people-outline' size={56} color={colors.textSecondary} style={{ marginBottom: 12 }} />
              <TextNexu style={{ color: colors.textSecondary, textAlign: 'center', marginHorizontal: 20 }}>
                {debouncedSearch.trim().length > 0
                  ? `Nenhum usuário encontrado com "${debouncedSearch}".`
                  : 'Digite um nome ou @nick para começar a busca.'}
              </TextNexu>
            </View>
          ) : (
            users.map((u, idx) => (
              <Animatable.View
                key={u.id}
                animation='fadeInUp'
                delay={idx * 40}
                style={[styles.card, { backgroundColor: colors.card }]}
              >
                <TouchableOpacity onPress={() => handleUserPress(u.id)} activeOpacity={0.8} style={styles.cardLeft}>
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${u.avatar}` }}
                    style={[styles.avatar, { borderColor: colors.primary }]}
                    resizeMode='cover'
                  />
                  <View style={{ flex: 1 }}>
                    <TextNexu variant='titleMedium' style={{ color: colors.text, fontWeight: '700' }}>
                      {u.name}
                    </TextNexu>
                    <TextNexu variant='bodySmall' style={{ color: colors.textSecondary }}>
                      @{u.nick}
                    </TextNexu>
                  </View>
                </TouchableOpacity>
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
    fontSize: 14
  },
  clearBtn: {
    marginLeft: 12,
    padding: 10,
    borderRadius: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12, borderWidth: 2 }
})

export default SearchScreen

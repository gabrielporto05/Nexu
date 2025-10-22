import { ScrollView, View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { useAuth } from 'src/context/auth/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import TextNexu from 'src/components/ui/TextNexu'
import Loading from 'src/components/Loanding'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { router } from 'expo-router'

const COLORS = {
  card: '#1E1E38',
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF',
  danger: '#FF6B6B'
}

const configOptions = [
  { key: 'edit', label: 'Editar perfil', icon: 'create-outline', route: '/home/perfil/update-perfil' },
  { key: 'changePassword', label: 'Alterar senha', icon: 'lock-closed-outline', route: '/home/perfil/change-password' },
  { key: 'delete', label: 'Excluir conta', icon: 'trash-outline', route: '/home/perfil/delete-account', danger: true },
  { key: 'signout', label: 'Sair da conta', icon: 'log-out-outline', danger: true }
]

const ConfigPerfilScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user, signOut } = useAuth()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalProps, setModalProps] = useState<{
    title: string
    message: string
    danger?: boolean
    onConfirm?: () => void
  } | null>(null)

  if (!user) return <Loading />

  const openConfirm = (title: string, message: string, danger = false, onConfirm?: () => void) => {
    setModalProps({ title, message, danger, onConfirm })
    setModalVisible(true)
  }

  const closeConfirm = () => {
    setModalVisible(false)
    setModalProps(null)
  }

  const handleOptionPress = (item: (typeof configOptions)[number]) => {
    if (item.key === 'signout') {
      openConfirm('Sair', 'Deseja realmente sair da sua conta?', true, () => {
        closeConfirm()
        signOut()
      })
      return
    }

    if (item.key === 'delete') {
      openConfirm(
        'Excluir conta',
        'Tem certeza que deseja excluir sua conta? Esta ação é irreversível e removerá todos os seus dados.',
        true,
        () => {
          closeConfirm()
          signOut()
        }
      )
      return
    }

    if (item.route) router.push(item.route)
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={[styles.container, { paddingTop: top }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
            <Ionicons name='arrow-back' size={24} color={COLORS.text} />
          </TouchableOpacity>

          <Animatable.View animation='fadeInDown' duration={600}>
            <TextNexu style={styles.title}>Configurações</TextNexu>
            <TextNexu style={styles.subtitle}>Gerencie seu perfil e conta</TextNexu>
          </Animatable.View>
        </View>

        <Animatable.View
          animation='fadeInUp'
          duration={700}
          style={[styles.profileCard, { backgroundColor: COLORS.card }]}
        >
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
              style={styles.avatar}
              resizeMode='cover'
            />
          </View>

          <TextNexu variant='titleLarge' style={styles.profileName}>
            {user.name}
          </TextNexu>
          <TextNexu style={styles.profileNick}>@{user.nick}</TextNexu>
        </Animatable.View>

        <View style={{ marginTop: 16 }}>
          {configOptions.map((item, i) => (
            <Animatable.View key={item.key} animation='fadeInUp' delay={i * 60}>
              <TouchableOpacity
                onPress={() => handleOptionPress(item)}
                activeOpacity={0.85}
                style={[styles.optionRow, { backgroundColor: COLORS.card }]}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name={item.icon as any} size={20} color={item.danger ? COLORS.danger : COLORS.primary} />
                  <TextNexu style={[styles.optionLabel, item.danger && { color: COLORS.danger }]}>
                    {item.label}
                  </TextNexu>
                </View>
                <Ionicons name='chevron-forward' size={18} color={COLORS.subtext} />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        <View style={{ height: 36 }} />
      </ScrollView>

      <ConfirmModal
        visible={modalVisible}
        title={modalProps?.title ?? ''}
        message={modalProps?.message ?? ''}
        danger={!!modalProps?.danger}
        confirmLabel={modalProps?.danger ? 'Confirmar' : 'OK'}
        cancelLabel='Cancelar'
        onCancel={closeConfirm}
        onConfirm={() => modalProps?.onConfirm && modalProps.onConfirm()}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { color: COLORS.subtext, marginTop: 6 },
  profileCard: {
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8
  },
  avatarWrap: {
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 80,
    padding: 4,
    marginBottom: 12
  },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  profileName: { color: '#fff', fontWeight: '800', marginTop: 6 },
  profileNick: { color: COLORS.subtext, marginTop: 2 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(133,92,248,0.12)'
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { marginLeft: 6, color: '#fff', fontWeight: '600' }
})

export default ConfigPerfilScreen

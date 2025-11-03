import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { useTheme } from 'src/context/theme/ThemeContext'
import { useAuth } from 'src/context/auth/AuthContext'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import TextNexu from 'src/components/ui/TextNexu'
import Loading from 'src/components/Loanding'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { deleteUserById } from 'src/services/apiUser'
import Toast from 'react-native-toast-message'

const configOptions = [
  { key: 'edit', label: 'Editar perfil', icon: 'create-outline', route: '/home/perfil/update-perfil' },
  { key: 'changePassword', label: 'Alterar senha', icon: 'lock-closed-outline', route: '/home/perfil/change-password' },
  { key: 'delete', label: 'Excluir conta', icon: 'trash-outline', route: '/home/perfil/delete-account', danger: true },
  { key: 'signout', label: 'Sair da conta', icon: 'log-out-outline', danger: true }
]

const ConfigPerfilScreen = () => {
  const { top } = useSafeAreaInsets()
  const { user, signOut } = useAuth()
  const { theme, colors, toggleTheme } = useTheme()

  const [modalVisible, setModalVisible] = useState(false)
  const [modalProps, setModalProps] = useState<{
    title: string
    message: string
    danger?: boolean
    onConfirm?: () => void
  } | null>(null)

  if (!user) return <Loading backgroundColor={colors.background} iconColor={colors.primary} />

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
        async () => {
          await deleteUserById(user.id)
          Toast.show({
            type: 'success',
            text1: 'Sua conta foi excluída permanentemente da nosso app!'
          })
          closeConfirm()
          signOut()
        }
      )
      return
    }

    if (item.route) router.push(item.route)
  }

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? [colors.background, colors.surface, colors.card]
          : [colors.surface, colors.background, colors.background]
      }
      style={[styles.container, { paddingTop: top }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
            <Ionicons name='arrow-back' size={24} color={colors.text} />
          </TouchableOpacity>

          <Animatable.View animation='fadeInDown' duration={600}>
            <TextNexu style={[styles.title, { color: colors.text }]}>Configurações</TextNexu>
            <TextNexu style={[styles.subtitle, { color: colors.textSecondary }]}>Gerencie seu perfil e conta</TextNexu>
          </Animatable.View>
        </View>

        <Animatable.View
          animation='fadeInUp'
          duration={700}
          style={[styles.profileCard, { backgroundColor: colors.card }]}
        >
          <View style={[styles.avatarWrap, { borderColor: colors.primary }]}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
              style={styles.avatar}
              resizeMode='cover'
            />
          </View>

          <TextNexu variant='titleLarge' style={[styles.profileName, { color: colors.text }]}>
            {user.name}
          </TextNexu>
          <TextNexu style={[styles.profileNick, { color: colors.textSecondary }]}>@{user.nick}</TextNexu>
        </Animatable.View>

        <View style={{ marginTop: 16 }}>
          {configOptions.map((item, i) => (
            <Animatable.View key={item.key} animation='fadeInUp' delay={i * 60}>
              <TouchableOpacity
                onPress={() => handleOptionPress(item)}
                activeOpacity={0.85}
                style={[
                  styles.optionRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: `${colors.primary}20`
                  }
                ]}
              >
                <View style={styles.optionLeft}>
                  <Ionicons name={item.icon as any} size={20} color={item.danger ? colors.error : colors.primary} />
                  <TextNexu
                    style={[styles.optionLabel, { color: colors.text }, item.danger && { color: colors.error }]}
                  >
                    {item.label}
                  </TextNexu>
                </View>
                <Ionicons name='chevron-forward' size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        <Animatable.View animation='fadeInUp' delay={300} style={{ marginTop: 10 }}>
          <View
            style={[
              styles.themeCard,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.primary}20`
              }
            ]}
          >
            <View style={styles.themeHeader}>
              <View style={styles.themeLeft}>
                <Ionicons
                  name={theme === 'dark' ? 'moon' : 'sunny'}
                  size={22}
                  color={colors.primary}
                  style={styles.themeIcon}
                />
                <View>
                  <TextNexu style={[styles.themeTitle, { color: colors.text }]}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </TextNexu>
                  <TextNexu style={{ color: colors.textSecondary }}>
                    {theme === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado'}
                  </TextNexu>
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </Animatable.View>

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
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { marginTop: 6 },
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
    borderRadius: 80,
    padding: 4,
    marginBottom: 12
  },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  profileName: { fontWeight: '800', marginTop: 6 },
  profileNick: { marginTop: 2 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionLabel: { marginLeft: 6, fontWeight: '600' },
  themeCard: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  themeIcon: {
    marginRight: 12
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  switchContainer: {
    alignItems: 'center'
  }
})

export default ConfigPerfilScreen

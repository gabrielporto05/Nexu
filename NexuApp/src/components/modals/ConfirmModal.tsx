import { Modal, View, Animated, Easing, Pressable, StyleSheet } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect } from 'react'

const COLORS = {
  primary: '#855CF8',
  subtext: '#9CA3AF',
  text: '#FFFFFF',
  danger: '#FF6B6B',
  backdrop: 'rgba(0,0,0,0.6)',
  cardBg: '#0B0B12'
}

type ConfirmModalProps = {
  visible: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  onCancel,
  onConfirm
}: ConfirmModalProps) => {
  const scale = React.useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (visible) {
      Animated.timing(scale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start()
    } else {
      scale.setValue(0.9)
    }
  }, [visible, scale])

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType='fade'>
      <View style={styles.modalBackdrop}>
        <Animated.View style={[styles.modalCard, { transform: [{ scale }] }]}>
          <View style={styles.modalHeader}>
            <Ionicons
              name={danger ? 'warning' : 'help-circle'}
              size={28}
              color={danger ? COLORS.danger : COLORS.primary}
            />
            <TextNexu variant='titleLarge' style={styles.modalTitle}>
              {title}
            </TextNexu>
          </View>

          <TextNexu style={styles.modalMessage}>{message}</TextNexu>

          <View style={styles.modalActions}>
            <Pressable onPress={onCancel} style={styles.modalBtnOutline}>
              <TextNexu style={styles.modalBtnOutlineText}>{cancelLabel}</TextNexu>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={[styles.modalBtnFilled, danger && { backgroundColor: COLORS.danger }]}
            >
              <TextNexu style={styles.modalBtnFilledText}>{confirmLabel}</TextNexu>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 18,
    elevation: 20
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  modalTitle: { color: COLORS.text, fontWeight: '800' },
  modalMessage: { color: COLORS.subtext, marginBottom: 18 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalBtnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'transparent'
  },
  modalBtnOutlineText: { color: COLORS.subtext, fontWeight: '700' },
  modalBtnFilled: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: COLORS.primary
  },
  modalBtnFilledText: { color: '#fff', fontWeight: '800' }
})

export default ConfirmModal

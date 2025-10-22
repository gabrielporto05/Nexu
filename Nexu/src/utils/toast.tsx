import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'

export const toastConfig = {
  success: ({ text1 }: { text1?: string }) => (
    <View style={styles.toastSuccess}>
      <Ionicons name='checkmark-circle' size={20} color='#10B981' />
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  error: ({ text1 }: { text1?: string }) => (
    <View style={styles.toastError}>
      <Ionicons name='close-circle' size={20} color='#EF4444' />
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  toastSuccess: {
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981'
  },
  toastError: {
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444'
  },
  toastText: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '500',
    flex: 1
  }
})

export const ToastWrapper = () => {
  return <Toast config={toastConfig} position='bottom' bottomOffset={80} />
}

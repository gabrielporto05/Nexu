import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

export const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('accessToken')
  }

  return await SecureStore.getItemAsync('accessToken')
}

export const setToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('accessToken', token)

    return
  }

  await SecureStore.setItemAsync('accessToken', token)
}

export const deleteToken = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem('accessToken')

    return
  }

  await SecureStore.deleteItemAsync('accessToken')
}

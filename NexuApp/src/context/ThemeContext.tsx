// ==========================================
// 1. src/context/ThemeContext.tsx
// ==========================================
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

type ThemeMode = 'light' | 'dark'

interface ThemeColors {
  background: string
  surface: string
  card: string
  text: string
  textSecondary: string
  border: string
  primary: string
  error: string
  success: string
  inputBackground: string
  placeholder: string
}

interface ThemeContextType {
  theme: ThemeMode
  colors: ThemeColors
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F7FF',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#855CF8',
  error: '#EF4444',
  success: '#10B981',
  inputBackground: '#F9FAFB',
  placeholder: '#9CA3AF'
}

const darkColors: ThemeColors = {
  background: '#0F0F23',
  surface: '#1A1A2E',
  card: '#1E1E38',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
  primary: '#855CF8',
  error: '#EF4444',
  success: '#10B981',
  inputBackground: '#0F0F23',
  placeholder: '#6B7280'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Funções auxiliares para storage
const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key)
    }
    return await SecureStore.getItemAsync(key)
  } catch (error) {
    console.error('Erro ao buscar item do storage:', error)
    return null
  }
}

const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value)
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  } catch (error) {
    console.error('Erro ao salvar item no storage:', error)
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark')

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await getStorageItem('@theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme)
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error)
    }
  }

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await setStorageItem('@theme', newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.error('Erro ao salvar tema:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const colors = theme === 'light' ? lightColors : darkColors

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}

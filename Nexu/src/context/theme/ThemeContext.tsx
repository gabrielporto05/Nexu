import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

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
  warning: string
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
  warning: '#F59E0B',
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
  warning: '#F59E0B',
  success: '#10B981',
  inputBackground: '#0F0F23',
  placeholder: '#6B7280'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const THEME_KEY = 'app.theme'

const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    const safeKey = key.replace(/[^A-Za-z0-9._-]/g, '')
    if (Platform.OS === 'web') return localStorage.getItem(safeKey)
    return await SecureStore.getItemAsync(safeKey)
  } catch {
    return null
  }
}

const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    const safeKey = key.replace(/[^A-Za-z0-9._-]/g, '')
    if (Platform.OS === 'web') localStorage.setItem(safeKey, value)
    else await SecureStore.setItemAsync(safeKey, value)
  } catch (error) {
    console.warn('⚠️ Falha ao salvar tema:', error)
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark')
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await getStorageItem(THEME_KEY)
        if (saved === 'light' || saved === 'dark') {
          setThemeState(saved)
        }
      } catch (error) {
        console.warn('⚠️ Erro ao carregar tema:', error)
      } finally {
        setInitialized(true)
      }
    }
    loadTheme()
  }, [])

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await setStorageItem(THEME_KEY, newTheme)
      setThemeState(newTheme)
    } catch {
      setThemeState('dark')
    }
  }

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  const colors = theme === 'light' ? lightColors : darkColors

  if (!initialized) return null

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  return context
}

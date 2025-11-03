import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState, useRef } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { getUserById } from 'src/services/apiUser'
import { UserType } from 'src/utils/types'
import Toast from 'react-native-toast-message'
import { getErrorMessage } from 'src/utils/errorHandler'
import Loading from 'src/components/Loanding'
import { useTheme } from 'src/context/theme/ThemeContext'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const Chat = () => {
  const { connection } = useLocalSearchParams()
  const [user, setUser] = useState<UserType | null>(null)
  const [message, setMessage] = useState('')
  const { theme, colors } = useTheme()
  const { top, bottom } = useSafeAreaInsets()
  const scrollViewRef = useRef<ScrollView>(null)

  const [messages] = useState([
    { id: 1, text: 'Eaé mn, bão?', isMe: false, time: '10:30' },
    { id: 2, text: 'Opaaa, tudo otimo!', isMe: true, time: '10:31' },
    { id: 3, text: 'Fazendo oque de bom ai?', isMe: false, time: '10:32' },
    { id: 4, text: 'Criando um app mobile, uma rede social simples.', isMe: true, time: '10:33' }
  ])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserById(Number(connection))
        setUser(data)
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: getErrorMessage(err, 'Erro ao buscar usuário')
        })
      }
    }

    if (connection) fetchUser()
  }, [connection])

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Lógica para enviar a mensagem
      setMessage('')
    }
  }

  if (!user) return <Loading backgroundColor={colors.background} iconColor={colors.primary} />

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? [colors.background, colors.surface, colors.card]
          : [colors.surface, colors.background, colors.background]
      }
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? top : 0}
      >
        <View style={[styles.header, { backgroundColor: colors.card, paddingTop: top }]}>
          <TouchableWithoutFeedback onPress={() => router.push(`/home/perfil?id=${user.id}`)}>
            <View style={styles.headerContent}>
              <Image
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL_UPLOADS}/avatars/${user.avatar}` }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <TextNexu variant='titleMedium' style={{ color: colors.text, fontWeight: '600' }}>
                  {user.name}
                </TextNexu>
                <TextNexu variant='bodySmall' style={{ color: colors.textSecondary }}>
                  @{user.nick} • Online
                </TextNexu>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.isMe ? styles.myMessage : styles.theirMessage,
                msg.isMe
                  ? { backgroundColor: colors.primary, alignSelf: 'flex-end' }
                  : { backgroundColor: colors.border, alignSelf: 'flex-start' }
              ]}
            >
              <TextNexu style={[styles.messageText, { color: msg.isMe ? '#FFFFFF' : colors.text }]}>
                {msg.text}
              </TextNexu>
              <TextNexu
                style={[styles.messageTime, { color: msg.isMe ? 'rgba(255,255,255,0.7)' : colors.textSecondary }]}
              >
                {msg.time}
              </TextNexu>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.card, paddingBottom: bottom + 10 }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBackground }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder='Digite uma mensagem...'
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true })
                }, 100)
              }}
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name='send' size={20} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#855CF8'
  },
  userInfo: {
    flex: 1
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 12
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4
  },
  myMessage: {
    borderBottomRightRadius: 4
  },
  theirMessage: {
    borderBottomLeftRadius: 4
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end'
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Chat

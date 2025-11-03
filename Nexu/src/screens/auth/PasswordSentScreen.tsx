import { View, TouchableOpacity } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from 'src/context/theme/ThemeContext'

const PasswordSentScreen = () => {
  const router = useRouter()
  const { theme, colors } = useTheme()

  return (
    <LinearGradient
      colors={
        theme === 'dark'
          ? [colors.background, colors.surface, colors.card]
          : [colors.surface, colors.background, colors.background]
      }
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Animatable.View
          animation='bounceIn'
          duration={1200}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${colors.success}20`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
            borderWidth: 3,
            borderColor: colors.success
          }}
        >
          <Ionicons name='checkmark-circle' size={80} color={colors.success} />
        </Animatable.View>

        <Animatable.View animation='fadeInUp' delay={500} duration={1000} style={{ alignItems: 'center' }}>
          <TextNexu
            style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: colors.text }}
          >
            Senha enviada com sucesso!
          </TextNexu>

          <TextNexu
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 24,
              color: colors.textSecondary,
              lineHeight: 24,
              paddingHorizontal: 20
            }}
          >
            Sua nova senha foi enviada para o endereço de e-mail inserido. Você pode usá-la para acessar sua conta
            normalmente.
          </TextNexu>

          <View
            style={{
              backgroundColor: `${colors.warning}10`,
              borderLeftWidth: 4,
              borderLeftColor: colors.warning,
              padding: 16,
              borderRadius: 12,
              marginBottom: 32
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons
                name='information-circle'
                size={20}
                color={colors.warning}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <TextNexu style={{ fontSize: 14, color: colors.textSecondary }}>
                Por segurança, recomendamos que você altere essa senha nas configurações do seu perfil assim que
                possível.
              </TextNexu>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation='fadeInUp' delay={700} duration={1000} style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => router.replace('/auth/login')} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.primary, '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 18,
                borderRadius: 16,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 12
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Ionicons name='arrow-back' size={22} color='#FFF' />
                <TextNexu style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Voltar para Login</TextNexu>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </LinearGradient>
  )
}

export default PasswordSentScreen

import { View, TouchableOpacity } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import AnimatedLogo from 'src/components/ui/AnimatedLogo'

const PasswordSentPage = () => {
  const router = useRouter()

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A2E', '#16213E']} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <AnimatedLogo animation='fadeIn' delay={300} duration={1000} />
        <Animatable.View
          animation='bounceIn'
          duration={1200}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
            borderWidth: 3,
            borderColor: '#10B981'
          }}
        >
          <Ionicons name='checkmark-circle' size={80} color='#10B981' />
        </Animatable.View>

        <Animatable.View animation='fadeInUp' delay={500} duration={1000} style={{ alignItems: 'center' }}>
          <TextNexu
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 16,
              color: '#FFFFFF'
            }}
          >
            Senha enviada com sucesso!
          </TextNexu>

          <TextNexu
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 24,
              color: '#9CA3AF',
              lineHeight: 24,
              paddingHorizontal: 20
            }}
          >
            Sua nova senha foi enviada para o endereço de e-mail inserido. Você pode usá-la para acessar sua conta
            normalmente.
          </TextNexu>

          <View
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              borderLeftWidth: 4,
              borderLeftColor: '#FBB936',
              padding: 16,
              borderRadius: 12,
              marginBottom: 32
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Ionicons name='information-circle' size={20} color='#FBB936' style={{ marginRight: 8, marginTop: 2 }} />
              <TextNexu style={{ fontSize: 14, color: '#9CA3AF', flex: 1, lineHeight: 20 }}>
                Por segurança, recomendamos que você altere essa senha nas configurações do seu perfil assim que
                possível.
              </TextNexu>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation='fadeInUp' delay={700} duration={1000} style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => router.replace('/auth/login')} activeOpacity={0.9}>
            <LinearGradient
              colors={['#9B7EF8', '#855CF8', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 18,
                borderRadius: 16,
                shadowColor: '#855CF8',
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

export default PasswordSentPage

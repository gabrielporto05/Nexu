import { View, Image } from 'react-native'
import TextNexu from 'src/components/ui/TextNexu'
import ButtonNexu from 'src/components/ui/ButtonNexu'
import { useRouter } from 'expo-router'

const PasswordSentPage = () => {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' }}>
      <Image
        source={require('../../assets/NexuApenasSemFundoPreta.png')}
        style={{ alignSelf: 'center', width: '100%', height: 250 }}
        resizeMode='contain'
      />

      <TextNexu style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
        Recuperação de senha bem sucedida!
      </TextNexu>

      <TextNexu style={{ fontSize: 20, textAlign: 'center', marginBottom: 24 }}>
        Sua nova senha foi enviada para o endereço de e-mail inserido. Você pode usá-la para acessar sua conta
        normalmente.
      </TextNexu>

      <TextNexu style={{ fontSize: 18, textAlign: 'center', marginBottom: 40, color: '#555' }}>
        Por segurança, recomendamos que você altere essa senha nas configurações do seu perfil assim que possível.
      </TextNexu>

      <ButtonNexu buttonColor='#855CF8' onPress={() => router.replace('/auth/login')} style={{ paddingVertical: 8 }}>
        <TextNexu style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Voltar para login</TextNexu>
      </ButtonNexu>
    </View>
  )
}

export default PasswordSentPage

import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import TextNexu from 'src/components/ui/TextNexu'

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' />
      <TextNexu variant='headlineMedium' style={{ marginTop: 20, fontWeight: 'bold' }}>
        Carregando...
      </TextNexu>
    </View>
  )
}

export default Loading

import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F23' }}>
      <ActivityIndicator size='large' color='#855CF8' />
    </View>
  )
}

export default Loading

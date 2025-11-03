import { ActivityIndicator } from 'react-native-paper'
import { View } from 'react-native'

interface LoadingProps {
  backgroundColor?: string
  iconColor?: string
}

const Loading = ({ backgroundColor, iconColor }: LoadingProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: backgroundColor ?? 'transparent'
      }}
    >
      <ActivityIndicator size='large' color={iconColor ?? '#fff'} />
    </View>
  )
}

export default Loading

import { Text } from 'react-native-paper'
import { ComponentProps } from 'react'

export default function TextNexu(props: ComponentProps<typeof Text>) {
  return <Text {...props} style={[{ fontFamily: 'SpaceGrotesk_400Regular', color: '#000' }, props.style]} />
}

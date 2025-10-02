import { TextInput, TextInputProps } from 'react-native-paper'

export default function TextInputNexu(props: TextInputProps) {
  return <TextInput textColor='#000' {...props} style={[{ fontFamily: 'SpaceGrotesk_400Regular' }, props.style]} />
}

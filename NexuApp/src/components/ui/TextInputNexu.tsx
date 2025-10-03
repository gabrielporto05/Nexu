import { TextInput, TextInputProps } from 'react-native-paper'

export const TextInputNexu = (props: TextInputProps) => (
  <TextInput textColor='#000' {...props} style={[{ fontFamily: 'SpaceGrotesk_400Regular' }, props.style]} />
)

TextInputNexu.Icon = TextInput.Icon

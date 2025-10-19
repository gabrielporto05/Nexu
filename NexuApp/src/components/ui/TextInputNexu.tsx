import { TextInput, TextInputProps } from 'react-native-paper'

export const TextInputNexu = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      textColor='#000'
      style={[{ fontFamily: 'SpaceGrotesk_400Regular' }, props.style]}
      right={props.right}
      secureTextEntry={props.secureTextEntry}
      theme={{
        colors: {
          primary: '#855CF8',
          outline: '#ccc',
          ...props.theme?.colors
        }
      }}
    />
  )
}

TextInputNexu.Icon = TextInput.Icon

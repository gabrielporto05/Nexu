import { TextInput, TextInputProps } from 'react-native-paper'
import { useTheme } from 'src/context/ThemeContext'

export const TextInputNexu = (props: TextInputProps) => {
  const { colors } = useTheme()

  return (
    <TextInput
      {...props}
      textColor={colors.text}
      style={[{ fontFamily: 'SpaceGrotesk_400Regular' }, props.style]}
      right={props.right}
      secureTextEntry={props.secureTextEntry}
      maxLength={props.maxLength}
      theme={{
        colors: {
          primary: colors.primary,
          outline: colors.border,
          onSurfaceVariant: colors.textSecondary,
          surfaceVariant: colors.card,
          background: colors.inputBackground,
          onSurface: colors.text,
          ...props.theme?.colors
        }
      }}
    />
  )
}

TextInputNexu.Icon = TextInput.Icon

import { Text } from 'react-native-paper'
import { ComponentProps } from 'react'
import { useTheme } from 'src/context/theme/ThemeContext'

export default function TextNexu(props: ComponentProps<typeof Text>) {
  const { colors } = useTheme()

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.text
        },
        props.style
      ]}
    />
  )
}

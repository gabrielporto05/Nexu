import { Button, ButtonProps } from 'react-native-paper'

export default function ButtonNexu(props: ButtonProps) {
  return (
    <Button
      {...props}
      labelStyle={[
        {
          fontFamily: 'SpaceGrotesk_700Bold',
          fontSize: 16
        },
        props.labelStyle
      ]}
      mode={props.mode || 'contained'}
    />
  )
}

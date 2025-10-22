import { View, Image, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
  delay?: number
  animation?: 'bounceIn' | 'fadeIn' | 'zoomIn' | 'pulse'
  duration?: number
}

const AnimatedLogo = ({ size = 'medium', delay = 100, animation = 'bounceIn', duration = 1200 }: AnimatedLogoProps) => {
  const dimensions = {
    small: { container: 160, image: { width: 220, height: 200 } },
    medium: { container: 200, image: { width: 280, height: 300 } },
    large: { container: 240, image: { width: 340, height: 400 } }
  }

  const { container, image } = dimensions[size]

  return (
    <Animatable.View animation={animation} duration={duration} delay={delay} style={styles.container}>
      <View
        style={[
          styles.logoContainer,
          {
            width: container,
            height: container
          }
        ]}
      >
        <Image
          source={require('../../../assets/NexuApenasSemFundo.png')}
          style={{
            width: image.width,
            height: image.height
          }}
          resizeMode='contain'
        />
      </View>
    </Animatable.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoContainer: {
    backgroundColor: '#1E1E38',
    borderRadius: 50,
    shadowColor: '#855CF8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(133, 92, 248, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
})

export default AnimatedLogo

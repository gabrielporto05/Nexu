import { Image, TouchableOpacity, View, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type ImageExpandModalProps = {
  selectedImage: string | null
  setSelectedImage: (uri: string | null) => void
}

const ImageExpandModal = ({ selectedImage, setSelectedImage }: ImageExpandModalProps) => {
  return (
    <Modal visible={!!selectedImage} transparent animationType='fade' onRequestClose={() => setSelectedImage(null)}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedImage(null)}
          style={{
            position: 'absolute',
            top: 40,
            right: 30,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: 8,
            borderRadius: 20
          }}
          activeOpacity={0.7}
        >
          <Ionicons name='close' size={28} color='#fff' />
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
        )}
      </View>
    </Modal>
  )
}

export default ImageExpandModal

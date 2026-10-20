import { CameraCapturedPicture } from 'expo-camera';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PhotoPreviewSection = ({photo, handleRetakePhoto, handleApiResponse}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleApiResponse: (photo: CameraCapturedPicture) => Promise<void>;
}) => {
    // Previene el envío de múltiples solicitudes a la API.
    const [isSending, setIsSending] = useState(false);

    // Espera la respuesta y restaura el estado del botón.
    const sendPhoto = async () => {
        setIsSending(true);
        try {
            await handleApiResponse(photo);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Muestra la imagen capturada. */}
            <View style={styles.box}>
                <Image
                    style={styles.previewContainer}
                    source={{uri: `data:image/${photo.format};base64,${photo.base64}`}}
                />
            </View>

            {/* Permite descartar la imagen o enviarla a la API. */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto} disabled={isSending}>
                    <Image source={require('@/assets/images/tabIcons/retake.png')} style={styles.cameraIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={sendPhoto} disabled={isSending}>
                    {isSending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Image source={require('@/assets/images/tabIcons/send.png')} style={styles.cameraIcon} resizeMode="contain" />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Distribución y controles de la vista previa a pantalla completa.
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderRadius: 15,
    padding: 1,
    width: '95%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: "center",
  },
  previewContainer: {
    width: '95%',
    height: '85%',
    borderRadius: 15
  },
  buttonContainer: {
    marginTop: '4%',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    width: '100%',
  },
  button: {
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraIcon: {
    width: 36,
    height: 36,
    tintColor: 'white',
  },
});

export default PhotoPreviewSection;
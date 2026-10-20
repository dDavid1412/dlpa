import { Alert, Button, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PhotoPreviewSection from '@/components/photo-preview-section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { PREDICT_URL } from '@/constants/api';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';



export default function Photos() {
    // Almacena el estado del permiso de la cámara y permite solicitarlo al sistema.
    const [permission, requestPermission] = useCameraPermissions();
    // Guarda la última imagen capturada. Un valor distinto de null muestra la vista previa.
    const [photo, setPhoto] = useState<any>(null);
    // Mantiene una referencia a la cámara para capturar fotos desde el botón.
    const cameraRef = useRef<CameraView | null>(null);
    // Controla si se muestra la cámara trasera o la frontal.
    const [type, setType] = useState<CameraType>('back');

    // Alterna entre la cámara trasera y la frontal.
    function toggleCameraFacing() {
        setType(current => (current === 'back' ? 'front' : 'back'));
    };

    // Captura una foto con datos en base64.
    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            const options = {
                quality: 1,
                base64: true,
                exif: false,
            }
            const takePhoto = await cameraRef.current?.takePictureAsync(options);
            setPhoto(takePhoto);
        }
    };

    // Elimina la foto actual y vuelve a la vista de la cámara.
    const handleRetakePhoto = () => setPhoto(null);

    // Construye una solicitud multipart y envía la imagen capturada a la API de predicción.
    const handleApiResponse = async (currentPhoto: CameraCapturedPicture) => {
        try {
            const formData = new FormData();
            const file = {
                uri: currentPhoto.uri,
                name: `photo.${currentPhoto.format}`,
                type: `image/${currentPhoto.format}`,
            };

            // Los navegadores requieren un Blob, mientras que las plataformas nativas aceptan un descriptor de archivo.
            if (Platform.OS === 'web') {
                const imageBlob = await fetch(currentPhoto.uri).then(response => response.blob());
                formData.append('file', imageBlob, file.name);
            } else {
                formData.append('file', file as unknown as Blob);
            }

            const response = await fetch(PREDICT_URL, {
                method: 'POST',
                body: formData,
            });
            const responseText = await response.text();

            // Convierte las respuestas que no son 2xx en el mismo flujo de error que los fallos de red.
            if (!response.ok) {
                throw new Error(`API request failed (${response.status}): ${responseText || 'Unknown error'}`);
            }

            Alert.alert('Respuesta del API', responseText || 'La imagen fue recibida correctamente.');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No se pudo enviar la imagen.';
            Alert.alert('Error al enviar la imagen', message);
        }
    };

  // Muestra un estado de carga mientras Expo determina el estado actual del permiso.
  if(!permission) {
    return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Cámara</ThemedText>
        </ThemedView> 
            <ThemedText type="subtitle">Se necesita permitir el uso de la cámara en la aplicación</ThemedText>


        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
  } 

  // Explica por qué no se puede usar la cámara y permite solicitar el permiso.
  if(!permission.granted) {
    return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Cámara</ThemedText>
            <ThemedText type="default">Se necesita permitir el uso de la cámara en la aplicación</ThemedText>
            <Button onPress={requestPermission} title='Dar permiso' />
        </ThemedView> 



        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
    );
  }  

  // Cuando existe una foto, reemplaza los controles de la cámara por la vista previa y las acciones de envío.
  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} handleApiResponse={handleApiResponse} />


  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Encabezado de la cámara y área de vista previa en directo. */}
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Cámara</ThemedText>
        </ThemedView> 
        <View style={styles.container}>
        <CameraView style={styles.camera} facing={type} ref={cameraRef}/>
        {/* Los controles superpuestos mantienen despejada la vista previa de la cámara. */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Image source={require('@/assets/images/tabIcons/swap.png')} style={styles.cameraIcon} resizeMode="contain" />
            </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Image source={require('@/assets/images/tabIcons/take.png')} style={styles.cameraIconTake} resizeMode="contain" />
            </TouchableOpacity>
        </View>
        </View>


        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}
// Estilos de distribución y controles compartidos por los estados de permisos, cámara y web.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  camera: {
    flex: 1,
    borderRadius: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '88%',
    paddingHorizontal: 10,
  },
  buttonContainer2: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: '8%',
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  image: {
    width: 100,
    height: 100,
  },
  cameraIcon: {
    width: 36,
    height: 36,
    tintColor: 'white',
  },
  cameraIconTake: {
    width: 48,
    height: 48,
    tintColor: 'white',
  },
});

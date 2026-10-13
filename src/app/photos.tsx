import { Button, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PhotoPreviewSection from '@/components/photo-preview-section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';



export default function Photos() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<any>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const [type, setType] = useState<CameraType>('back');

    function toggleCameraFacing() {
        setType(current => (current === 'back' ? 'front' : 'back'));
    };

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

    const handleRetakePhoto = () => setPhoto(null);
  
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

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />


  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="subtitle">Cámara</ThemedText>
        </ThemedView> 
        <View style={styles.container}>
        <CameraView style={styles.camera} facing={type} ref={cameraRef}/>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Image source={require('@/assets/images/tabIcons/swap.png')} style={styles.cameraIcon} resizeMode="contain" />
            </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer2}>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Image source={require('@/assets/images/tabIcons/take.png')} style={styles.cameraIcon} resizeMode="contain" />
            </TouchableOpacity>
        </View>
        </View>


        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}
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
  title: {
    textAlign: 'center',
  },
  titleDLPA: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#0084ff',
  },
  code: {
    textTransform: 'uppercase',
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
    height: '5%',
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
});

import { CameraCapturedPicture } from 'expo-camera';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PhotoPreviewSection = ({photo, handleRetakePhoto, handleApiResponse}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleApiResponse: () => void;
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{uri: 'data:image/jpg;base64,' + photo.base64}}
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                <Image source={require('@/assets/images/tabIcons/retake.png')} style={styles.cameraIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleApiResponse}>
                <Image source={require('@/assets/images/tabIcons/camera.png')} style={styles.cameraIcon} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);

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
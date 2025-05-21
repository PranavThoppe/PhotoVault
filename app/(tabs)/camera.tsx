import {
  CameraType,
  CameraView,
  useCameraPermissions,
  type CameraViewHandle,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef, useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraViewHandle | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const isFocused = useIsFocused();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const fileName = photo.uri.split('/').pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({ from: photo.uri, to: newPath });
      setPhotoUri(newPath);
    }
  }

  async function savePhoto() {
    if (photoUri) {
      const stored = await AsyncStorage.getItem('photos');
      const photos = stored ? JSON.parse(stored) : [];
      if (!photos.includes(photoUri)) {
        photos.push(photoUri);
        await AsyncStorage.setItem('photos', JSON.stringify(photos));
      }
      setPhotoUri(null);
    }
  }

  function retakePicture() {
    setPhotoUri(null);
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={retakePicture}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={savePhoto}>
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        isFocused && (
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.previewContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={takePicture}>
                <Ionicons name="scan" size={64} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  button: {
    padding: 12,
    backgroundColor: 'rgba(29, 25, 25, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
    width: '40%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scanButton: {
    padding: 12,
    backgroundColor: 'rgba(29, 25, 25, 0.7)',
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 550,
  },
});

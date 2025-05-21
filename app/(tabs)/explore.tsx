// explore.tsx
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExploreScreen() {
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  useFocusEffect(
  useCallback(() => {
    loadSavedPhotos();
  }, [])
);

  async function loadSavedPhotos() {
    try {
      const stored = await AsyncStorage.getItem('photos');
      if (stored) {
        const photoList = JSON.parse(stored);
        setSavedPhotos(photoList);
      }
    } catch (err) {
      console.error('Failed to load saved photos', err);
    }
  }

  async function deletePhoto(uri: string) {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      const updatedPhotos = savedPhotos.filter((p) => p !== uri);
      await AsyncStorage.setItem('photos', JSON.stringify(updatedPhotos));
      setSavedPhotos(updatedPhotos);
      setFullscreenPhoto(null);
    } catch (err) {
      console.error('Failed to delete photo', err);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Saved Photos</Text>

      {/* Fullscreen Photo Modal */}
      <Modal visible={!!fullscreenPhoto} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          {fullscreenPhoto && (
            <>
              <Image source={{ uri: fullscreenPhoto }} style={styles.fullImage} />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setFullscreenPhoto(null)}>
                  <Text style={styles.modalText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#aa0000' }]} onPress={() => deletePhoto(fullscreenPhoto)}>
                  <Text style={styles.modalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      <View style={styles.gallery}>
        {savedPhotos.map((uri, index) => (
          <Pressable key={index} onPress={() => setFullscreenPhoto(uri)}>
            <Image source={{ uri }} style={styles.thumbnail} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 10,
    paddingBottom: 90,
    marginTop: 30
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(29, 25, 25, 0.7)',
    borderRadius: 8,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
  },
});

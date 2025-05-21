import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to PhotoVault 📸</ThemedText>
        
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Capture and Organize</ThemedText>
        <ThemedText>
          Use the <ThemedText type="defaultSemiBold">Camera</ThemedText> tab to take and save photos
          directly to your device. No sign-up, no sync — your data stays local and private.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">View Your Gallery</ThemedText>
        <ThemedText>
          Switch to the <ThemedText type="defaultSemiBold">Explore</ThemedText> tab to access your saved
          photos. Tap any image to view fullscreen or delete it from your collection.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Open Source, Yours to Build On</ThemedText>
        <ThemedText>
          This app was built with Expo and React Native. You can expand it to include folders,
          tagging, cloud sync, or share functionality.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

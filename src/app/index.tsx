import * as Device from 'expo-device';
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {

  const router = useRouter()

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            Bienvenido a&nbsp;<ThemedText type="title" style={styles.titleDLPA}>DLPA</ThemedText>
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Comprueba si estás registrado
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.push('/photos')}
            style={({ pressed }) => [
              styles.photoButton,
              pressed && styles.photoButtonPressed,
            ]}>
            <ThemedText style={styles.photoButtonText}>Tomar Foto</ThemedText>
          </Pressable>
        </ThemedView>

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
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  titleDLPA: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#0084ff',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: -10
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  photoButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});

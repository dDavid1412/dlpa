import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

// Diseño raíz: aplica el tema, la animación de inicio y el navegador de pestañas de cada plataforma.
export default function TabLayout() {
  // Selecciona el tema de navegación según la preferencia de color del dispositivo.
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* La capa gestiona la transición de inicio antes de mostrar las pestañas. */}
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

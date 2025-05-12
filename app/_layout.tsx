import '@/global.css';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const InitialLayout = () => {
  const { initialized, signOut } = useAuth();

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <Slot />;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <StatusBar style="auto" />
          <InitialLayout />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

import { Slot } from 'expo-router';
import 'react-native-reanimated';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import '@/global.css';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { OverlayProvider } from 'stream-chat-expo';
import { SupervisionProvider } from '../providers/SupervisionProvider';

const InitialLayout = () => {
  const { authState, initialized } = useAuth();

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
};

const WebPhoneWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#e5e7eb', // gray-200
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 390,
          height: 844,
          backgroundColor: 'black',
          borderRadius: 40,
          padding: 8,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 32, overflow: 'hidden' }}>
          {children}
        </View>
      </View>
    </View>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <WebPhoneWrapper>
      <SupervisionProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OverlayProvider>
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
            >
              <AuthProvider>
                <StatusBar style="auto" />
                <InitialLayout />
              </AuthProvider>
            </ThemeProvider>
          </OverlayProvider>
        </GestureHandlerRootView>
      </SupervisionProvider>
    </WebPhoneWrapper>
  );
};

export default RootLayout;

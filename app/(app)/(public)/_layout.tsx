import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';

const PublicLayout = () => {
  const { authState } = useAuth();

  if (authState?.authenticated) {
    return <Redirect href="/(app)/(authenticated)" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false, title: 'Login' }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Create Account',
          headerShown: Platform.OS !== 'web',
        }}
      />
    </Stack>
  );
};
export default PublicLayout;

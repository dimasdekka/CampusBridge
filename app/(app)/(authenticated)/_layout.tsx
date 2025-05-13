import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  const { authState } = useAuth();
  const router = useRouter();

  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="consultation/schedule"
        options={{ headerBackTitle: 'Back', title: 'Schedule Supervision' }}
      />
      <Stack.Screen
        name="(modal)/create-chat"
        options={{
          presentation: 'modal',
          title: 'Create Chat',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="chat/[id]/index"
        options={{
          title: '',
          headerBackTitle: 'Chats',
        }}
      />
      <Stack.Screen
        name="chat/[id]/manage"
        options={{
          title: 'Manage Chat',
        }}
      />
    </Stack>
  );
};

export default Layout;

import { useAuth } from '@/providers/AuthProvider';
import ChatProvider from '@/providers/ChatProvider';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const Layout = () => {
  const { authState } = useAuth();
  const { signOut } = useAuth();
  const router = useRouter();

  if (!authState.authenticated) {
    return <Redirect href="/login" />;
  }
  return (
    <ChatProvider>
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/create-chat"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            title: 'Create Chat',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.dismissAll()}>
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="chat/[id]/index"
          options={{ headerBackTitle: 'Chats', title: '' }}
        />
        <Stack.Screen
          name="chat/[id]/manage"
          options={{ title: 'Manage Chat' }}
        />
        <Stack.Screen
          name="consultation/schedule"
          options={{ title: 'Schedule Consultation', headerBackTitle: 'Back' }}
        />
      </Stack>
    </ChatProvider>
  );
};

export default Layout;

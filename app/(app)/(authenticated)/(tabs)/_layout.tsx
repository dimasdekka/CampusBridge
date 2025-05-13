import { HapticTab } from '@/components/HapticTab';
import { BlurTabBarBackground } from '@/components/TabBarBackground.ios';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const Layout = () => {
  const { isProfessor } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0d6c9a',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground:
          process.env.EXPO_OS === 'ios' ? BlurTabBarBackground : undefined,
        tabBarStyle: {
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarLabel: 'Chats',
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recordings"
        options={{
          tabBarLabel: 'Recordings',
          title: 'Recordings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
          href: isProfessor ? '/recordings' : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
export default Layout;

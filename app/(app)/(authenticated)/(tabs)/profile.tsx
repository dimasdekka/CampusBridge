import { useAuth } from '@/providers/AuthProvider';
import { Pressable, Text, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';
import { MaterialIcons } from '@expo/vector-icons';

const Page = () => {
  const { client } = useChatContext();
  const { signOut } = useAuth();
  const user = client.user;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* Profile Card dengan UI ActionCard */}
      <View
        style={{
          backgroundColor: '#3B82F6',
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          position: 'relative',
        }}
        className="p-4"
      >
        {/* Dekorasi lingkaran mirip ActionCard */}
        <View
          style={{
            position: 'absolute',
            right: -10,
            bottom: -10,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#1E40AF',
            opacity: 0.5,
          }}
        />
        <View
          style={{
            position: 'absolute',
            right: -8,
            top: -15,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#1E40AF',
            opacity: 0.4,
          }}
        />

        {/* Header profil */}
        <View className="flex-row items-center mb-4">
          <View className="bg-white/20 w-14 h-14 rounded-full items-center justify-center mr-4">
            <MaterialIcons name="person" size={28} color="white" />
          </View>
          <View>
            <Text className="text-white text-lg font-bold">
              {user?.name || 'User'}
            </Text>
            <Text className="text-white/80 text-sm">
              @{user?.id || 'username'}
            </Text>
          </View>
        </View>

        {/* Info row */}
        <View className="bg-white/10 rounded-lg p-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-white/80 text-sm">Last Active</Text>
            <Text className="text-white text-sm">
              {user?.last_active
                ? new Date(user.last_active).toLocaleDateString()
                : 'Not available'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tombol Sign Out */}
      <Pressable
        className="mt-6 bg-red-500 p-3 rounded-xl shadow-md"
        onPress={handleSignOut}
      >
        <Text className="text-white text-center font-medium">Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Page;

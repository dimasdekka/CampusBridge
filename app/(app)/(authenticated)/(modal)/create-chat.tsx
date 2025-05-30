import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useChatContext } from 'stream-chat-expo';

const Page = () => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const router = useRouter();
  const { client } = useChatContext();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await client.queryUsers({
        $or: [{ role: 'student' }, { role: 'professor' }],
        id: { $ne: client.user!.id },
      });
      setUsers(users.users);
    };
    loadUsers();
  }, []);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) return;

    const randomId = Math.random().toString(36).substring(2, 15);
    const channel = client.channel('messaging', randomId, {
      name: channelName.trim(),
      description: channelDescription.trim(),
      image:
        'https://plus.unsplash.com/premium_photo-1683865775849-b958669dca26?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      members: [{ user_id: client.user!.id, channel_role: 'admin' }],
      channelType: 'messaging',
    });
    channel.create();
    router.dismiss();
  };

  const handleDirectConversation = async (userId: string) => {
    const channel = client.channel(
      'messaging',
      `${client.user!.id}-${userId}`,
      {
        members: [
          { user_id: client.user!.id, channel_role: 'admin' },
          { user_id: userId, channel_role: 'member' },
        ],
        name: client.user!.name,
      }
    );
    await channel.create();
    router.dismiss();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-gray-700 mb-2">Channel Name</Text>
      <TextInput
        value={channelName}
        onChangeText={setChannelName}
        placeholder="Enter channel name"
        className="border border-gray-300 rounded-lg p-3 mb-6"
      />
      <Text className="text-gray-700 mb-2">Description</Text>
      <TextInput
        value={channelDescription}
        onChangeText={setChannelDescription}
        placeholder="Enter channel description"
        multiline={true}
        numberOfLines={3}
        className="border border-gray-300 rounded-lg p-3 mb-6 min-h-[80px]"
      />
      <TouchableOpacity
        onPress={handleCreateChannel}
        className={`rounded-lg p-4 ${
          channelName.trim() && channelDescription.trim()
            ? 'bg-blue-500'
            : 'bg-gray-300'
        }`}
        disabled={!channelName.trim() || !channelDescription.trim()}
      >
        <Text className="text-white text-center font-semibold">
          Create Channel
        </Text>
      </TouchableOpacity>

      <View className="my-8 flex-row items-center">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <Text className="text-gray-700 mb-4">Start a direct conversation</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isProfessor = item.role === 'professor';

          return (
            <TouchableOpacity
              onPress={() => handleDirectConversation(item.id)}
              className={`flex-row items-center p-4 mb-2 rounded-lg ${
                isProfessor ? 'bg-purple-100' : 'bg-green-100'
              }`}
            >
              <Text className="text-xl mr-3">{isProfessor ? '👩‍🏫' : '🧑‍🎓'}</Text>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">{item.name}</Text>
                <Text className="text-xs text-gray-600">
                  {isProfessor ? 'Dosen' : 'Mahasiswa'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Page;

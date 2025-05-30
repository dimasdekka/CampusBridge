import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useChatContext } from 'stream-chat-expo';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client } = useChatContext();
  const channel = client.channel('messaging', id);
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const loadUsers = async () => {
      const userQuery = await client.queryUsers({ role: 'student' });
      const channelUsers = await channel.queryMembers({});

      const userList = userQuery.users.map((user) => {
        const isInChannel = channelUsers.members.some(
          (member) => member.user?.id === user.id
        );
        return {
          ...user,
          isInChannel,
        };
      });
      setUsers(userList);
    };
    loadUsers();
  }, []);

  // tambah user ke channel
  const addUserToChannel = async (userId: string) => {
    await channel.addMembers([userId], {
      text: 'Welcome a new member!',
    });
    Alert.alert('User added to channel');
  };

  // hapus user dari channel
  const removeUserFromChannel = async (userId: string) => {
    await channel.removeMembers([userId]);
    Alert.alert('User removed from channel');
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg text-gray-800 dark:text-white">
              {item.name}
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => addUserToChannel(item.id)}
                disabled={item.isInChannel}
                className={`px-4 py-2 rounded-lg ${
                  item.isInChannel ? 'bg-gray-500' : 'bg-blue-500'
                }`}
              >
                <Text className="text-white">Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeUserFromChannel(item.id)}
                disabled={!item.isInChannel}
                className={`px-4 py-2 rounded-lg ${
                  item.isInChannel ? 'bg-red-500' : 'bg-gray-500'
                }`}
              >
                <Text className="text-white">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default Page;

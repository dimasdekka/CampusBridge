import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';

const StudentAvatars = () => {
  const { client } = useChatContext();
  const [users, setUsers] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const loadUsers = async () => {
      if (!client) return;

      // Query user dengan role student atau professor
      const res = await client.queryUsers({
        $or: [{ role: 'student' }, { role: 'professor' }],
      });

      if (!client.user) return;

      // Filter agar tidak menampilkan user yang sedang login
      setUsers(res.users.filter((u: any) => u.id !== client.user!.id));
    };
    loadUsers();
  }, [client]);

  // Function untuk mendapatkan inisial dari nama
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function untuk menentukan warna text inisial yang kontras dengan background
  const getTextColor = (isProfessor: boolean) => {
    // Warna text yang kontras dengan background
    return isProfessor ? '#9333EA' : '#16A34A'; // Ungu tua untuk dosen, hijau tua untuk mahasiswa
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{
        paddingVertical: 8,
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      {users.map((user) => {
        const isProfessor = user.role === 'professor';
        const emoji = isProfessor ? '👩‍🏫' : '🧑‍🎓';
        const cardBackground = isProfessor ? 'bg-purple-100' : 'bg-green-100';
        const textColor = getTextColor(isProfessor);
        const roleText = isProfessor ? 'Dosen' : 'Mahasiswa';
        const avatarBorderColor = isProfessor
          ? 'border-purple-300'
          : 'border-green-300';

        return (
          <TouchableOpacity
            key={user.id}
            onPress={async () => {
              if (!client.user) return;

              // Membuat channel chat unik berdasarkan id user yang diurutkan
              const channelId = [client.user.id, user.id].sort().join('-');
              const channel = client.channel('messaging', channelId, {
                members: [client.user.id, user.id],
              });

              await channel.create();

              // Navigasi ke halaman chat dengan id channel
              router.push(`/chat/${channel.id}`);
            }}
            className={`${cardBackground} py-3 px-2 rounded-xl items-center w-28 shadow`}
          >
            <Text className="text-2xl">{emoji}</Text>

            {user.image ? (
              <Image
                source={{
                  uri: user.image,
                }}
                className="w-14 h-14 rounded-full my-2 border-2 border-white"
              />
            ) : (
              <View
                className={`w-14 h-14 rounded-full my-2 items-center justify-center border-2 ${avatarBorderColor} bg-white`}
              >
                <Text
                  style={{ color: textColor }}
                  className="text-lg font-bold"
                >
                  {getInitials(user.name || user.id)}
                </Text>
              </View>
            )}

            <View className="w-full">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-sm font-bold text-center text-gray-900"
              >
                {user.name || user.id}
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-1">
                {roleText}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default StudentAvatars;

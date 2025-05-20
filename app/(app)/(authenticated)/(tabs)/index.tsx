import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  useSupervisions,
  SupervisionStatus,
} from '@/providers/SupervisionProvider';
import { Supervision } from '@/providers/SupervisionProvider';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';
import { useChatContext } from 'stream-chat-expo';

const StudentAvatars = () => {
  const { client } = useChatContext();
  const [students, setStudents] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const loadStudents = async () => {
      const res = await client.queryUsers({ role: 'student' });
      if (!client.user) return;
      setStudents(res.users.filter((u: any) => u.id !== client.user!.id));
    };
    loadStudents();
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexDirection: 'row', gap: 16 }}
    >
      {students.map((student) => (
        <TouchableOpacity
          key={student.id}
          style={{ alignItems: 'center', marginRight: 16 }}
          onPress={async () => {
            if (!client.user) return;
            const channelId = [client.user.id, student.id].sort().join('-');
            const channel = client.channel('messaging', channelId, {
              members: [client.user.id, student.id],
            });
            await channel.create();
            router.push(`/chat/${channel.id}`);
          }}
        >
          <Image
            source={{
              uri:
                student.image ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(student.name || student.id),
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#e5e7eb',
            }}
          />
          <Text
            style={{
              fontSize: 12,
              marginTop: 4,
              maxWidth: 60,
              textAlign: 'center',
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {student.name || student.id}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const Page = () => {
  const { getSupervisions, updateSupervision } = useSupervisions();
  const [supervisions, setSupervisions] = useState<Supervision[]>([]);
  const { isProfessor } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadSupervisions();
    }, [])
  );

  const loadSupervisions = async () => {
    const data = await getSupervisions();
    setSupervisions(data);
  };

  const confirmSession = async (id: string) => {
    const updated = await updateSupervision(id, {
      status: SupervisionStatus.Confirmed,
    });
    setSupervisions(
      supervisions.map((item) =>
        item.id === id ? { ...item, status: updated.status } : item
      )
    );
  };

  const cancelSession = async (id: string) => {
    const updated = await updateSupervision(id, {
      status: SupervisionStatus.Cancelled,
    });
    setSupervisions(
      supervisions.map((item) =>
        item.id === id ? { ...item, status: updated.status } : item
      )
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {!isProfessor && (
        <FlatList
          data={supervisions}
          onRefresh={loadSupervisions}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          ListHeaderComponent={() => (
            <View className="flex-row gap-4 mb-6">
              {/* Action Cards */}
              <Link href="/consultation/schedule" asChild>
                <TouchableOpacity className="flex-1 bg-blue-600 rounded-2xl p-4 items-start">
                  <MaterialIcons
                    name="calendar-today"
                    size={32}
                    color="white"
                  />
                  <Text className="text-white text-lg font-bold mt-2">
                    Book Supervision
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Schedule your next session
                  </Text>
                </TouchableOpacity>
              </Link>

              <Link href="/(app)/(authenticated)/(modal)/create-chat" asChild>
                <TouchableOpacity className="flex-1 bg-purple-600 rounded-2xl p-4 items-start">
                  <MaterialIcons name="chat" size={32} color="white" />
                  <Text className="text-white text-lg font-bold mt-2">
                    Make a Group
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Connect with groups of student
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          renderItem={({ item }) => (
            <Link href={`/consultation/${item.id}`} asChild>
              <TouchableOpacity
                className={`border-l-4 pl-3 py-2 ${
                  item.status === SupervisionStatus.Confirmed
                    ? 'border-green-500'
                    : item.status === SupervisionStatus.Pending
                    ? 'border-yellow-500'
                    : item.status === SupervisionStatus.Cancelled
                    ? 'border-red-500'
                    : 'border-gray-500'
                }`}
              >
                <Text className="font-semibold">
                  {item.status === SupervisionStatus.Confirmed
                    ? 'Confirmed Session'
                    : item.status === SupervisionStatus.Pending
                    ? 'Pending Session'
                    : item.status === SupervisionStatus.Cancelled
                    ? 'Cancelled Session'
                    : 'Completed Session'}
                </Text>
                <Text className="text-gray-600">
                  {new Date(item.dateTime).toLocaleString()}
                </Text>
                <Text className="text-gray-600">
                  Professor: {item.professorName || item.professorId}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
          ListEmptyComponent={() => (
            <View className="border-l-4 border-sky-500 pl-3 py-2">
              <Text className="font-semibold">No supervisions</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={{ marginTop: 16, marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 8,
                  color: '#374151',
                }}
              >
                Chat with Other Students
              </Text>
              <StudentAvatars />
            </View>
          )}
          contentContainerClassName=""
        />
      )}

      {isProfessor && (
        <FlatList
          data={supervisions}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onRefresh={loadSupervisions}
          refreshing={refreshing}
          ListHeaderComponent={() => (
            <View className="mb-4">
              <Text className="text-xl font-bold">Upcoming Supervisions</Text>
              <Text className="text-gray-600">
                Manage your scheduled sessions
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center">
                <View>
                  <View className="flex-row items-center">
                    {item.status === SupervisionStatus.Pending && (
                      <Ionicons name="time-outline" size={24} color="#6B7280" />
                    )}
                    {item.status === SupervisionStatus.Confirmed && (
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="#059669"
                      />
                    )}
                    {item.status === SupervisionStatus.Cancelled && (
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color="#DC2626"
                      />
                    )}
                    {item.status === SupervisionStatus.Completed && (
                      <Ionicons
                        name="checkmark-done-circle-outline"
                        size={24}
                        color="#1D4ED8"
                      />
                    )}
                    <Text className="font-semibold text-lg ml-2">
                      {item.status}
                    </Text>
                  </View>
                  <Text className="text-gray-600">
                    {new Date(item.dateTime).toLocaleString()}
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    Student:{' '}
                    {item.studentName || item.studentEmail || item.studentId}
                  </Text>
                </View>
                {item.status === SupervisionStatus.Pending && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="bg-blue-600 px-4 py-2 rounded-lg"
                      onPress={() => confirmSession(item.id)}
                    >
                      <Text className="text-white font-medium">Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-600 px-4 py-2 rounded-lg"
                      onPress={() => cancelSession(item.id)}
                    >
                      <Text className="text-white font-medium">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === SupervisionStatus.Confirmed && (
                  <Link href={`/consultation/${item.id}`} asChild>
                    <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                      <Text className="text-white font-medium">
                        Enter Session
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="bg-gray-50 rounded-lg p-6 items-center">
              <Text className="font-semibold text-lg text-center">
                No upcoming supervisions
              </Text>
              <Text className="text-gray-600 text-center mt-1">
                Your schedule is clear for now
              </Text>
            </View>
          )}
          contentContainerClassName="gap-4"
        />
      )}
    </View>
  );
};

export default Page;

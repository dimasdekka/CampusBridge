import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  useSupervisions,
  SupervisionStatus,
} from '@/providers/SupervisionProvider';
import { Supervision } from '@/providers/SupervisionProvider';
import { useAuth } from '@/providers/AuthProvider';
import React from 'react';
import StudentAvatars from '@/components/StudentAvatar';
import ActionCards from '@/components/ActionCard'; // Import ActionCards component

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

  const renderSupervisionItem = ({ item }: { item: Supervision }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return isProfessor ? (
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
              <Text className="font-semibold text-lg ml-2">{item.status}</Text>
            </View>
            <Text className="text-gray-600">{formatDate(item.dateTime)}</Text>
            <Text className="text-gray-700 mt-1">
              Student: {item.studentName || item.studentEmail || item.studentId}
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
                <Text className="text-white font-medium">Enter Session</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <Link href={`/consultation/${item.id}`} asChild>
        <TouchableOpacity
          className={`bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 ${
            item.status === SupervisionStatus.Confirmed
              ? 'border-green-500'
              : item.status === SupervisionStatus.Pending
              ? 'border-yellow-500'
              : item.status === SupervisionStatus.Cancelled
              ? 'border-red-500'
              : 'border-gray-500'
          }`}
        >
          <View className="flex-row justify-between">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                {item.status === SupervisionStatus.Pending && (
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#F59E0B"
                    className="mr-1"
                  />
                )}
                {item.status === SupervisionStatus.Confirmed && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#10B981"
                    className="mr-1"
                  />
                )}
                {item.status === SupervisionStatus.Cancelled && (
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="#EF4444"
                    className="mr-1"
                  />
                )}
                {item.status === SupervisionStatus.Completed && (
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={18}
                    color="#3B82F6"
                    className="mr-1"
                  />
                )}
                <Text className="font-semibold text-base ml-1">
                  {item.status === SupervisionStatus.Confirmed
                    ? 'Confirmed Session'
                    : item.status === SupervisionStatus.Pending
                    ? 'Pending Session'
                    : item.status === SupervisionStatus.Cancelled
                    ? 'Cancelled Session'
                    : 'Completed Session'}
                </Text>
              </View>
              <Text className="text-gray-700 mb-1">
                {formatDate(item.dateTime)}
              </Text>
              <Text className="text-gray-600">
                Professor: {item.professorName || item.professorId}
              </Text>
            </View>
            <View className="justify-center">
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#6B7280"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
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
            <View className="mb-6">
              {/* Menggunakan ActionCards component */}
              <ActionCards />

              <Text className="text-lg font-bold mt-6 mb-3 text-gray-800">
                Your Sessions
              </Text>
            </View>
          )}
          renderItem={renderSupervisionItem}
          ListEmptyComponent={() => (
            <View className="bg-white rounded-lg p-6 items-center border border-gray-100 shadow-sm">
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text className="font-semibold text-lg text-center mt-2">
                No supervisions scheduled
              </Text>
              <Text className="text-gray-600 text-center mt-1">
                Book a session with your professor
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View className="mt-6 mb-6">
              <Text className="text-lg font-bold mb-3 text-gray-800">
                Chat with Others
              </Text>
              <StudentAvatars />
            </View>
          )}
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
          renderItem={renderSupervisionItem}
          ListEmptyComponent={() => (
            <View className="bg-white rounded-lg p-6 items-center border border-gray-100 shadow-sm">
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text className="font-semibold text-lg text-center mt-2">
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

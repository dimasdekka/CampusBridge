import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const Home = () => {
  return (
    <ScrollView className="p-4">
      <Link href={'/consultation/schedule'}>
        <Text className="text-blue-500 text-lg font-bold mb-4">
          Schedule a Supervision
        </Text>
      </Link>
      <Link href={'/(app)/(authenticated)/(modal)/create-chat'}>
        <Text className="text-blue-500 text-lg font-bold mb-4">
          Create Chat
        </Text>
      </Link>

      <Text className="text-2xl font-bold mb-4">Chats</Text>
      {Array.from({ length: 10 }, (_, index) => (
        <View
          key={index}
          className="flex-row items-center bg-white p-4 mb-3 rounded-lg shadow-sm"
        >
          <View className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              Chat User {index + 1}
            </Text>
            <Text className="text-sm text-gray-600">
              Last message preview goes here...
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Home;

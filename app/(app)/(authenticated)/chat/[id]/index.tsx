import { useAuth } from '@/providers/AuthProvider';
import { selectedChannelAtom, selectedThreadAtom } from '@/utils/atoms';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from 'stream-chat-expo';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client } = useChatContext();
  const channel = client.channel('messaging', id);
  const { isProfessor } = useAuth();
  const [selectedThread, setSelectedThread] = useAtom(selectedThreadAtom);
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const router = useRouter();

  if (!channel) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Handle thread selection through atoms
  const handleThreadSelect = (thread: any) => {
    setSelectedThread(thread);
    setSelectedChannel(channel);
    router.push(`/chat/${id}/thread`);
  };

  return (
    <View className="flex-1 pb-safe bg-white">
      <Stack.Screen
        options={{
          title: channel?.data?.name || 'Chat',
          headerRight: () => (
            <>
              {isProfessor && (
                <Link href={`/chat/${id}/manage`}>
                  <Text>Manage</Text>
                </Link>
              )}
            </>
          ),
        }}
      />

      <Channel channel={channel}>
        {/* buat custom message UI: MessageSimple={AnonymousMessage} */}
        <MessageList onThreadSelect={handleThreadSelect} />
        <MessageInput />
      </Channel>
    </View>
  );
};
export default Page;

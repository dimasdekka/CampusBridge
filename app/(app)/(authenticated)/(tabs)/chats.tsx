import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  ChannelList,
  ChannelPreviewMessenger,
  useChatContext,
} from 'stream-chat-expo';

const Page = () => {
  const router = useRouter();
  const { client } = useChatContext();

  const filter = {
    members: {
      $in: [client.user!.id],
    },
  };

  const options = {
    presence: true,
    state: true,
    watch: true,
  };

  const CustomListItem = (props: any) => {
    const { unread } = props;
    const backgroundColor = unread ? 'bg-blue-100' : 'bg-white';

    return (
      <View className={`${backgroundColor}`}>
        <ChannelPreviewMessenger {...props} />
      </View>
    );
  };

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <Link href="/(app)/(authenticated)/(modal)/create-chat" asChild>
                <TouchableOpacity className="mr-4">
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </Link>
            </>
          ),
        }}
      />
      <ChannelList
        filters={filter}
        options={options}
        onSelect={(channel) =>
          router.push(`/(app)/(authenticated)/chat/${channel.id}`)
        }
        Preview={CustomListItem}
      />
    </View>
  );
};
export default Page;

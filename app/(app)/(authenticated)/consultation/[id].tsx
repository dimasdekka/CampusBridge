import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallingState,
  CallContent,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { CustomCallControls } from '@/components/CustomCallControls';
import { useAuth } from '@/providers/AuthProvider';
import { PermissionsAndroid } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Page = () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const navigation = useNavigation();
  const router = useRouter();
  const client = useStreamVideoClient();
  const { isProfessor } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
      title: `Consultation #${id}`,
    });
  }, []);

  useEffect(() => {
    const _call = client?.call('default', id as string);
    if (!_call) return;
    setCall(_call);

    _call.join({ create: true }).then(async () => {
      if (isProfessor) {
        try {
          await _call.startRecording();
          await _call.startTranscription();
        } catch (err) {
          console.error('Failed to start recording/transcription:', err);
        }
      }
    });
  }, [client, id]);

  useEffect(() => {
    if (!call || !isProfessor) return;
    if (call.state.callingState === CallingState.JOINED) {
      call.startRecording();
      call.startTranscription();
    }
  }, [call, call?.state.callingState, isProfessor]);

  useEffect(() => {
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave();
      }
    };
  }, [call]);

  if (!call) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-700">
          Session has not started yet...
        </Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <View className="flex-1">
        <CallContent
          layout="spotlight"
          onHangupCallHandler={() => {
            call?.stopRecording();
            call?.stopTranscription();
            call?.leave();
            router.back();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
};
export default Page;

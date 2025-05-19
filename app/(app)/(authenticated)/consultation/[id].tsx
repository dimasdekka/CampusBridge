import {
  Call,
  StreamCall,
  useStreamVideoClient,
  CallingState,
  CallContent,
} from '@stream-io/video-react-native-sdk';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Text } from 'react-native';
import { CustomCallControls } from '@/components/CustomCallControls';
import { useAuth } from '@/providers/AuthProvider';
import { PermissionsAndroid } from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Page = () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const navigation = useNavigation();
  const client = useStreamVideoClient();
  const { isProfessor } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back',
      title: `Consultation #${id}`,
    });
  }, []);

  useEffect(() => {
    const setupCall = async () => {
      const _call = client?.call('default', id as string);
      if (!_call) return;

      await _call.join({ create: true });
      setCall(_call);

      // Hanya profesor yang mulai recording dan transcription
      if (isProfessor) {
        const unsubscribe = _call.on('call.updated', async () => {
          if (_call.state.callingState === CallingState.JOINED) {
            try {
              await _call.startRecording();
              await _call.startTranscription();
              console.log('Recording & transcription started');
            } catch (err) {
              console.warn('Failed to start recording or transcription', err);
            }
          }
        });

        return () => unsubscribe?.();
      }
    };

    setupCall();
  }, [client, id]);

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
            if (isProfessor) {
              call?.stopRecording();
              call?.stopTranscription();
            }
            call?.leave();
          }}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
  );
};

export default Page;

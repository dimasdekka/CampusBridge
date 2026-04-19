import { useAuth } from '@/providers/AuthProvider';
import {
  CallControlProps,
  HangUpCallButton,
  ReactionsButton,
  ToggleCameraFaceButton,
  ToggleAudioPublishingButton as ToggleMic,
} from '@stream-io/video-react-native-sdk';

import { View } from 'react-native';

export const CustomCallControls = (props: CallControlProps) => {
  const { isProfessor } = useAuth();

  return (
    <View className="absolute bottom-10 py-4 w-4/5 mx-5 flex-row self-center justify-around rounded-[10px] border-5 border-blue-500 bg-blue-800 z-5">
      <ToggleMic />
      <ToggleCameraFaceButton />
      {!isProfessor && <ReactionsButton />}
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
};

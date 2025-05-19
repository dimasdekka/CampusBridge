import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Supervision, useSupervisions } from '@/providers/SupervisionProvider';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useVideoPlayer, VideoView } from 'expo-video';

interface TranscriptEntry {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
}

interface SupervisionInfo extends Supervision {
  recordings?: any;
  transcriptions?: any;
}

const Page = () => {
  const { isProfessor } = useAuth();
  const { getSupervisions } = useSupervisions();
  const [appointments, setAppointments] = useState<SupervisionInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const client = useStreamVideoClient();
  const player = useVideoPlayer(null);
  const videoRef = useRef<VideoView>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [transcriptData, setTranscriptData] = useState<TranscriptEntry[]>([]);
  const [currentAppointment, setCurrentAppointment] =
    useState<SupervisionInfo | null>(null);

  if (!isProfessor) {
    return (
      <View>
        <Text>You are not a professor</Text>
      </View>
    );
  }

  useEffect(() => {
    loadAppointmenets();
  }, []);

  const loadAppointmenets = async () => {
    const supervision = await getSupervisions();
    setSupervisionInfo(supervision);
  };

  const setSupervisionInfo = async (supervision: SupervisionInfo[]) => {
    await Promise.all(
      supervision.map(async (sv) => {
        try {
          const _call = client?.call('default', sv.id as string);
          if (!_call) return {};
          const recordingsQuery = await _call?.queryRecordings();
          const transcriptionQuery = await _call?.queryTranscriptions();
          sv.recordings = recordingsQuery?.recordings;
          sv.transcriptions = transcriptionQuery?.transcriptions;
        } catch (error) {
          console.error('Error fetching recordings:', error);
          sv.recordings = [];
          sv.transcriptions = [];
        }
      })
    );
    setAppointments(appointments);
  };

  const playVideo = (url: string) => {
    player.replace(url);
    setPlayerVisible(true);
    player.play();
  };

  const showTranscription = async (
    url: string,
    supervision: SupervisionInfo
  ) => {
    try {
      const response = await fetch(url);
      const text = await response.text();

      // Parse JSONL format
      const entries = text
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line));
      setTranscriptData(entries);
      setCurrentAppointment(supervision);
      setTranscriptVisible(true);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  };

  return (
    <View className="flex-1">
      {playerVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            backgroundColor: 'black',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              player.pause();
              setPlayerVisible(false);
            }}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 51,
              padding: 8,
            }}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>×</Text>
          </TouchableOpacity>
          <VideoView
            allowsPictureInPicture
            allowsFullscreen
            player={player}
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      )}

      {transcriptVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            backgroundColor: 'white',
          }}
        >
          <View className="flex-1 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold">Transcript</Text>
              <TouchableOpacity
                onPress={() => setTranscriptVisible(false)}
                className="p-2"
              >
                <Text className="text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {transcriptData.map((entry, index) => (
                <View key={index} className="mb-4">
                  <Text className="font-medium mb-1">
                    {entry.speaker_id === currentAppointment?.professorId
                      ? 'Professor'
                      : 'Student'}
                    :
                  </Text>
                  <Text className="text-gray-700">{entry.text}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {new Date(entry.start_ts).toISOString().substring(11, 8)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <FlatList
        className="flex-1 bg-gray-50"
        data={appointments}
        contentContainerClassName="p-4"
        renderItem={({ item: sv }) => (
          <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
            <View className="border-b border-gray-200 pb-2 mb-3">
              <Text className="text-lg font-semibold">{sv.studentEmail}</Text>
              <Text className="text-gray-600">
                {new Date(sv.dateTime).toLocaleString()}
              </Text>
            </View>

            {sv.recordings && sv.recordings.length > 0 ? (
              <View className="mb-3">
                <Text className="font-medium mb-2">Recordings</Text>
                {sv.recordings.map((recording: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-50 py-2 rounded mb-2"
                    onPress={() => playVideo(recording.url)}
                  >
                    <Text className="text-blue-600 text-sm">
                      {recording.filename}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 mb-3">
                No recordings available
              </Text>
            )}

            {sv.transcriptions && sv.transcriptions.length > 0 ? (
              <View>
                <Text className="font-medium mb-2">Transcriptions</Text>
                {sv.transcriptions.map((transcription: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    className="bg-gray-50 p-2 rounded mb-2"
                    onPress={() => showTranscription(transcription.url, sv)}
                  >
                    <Text className="text-blue-600 text-sm">
                      {transcription.filename}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500">No transcriptions available</Text>
            )}
          </View>
        )}
        onRefresh={loadAppointmenets}
        refreshing={refreshing}
      />
    </View>
  );
};
export default Page;

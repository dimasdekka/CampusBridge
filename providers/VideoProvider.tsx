// VideoProvider.tsx
// Provider ini mengintegrasikan fitur Stream Video ke dalam aplikasi.
// Provider ini mengelola koneksi ke layanan video Stream, menangani autentikasi user,
// dan menyediakan video client ke komponen anak untuk fitur video call.

import { useAuth } from '@/providers/AuthProvider';
import {
  StreamVideoClient,
  StreamVideo,
} from '@stream-io/video-react-native-sdk';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Mengambil Stream API key dari environment variable
const apiKey = process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string;

// Komponen provider yang menginisialisasi dan mengelola koneksi Stream Video
// Menghubungkan user saat ini ke Stream Video menggunakan detail autentikasi mereka
export default function VideoProvider({ children }: PropsWithChildren) {
  // State untuk menyimpan instance Stream Video client
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  // Ambil state autentikasi dari AuthProvider
  const { authState } = useAuth();

  // Inisialisasi dan koneksi ke Stream Video saat user terautentikasi
  useEffect(() => {
    // Lewati jika auth state belum tersedia
    if (!authState) {
      return;
    }

    // Inisialisasi Stream Video client dengan kredensial user saat ini
    const initVideoClient = async () => {
      const user = {
        id: authState.user_id!,
        name: authState.email!,
      };

      const client = new StreamVideoClient({
        apiKey,
        token: authState.token!,
        user,
      });
      setVideoClient(client);
    };

    initVideoClient();

    // Cleanup: disconnect user saat komponen unmount atau auth berubah
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [authState?.authenticated]);

  // Tampilkan indikator loading saat masih konek ke Stream Video
  if (!videoClient) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Berikan konteks Stream Video ke komponen anak
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

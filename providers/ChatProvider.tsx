// Provider ini mengintegrasikan fitur Stream Chat ke dalam aplikasi.
// Provider ini mengelola koneksi ke layanan chat Stream, menangani autentikasi user,
// dan menyediakan chat client ke komponen anak.
import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from './AuthProvider';

// Inisialisasi Stream Chat client dengan API key dari environment variables
const client = StreamChat.getInstance(
  process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY as string
);

// Konfigurasi tema custom untuk komponen UI Stream Chat
// Supaya channel preview punya background transparan biar cocok sama styling aplikasi
const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
    },
  },
};

// Komponen Provider yang mengatur koneksi Stream Chat
// Menghubungkan user saat ini ke Stream Chat pakai detail autentikasi mereka
export default function ChatProvider({ children }: PropsWithChildren) {
  // State untuk melacak apakah chat client sudah siap (terhubung)
  const [isReady, setIsReady] = useState(false);
  // Ambil state autentikasi dari AuthProvider
  const { authState } = useAuth();

  useEffect(() => {
    console.log('Auth state:', authState);
  }, [authState]);

  // Koneksi ke Stream Chat saat user sudah terautentikasi
  useEffect(() => {
    // Kalau user belum login, skip aja
    if (!authState?.authenticated) {
      return;
    }

    // Fungsi untuk menghubungkan user ke Stream Chat pakai ID dan token mereka
    const connectUser = async () => {
      await client.connectUser(
        {
          id: authState.user_id!,
          name: authState.email!,
          role: authState.role!,
        },
        authState.token!
      );
      setIsReady(true);
    };

    connectUser();

    // Cleanup: disconnect user kalau komponen unmount
    // atau kalau state autentikasi berubah
    return () => {
      if (isReady) {
        client.disconnectUser();
      }
      setIsReady(false);
    };
  }, [authState?.authenticated]);

  // Tampilkan indikator loading saat masih konek ke Stream Chat
  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  // Berikan konteks Stream Chat ke komponen anak
  return (
    <OverlayProvider value={{ style: chatTheme }}>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}

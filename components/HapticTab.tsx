// Komponen ini bikin tombol tab di bawah (bottom tab bar) ada getaran kecil pas ditekan.
// Cocok banget buat iOS biar kerasa lebih smooth dan responsif.
// Tapi kalau mau jalan di Android juga bisa, tinggal sesuain aja.

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Komponen ini nambahin efek getar halus waktu tab ditekan.
// Bisa dipake buat ganti tombol default tab di navigasi bawah.
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Ini ngasih efek haptic feedback ringan tiap kali diteken (berlaku buat iOS & Android)
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Tetap jalankan fungsi asli kalau ada
        props.onPressIn?.(ev);
      }}
    />
  );
}

// Komponen ini dipake buat bikin tampilan background tab bar di iOS jadi lebih keren.
// Pakai efek blur biar keliatan kayak tampilan native iPhone, nyatu sama sistem.

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Komponen buat nampilin efek blur di background tab bar
// Otomatis ngikutin tema sistem (dark/light) biar keliatan native iOS banget
export function BlurTabBarBackground() {
  return (
    <BlurView
      // Pakai efek blur bawaan sistem (systemChromeMaterial)
      // Jadi tampilan tab bar-nya nyatu banget sama UI iOS
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

// Hook custom buat dapetin sisa tinggi dari tab bar yang ga ketutup safe area
// Biasanya dipake buat ngatur posisi konten biar ga kepotong sama tab bar
export function useBottomTabOverflow() {
  let tabHeight = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    tabHeight = useBottomTabBarHeight();
  } catch {}
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}

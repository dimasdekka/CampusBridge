const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const path = require('path');

const config = getDefaultConfig(__dirname);

// Mock native-only libraries on 'web' platform
const mockLibs = [
  'stream-chat-expo',
  '@stream-io/video-react-native-sdk',
  'react-native-webrtc',
  'react-native-incall-manager',
  '@notifee/react-native',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && mockLibs.some(lib => moduleName.startsWith(lib))) {
    return {
      filePath: path.resolve(__dirname, 'emptyMock.js'),
      type: 'sourceFile',
    };
  }
  // Standard resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });

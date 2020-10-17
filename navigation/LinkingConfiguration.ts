import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              CameraScreen: 'camera',
              CaptureScreen: 'capture',
            },
          },
          TabTwo: {
            screens: {
              FilesScreen: 'two',
            },
          },
          TabThree: {
            screens: {
              FilesScreen: 'three',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};

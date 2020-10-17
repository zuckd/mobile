import { ImageResult } from "expo-image-manipulator";

export type RootStackParamList = {
  Onboarding: undefined;
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Camera: undefined;
  Files: undefined;
  Settings: undefined;
};

export type TabCameraParamList = {
  CameraScreen: undefined
  CaptureScreen: {image: ImageResult}
};

export type TabTwoParamList = {
  FilesScreen: undefined;
};

export type TabThreeParamList = {
  SettingsScreen: undefined;
};

export type OnboardingParamList = {
  StartScreen: undefined,
  LoginScreen: undefined,
  RegisterScreen: undefined,
  RegisterFaceScreen: undefined,
  TrainingScreen: {imageOrigin: ImageResult, imageLeft: ImageResult, imageRight: ImageResult},
}
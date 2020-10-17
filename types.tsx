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
  TabTwoScreen: undefined;
};

export type TabThreeParamList = {
  SettingsScreen: undefined;
};

export type OnboardingParamList = {
  StartStack: undefined,
  LoginStack: undefined,
  RegisterStack: undefined,
  RegisterFaceStack: undefined,
}
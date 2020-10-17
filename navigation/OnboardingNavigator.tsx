import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { OnboardingParamList } from '../types';
import StartScreen from '../screens/onboarding/OnboardScreen';
import RegisterScreen from '../screens/onboarding/RegisterScreen';
import RegisterFaceScreen from '../screens/onboarding/RegisterFaceScreen';
import TrainingScreen from '../screens/onboarding/Training';

const OnboardingStack = createStackNavigator<OnboardingParamList>();

const OnboardingStackNavigator = () => {
  const colorScheme = useColorScheme()

  return (
    <OnboardingStack.Navigator
      initialRouteName="RegisterFaceScreen"
    >
        <OnboardingStack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{headerShown: false}}
        />
        <OnboardingStack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <OnboardingStack.Screen
          name="RegisterFaceScreen"
          component={RegisterFaceScreen}
          options={{headerTitle: "Face"}}
        />
        <OnboardingStack.Screen
          name="TrainingScreen"
          component={TrainingScreen}
          options={{headerShown: false}}
        />
      </OnboardingStack.Navigator>
  )
}

export default OnboardingStackNavigator;
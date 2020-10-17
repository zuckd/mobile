import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { OnboardingParamList } from '../types';
import StartScreen from '../screens/onboarding/OnboardScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import RegisterScreen from '../screens/onboarding/RegisterScreen';

const OnboardingStack = createStackNavigator<OnboardingParamList>();

const OnboardingStackNavigator = () => {
  const colorScheme = useColorScheme()

  return (
    <OnboardingStack.Navigator
      initialRouteName="StartStack"
    >
        <OnboardingStack.Screen
          name="StartStack"
          component={StartScreen}
          options={{headerTitle: "Start"}}
        />
        <OnboardingStack.Screen
          name="LoginStack"
          component={LoginScreen}
          options={{headerTitle: "Login"}}
        />
        <OnboardingStack.Screen
          name="RegisterStack"
          component={RegisterScreen}
          options={{headerTitle: "Register"}}
        />
      </OnboardingStack.Navigator>
  )
}

const RegisterStack = createStackNavigator<RegisterStackParamList>();

const 
export default OnboardingStackNavigator;
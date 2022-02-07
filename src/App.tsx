import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import MirrorScreen from './screens/MirrorScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';
import VoiceCheckinScreen from './screens/VoiceCheckinScreen';
import Screens from './constants/screens';
import {Provider} from 'react-redux';
import store from './store/combinedStore';
import ProfileScreen from './screens/ProfileScreen';
import {
  PartialScreens,
  OnboardingScreens,
} from './screens/partialScreens/index';
import ExplanationScreen from './screens/ExplanationScreen';
import OnboardingScreen from './screens/OnboardingScreen';

export interface OnboardingScreenParams {
  onboardingIndex: keyof typeof OnboardingScreens;
}

export interface ExplanationScreenParams {
  subScreen: keyof typeof PartialScreens;
}

export type MainStackParams = {
  SplashScreen: undefined;
  MirrorScreen: undefined;
  SuggestionsScreen: undefined;
  VoiceCheckinScreen: undefined;
  ProfileScreen: undefined;
  ExplanationScreen: ExplanationScreenParams;
  OnboardingScreen: OnboardingScreenParams;
};

const MainStack = createStackNavigator<MainStackParams>();

export default function App(props: any): JSX.Element {
  console.log(props);
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

const Root: (props: any) => JSX.Element = props => {
  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={Screens.SplashScreen}
        screenOptions={
          {
            headerShown: false,
            detachPreviousScreen: true,
          } as any
        }>
        <MainStack.Screen
          name={Screens.SplashScreen}
          component={SplashScreen}
        />
        <MainStack.Screen
          name={Screens.OnboardingScreen}
          component={OnboardingScreen}
          options={{
            title: 'Profile',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <MainStack.Screen
          name={Screens.MirrorScreen}
          component={MirrorScreen}
        />
        <MainStack.Screen
          name={Screens.SuggestionsScreen}
          component={SuggestionsScreen}
        />
        <MainStack.Screen
          name={Screens.VoiceCheckinScreen}
          component={VoiceCheckinScreen}
        />
        <MainStack.Screen
          name={Screens.ProfileScreen}
          component={ProfileScreen}
        />
        <MainStack.Screen
          name={Screens.ExplanationScreen}
          component={ExplanationScreen}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

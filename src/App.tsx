import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import MirrorScreen from './screens/MirrorScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';
import VoiceCheckinScreen from './screens/VoiceCheckinScreen';
import Screens from './constants/screens';
import {Provider} from 'react-redux';
import store from './store/combinedStore';

export type MainStackParams = {
  SplashScreen: undefined;
  MirrorScreen: undefined;
  SuggestionsScreen: undefined;
  VoiceCheckinScreen: undefined;
};

const MainStack = createStackNavigator<MainStackParams>();

export default function App(props: any): JSX.Element {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

const Root: () => JSX.Element = () => {
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
        <MainStack.Screen name="SplashScreen" component={SplashScreen} />
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
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

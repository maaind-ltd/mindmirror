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
import {setCustomText} from 'react-native-global-props';

import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
} from 'react-native-spotify-remote';

// Api Config object, replace with your own applications client id and urls
const spotifyConfig: ApiConfig = {
  clientID: '00e4806b0bb742a9a187df9ca1ac0a6a',
  redirectURL: 'com.mindmirror://callback',
  tokenRefreshURL: 'http://192.168.1.112:3000/refresh',
  tokenSwapURL: 'http://192.168.1.112:3000/swap',
  showDialog: true,
  authType: 'TOKEN',
  scopes: [ApiScope.AppRemoteControlScope], //, ApiScope.UserFollowReadScope
};

// Initialize the library and connect the Remote
// then play an epic song
async function playEpicSong() {
  try {
    // const session = await SpotifyAuth.authorize(spotifyConfig);
    // await SpotifyRemote.connect(session.accessToken);
    // await SpotifyRemote.playUri('spotify:track:6IA8E2Q5ttcpbuahIejO74');
    // await SpotifyRemote.seek(58000);
  } catch (err) {
    console.error("Couldn't authorize with or connect to Spotify", err);
  }
}

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

const customTextProps = {
  style: {
    fontFamily: 'Raleway',
  },
};

setCustomText(customTextProps);

export default function App(props: any): JSX.Element {
  useEffect(() => {
    playEpicSong();
  }, []);
  console.log(props);
  return (
    <Provider store={store}>
      <Root targetScreen={props.target_screen} />
    </Provider>
  );
}

const Root: (props: {
  targetScreen?: 'voice-check-in';
}) => JSX.Element = props => {
  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={
          props.targetScreen ? Screens.VoiceCheckinScreen : Screens.SplashScreen
        }
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

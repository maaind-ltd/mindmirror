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
import store, {persistor} from './store/combinedStore';
import ProfileScreen from './screens/ProfileScreen';
import {
  PartialScreens,
  OnboardingScreens,
} from './screens/partialScreens/index';
import ExplanationScreen from './screens/ExplanationScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import {setCustomText} from 'react-native-global-props';
import {PersistGate} from 'redux-persist/integration/react';
import {BreathingType, SoundSuggestionType} from './helpers/audio';
import BreathingSuggestionScreen from './screens/BreathingSuggestionScreen';
import SoundSuggestionScreen from './screens/SoundSuggestionScreen';
import {Linking, Platform} from 'react-native';
import {PairingDeepLink} from './constants/urls';
import settingsSlice from './store/settingsSlice';
import moodSlice from './store/moodSlice';
import {fetchHrvData} from './helpers/hrvHelpers';
import {isAndroid} from './helpers/accessoryFunctions';

if (isAndroid) {
  var fontFamily = 'Raleway';
} else {
  var fontFamily = 'Helvetica';
}

export interface OnboardingScreenParams {
  onboardingIndex: keyof typeof OnboardingScreens;
}

export interface ExplanationScreenParams {
  subScreen: keyof typeof PartialScreens;
}

export interface BreathingScreenParams {
  breathingType: BreathingType;
}

export interface SoundScreenParams {
  soundSuggestionType: SoundSuggestionType;
}

export type MainStackParams = {
  SplashScreen: undefined;
  MirrorScreen: undefined;
  SuggestionsScreen: undefined;
  VoiceCheckinScreen: undefined;
  ProfileScreen: undefined;
  ExplanationScreen: ExplanationScreenParams;
  OnboardingScreen: OnboardingScreenParams;
  BreathingSuggestionScreen: BreathingScreenParams;
  SoundSuggestionScreen: SoundScreenParams;
};

const MainStack = createStackNavigator<MainStackParams>();

const customTextProps = {
  style: {
    fontFamily: fontFamily,
  },
};

setCustomText(customTextProps);

export default function App(props: any): JSX.Element {
  useEffect(() => {
    const onPairingCodeReceived = ({url}: {url: string}) => {
      if (url.startsWith(PairingDeepLink)) {
        const pairingCode = url.substring(PairingDeepLink.length+1);
        if (pairingCode) {
          console.log(`Received pairing Code ${pairingCode}`);
          store.dispatch(settingsSlice.actions.setPairingCode(pairingCode));
        } else {
          console.log(`Empty pairing code received.`);
        }
      }
    };
    Linking.addEventListener('url', onPairingCodeReceived);
    return () => {
      Linking.removeListener('url', onPairingCodeReceived);
    };
  }, []);

  useEffect(() => {
    const regularUpdateInterval = setInterval(() => {
      fetchHrvData().finally(() => {
        store.dispatch(moodSlice.actions.recalculateMood());
      });
    }, 60000);
    return () => {
      if (regularUpdateInterval) {
        clearInterval(regularUpdateInterval);
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Root targetScreen={props.target_screen} />
      </PersistGate>
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
        <MainStack.Screen
          name={Screens.BreathingSuggestionScreen}
          component={BreathingSuggestionScreen}
        />
        <MainStack.Screen
          name={Screens.SoundSuggestionScreen}
          component={SoundSuggestionScreen}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

import React, {useEffect, useRef, useState} from 'react';
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
import {NativeModules, AppState, Linking, Platform} from 'react-native';
import {PairingDeepLink} from './constants/urls';
import settingsSlice from './store/settingsSlice';
import moodSlice from './store/moodSlice';
import {fetchHrvData, updateHeartRatesApple} from './helpers/hrvHelpers';
import {isAndroid} from './helpers/accessoryFunctions';
import Smartlook from 'smartlook-react-native-wrapper';
import {SmartlookKey} from './constants/keys';
import BackgroundFetch from "react-native-background-fetch";
const UniqueIdModule = NativeModules.UniqueIdModule;


Smartlook.setupAndStartRecording(SmartlookKey);

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

 // Add a BackgroundFetch event to <FlatList>
 function addEvent(taskId) {
  // Simulate a possibly long-running asynchronous task with a Promise.
  return new Promise<void>(async (resolve, reject) => {
    updateHeartRatesApple();
    resolve();
  });
}

async function initBackgroundFetch() {
  // BackgroundFetch event handler.
  const onEvent = async (taskId) => {
    console.log('[BackgroundFetch] task: ', taskId);
    // Do your background work...
    await addEvent(taskId);
    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  }

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
  const onTimeout = async (taskId) => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  }

  // Initialize BackgroundFetch only once when component mounts.
  let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

  console.log('[BackgroundFetch] configure status: ', status);
}

export default function App(props: any): JSX.Element {
  useEffect(() => {
    
    // initialize the background fetch only once on app start
    initBackgroundFetch();

    // separately call the updateHeartRatesApple every 10 seconds when the app is in the foreground

    const interval = setInterval(() => {
      updateHeartRatesApple();
    }, 10000);

    const onPairingCodeReceived = ({url}: {url: string}) => {
      console.log('===> url = ', url);
      if (url.startsWith(PairingDeepLink)) {
        const pairingCode = url.substring(PairingDeepLink.length + 1);
        if (pairingCode) {
          console.log(`Received pairing Code ${pairingCode}`);
          store.dispatch(settingsSlice.actions.setPairingCode(pairingCode));
        } else {
          console.log(`Empty pairing code received.`);
        }
      }
    };
    console.log('Adding event listener for the pairing request for Fitbit!');
    Linking.addEventListener('url', onPairingCodeReceived);
    return () => {
      clearInterval(interval);
      Linking.removeListener('url', onPairingCodeReceived);
    };
  }, []);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
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

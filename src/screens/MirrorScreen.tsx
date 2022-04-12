import React, {useEffect} from 'react';
import {StatusBar, Pressable, NativeModules} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import WigglyLineContainer from '../components/WigglyLineContainer';
import {EmotionStateWithNone} from '../constants/emotionState';
import Screens from '../constants/screens';
import store, {getTypedState, useAppDispatch, useStackNavigation, useCombinedStore} from '../store/combinedStore';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import moodSlice from '../store/moodSlice';
import Icons from '../constants/icons';
import MoodButtonList from '../components/MoodButtonList';
import notifee, {EventType} from '@notifee/react-native';
import { FullPageContainer } from '../components/FullPageContainer';
import { UrlReceiveHR } from '../constants/urls';
import {isAndroid} from '../helpers/accessoryFunctions';

const SharedStorage = NativeModules.SharedStorage;
const UniqueIdModule = NativeModules.UniqueIdModule;

const NAVIGATION_TIMEOUT = 600;

const nextEmotion = {
  [EmotionStateWithNone.Mellow]: EmotionStateWithNone.Flow,
  [EmotionStateWithNone.Flow]: EmotionStateWithNone.GoGoGo,
  [EmotionStateWithNone.GoGoGo]: EmotionStateWithNone.NoEmotion,
  [EmotionStateWithNone.NoEmotion]: EmotionStateWithNone.Mellow,
};

const MirrorScreen: () => JSX.Element = () => {
  const dispatch = useAppDispatch();
  const {currentMood, targetMood} = useCombinedStore(store => store.mood);
  const avatarType = useCombinedStore(store => store.settings.avatarType);
  const currentColor = Colors[currentMood];
  const navigator = useStackNavigation();
  const {width} = useWindowDimensions();
  const {userToken} = getTypedState().settings;
  const [heartRates, setHeartRates] = React.useState("");
  var randomNonce = 0;

  function add_one_make_two_digit(num){
    return ("00" + (num).toString()).slice(-2)
  }

  const generateDateString = (date) => {
    let date_string = 
    date.getUTCFullYear() + '_' + 
      add_one_make_two_digit(date.getUTCMonth() + 1) + '_' + 
      add_one_make_two_digit(date.getUTCDate()) + '_' + 
      add_one_make_two_digit(date.getUTCHours()) + '_' + 
      add_one_make_two_digit(date.getUTCMinutes()) + '_' + 
      add_one_make_two_digit(date.getUTCSeconds()) + '_' + 
      ("00" + date.getUTCMilliseconds()).slice(-3)
    return date_string
  }
  /* Read HRs every 5 seconds */

  if (!isAndroid) {
    useEffect(() => {
      try {
        try {
          console.log('Trying to start watch session in android');
          UniqueIdModule.startWatchSession('').then(async () => {
            console.log('Started watch session in android');
          });
        } catch (err) {
          console.log(`Failed to start watch session: ${err}`);
        }
        let heartRatesArray = heartRates.split(";");
        let timestamps = [];
        let heartRateValues = [];
        // We do -1 because the last value is an empty string, we can ignore that one
        for (let i = 0; i < heartRatesArray.length-1; i++) {
          let hrReadingSplit = heartRatesArray[i].split(":");
          timestamps.push(hrReadingSplit[0]);
          heartRateValues.push(hrReadingSplit[1]);
        }
        console.log("timestamps = ", timestamps);
        console.log("heartRateValues = ", heartRateValues);
        console.log("====> ", heartRatesArray)

        let contentString = "";
        for (let i = 0; i < timestamps.length; i++) {
          contentString += `${Math.round(timestamps[i]*1000)},${heartRateValues[i]},${Math.round(timestamps[i]*1000)},${randomNonce}.0,1.0,0.0,0.0\n`;
        }

        // console.log("timestamps[0] = ", timestamps[0]);

        let referenceDate = timestamps[0];
        let referenceDateRounded = Math.round(timestamps[0])*1000;
        // console.log("referenceDateRounded = ", referenceDateRounded);
        let referenceDateAsDate = new Date(referenceDateRounded);
        // console.log("referenceDateAsDate = ", referenceDateAsDate);
        let referenceDateFormatted = "" + (generateDateString(referenceDateAsDate)).toString() + "";
        
        // console.log("===========> ", referenceDateFormatted);
        // let escapedContentString = escapeStringContents(contentString);

        let basicJSON = JSON.stringify({
          fileName: 'hr.fitbit_hr.0._' + referenceDateFormatted + '__n' + timestamps.length + ".csv",
          content : contentString,
        })

        // console.log("predictionJSON = ", basicJSON);

        let queryJSON = {}
        queryJSON['token'] = userToken;
        let contentPayload = {}
        contentPayload[referenceDateFormatted] = basicJSON;
        queryJSON['content'] = contentPayload;

        fetch(UrlReceiveHR, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryJSON),
        }).then(response => {
            if (response.status === 200 && response.ok) {
              return response.json();
            }
            throw new Error(`Response failed: ${response.status}`);
          })
          .then(jsonData => {
            console.log(jsonData);
            if (jsonData?.contains_speech === 1) {
              store.dispatch(moodSlice.actions.addCurrentScore(jsonData.calm));
              if (getTypedState().mood.lastScores.length > 5) {
                store.dispatch(moodSlice.actions.stopRecording());
                store.dispatch(moodSlice.actions.recalculateMood());
              }
            }
          })
          .catch(error => {
            if (error.status === 500) {
              console.log("All good, just a 500")
            }
            // console.error(error);
          });

        console.log('Trying to start watch session in android');
        UniqueIdModule.startWatchSession('').then(async () => {
          console.log('Started watch session in android');
        });
      } catch (err) {
        console.log(`Failed to start watch session: ${err}`);
      }
      const intervalId = setInterval(async () => {
        try {
          const hrResult = await UniqueIdModule.getHeartRates('');
          const heartRates = hrResult.heartrates;
          setHeartRates(heartRates);
          console.log(`${Date.now()}: HR is: ` + heartRates);
        } catch (err) {
          console.log(`Failed to read HR: ${err}`);
        }
      }, 10000);
      return () => clearInterval(intervalId);
    });
  }

  // Subscribe to events
  useEffect(() => {
    randomNonce = Math.floor(Math.random() * 1000000);
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          navigator.replace(Screens.VoiceCheckinScreen);
          break;
      }
    });
  }, []);
  return (
    <FullPageContainer backgroundColor={currentColor}>
      <MirrorContainer color={currentColor}>
        {currentMood !== EmotionStateWithNone.NoEmotion ? (
          <TopTextContainer
            screenWidth={width}
            onPress={() => {
              dispatch(
                moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
              );
            }}>
            <ExplanationText>Measured State of Mind</ExplanationText>
            <StateText>{currentMood}</StateText>
          </TopTextContainer>
        ) : (
          <TopTextContainer
            screenWidth={width}
            onPress={() =>
              dispatch(
                moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
              )
            }>
            <ExplanationText>
              Please do a voice check-in to find out your current state of mind
            </ExplanationText>
          </TopTextContainer>
        )}
        <AvatarSectionContainer>
          <WigglyLineContainer baseColor={currentMood} />
          <Avatar
            currentMood={currentMood}
            targetMood={targetMood}
            avatarType={avatarType}
            onPress={() => {
              navigator.push(Screens.ProfileScreen);
            }}
          />
        </AvatarSectionContainer>
        <CheckInButtonContainer
          onPress={() => navigator.push(Screens.VoiceCheckinScreen)}>
          <CheckInButton>
            <CheckInCircleBorder></CheckInCircleBorder>
            <CheckInButtonTextContainer color={currentMood}>
              <CheckInButtonText color={currentMood}>
                Check-in
              </CheckInButtonText>
            </CheckInButtonTextContainer>
            <CheckInCircleBackground color={currentMood}>
              <Icons.VoiceCheckin width="58px" height="58px" />
            </CheckInCircleBackground>
          </CheckInButton>
        </CheckInButtonContainer>
      </MirrorContainer>
      <MoodButtonList
        onPress={emotion => {
          dispatch(moodSlice.actions.setTargetMood(emotion));
          setTimeout(() => {
            navigator.push(Screens.SuggestionsScreen);
          }, NAVIGATION_TIMEOUT);
        }}
      />
    </FullPageContainer>
  );
};

const MirrorContainer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.color};
  padding: 15px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px ${props => props.screenWidth * 0.1}px 0
    ${props => props.screenWidth * 0.1}px;
  height: 44px;
`;

const ExplanationText = styled.Text`
  font-size: 15px;
  color: ${Colors.Font};
  text-align: center;
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Font};
  text-align: center;
`;

const AvatarSectionContainer = styled.View`
  z-index: 1;
`;

const CheckInButtonContainer = styled(Pressable)`
  position: relative;
  width: 150px;
  height: 40px;
`;

const CheckInButton = styled.View``;

const CheckInButtonTextContainer = styled.View`
  padding: 8px;
  background-color: ${props => Colors[`${props.color}Blurred`]};
  border-radius: 20px;
  border: 1px solid ${Colors.LightGreyAccent};
  position: relative;
  top: 13px;
  left: 35px;
  width: 110px;
  padding-right: 2px;
`;

const CheckInButtonText = styled.Text`
  text-align: center;
  color: ${Colors.Font};
`;

const CheckInCircleBorder = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 1px solid ${Colors.LightGreyAccent};
`;

const CheckInCircleBackground = styled.View`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 58px;
  height: 58px;
  border-radius: 30px;
  background-color: ${props => Colors[`${props.color}Blurred`]};
`;

export default MirrorScreen;

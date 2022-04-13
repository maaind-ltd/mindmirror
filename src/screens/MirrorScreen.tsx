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
import { updateHeartRatesApple } from '../helpers/hrvHelpers';

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

  /* Read HRs every 5 seconds */

  if (!isAndroid) {

    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          try {
            console.log('Trying to start watch session in android');
            UniqueIdModule.startWatchSession('').then(async () => {
              console.log('Started watch session in android');
            });
          } catch (err) {
            console.log(`Failed to start watch session: ${err}`);
          }
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

    useEffect(() => {
      updateHeartRatesApple(heartRates);
    }, [heartRates]);
  }

  // Subscribe to events
  useEffect(() => {
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

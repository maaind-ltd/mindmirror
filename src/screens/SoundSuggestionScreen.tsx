import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useStackNavigation} from '../store/combinedStore';
import Stack from '@react-navigation/stack';
import {MainStackParams, SoundScreenParams} from '../App';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {
  getCurrentPlaybackTimeMs,
  playSound,
  SoundResource,
  SoundSuggestionDurationsSecond,
  SoundSuggestionType,
  stopSound,
} from '../helpers/audio';
import {useCombinedStore} from '../store/combinedStore';
import {TopNavigation} from '../components/TopNavigation';
const REFRESH_RATE_MS = 1000;

export interface ExplanationScreenProps
  extends Stack.StackScreenProps<MainStackParams> {}

const SoundSuggestionScreen: (
  props: ExplanationScreenProps,
) => JSX.Element = props => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();

  const targetMood = useCombinedStore(state => state.mood.targetMood);
  const subScreenKey = (props.route?.params as SoundScreenParams | undefined)
    ?.soundSuggestionType;

  const [timeLeft, setTimeLeft] = useState(
    SoundSuggestionDurationsSecond[subScreenKey] * 1000,
  );

  const title =
    subScreenKey === SoundSuggestionType.FLOW
      ? 'Flow Track'
      : subScreenKey === SoundSuggestionType.MELLOW
      ? 'Mellow Track'
      : 'GoGoGo Track';

  useEffect(() => {
    const soundResource =
      subScreenKey === SoundSuggestionType.FLOW
        ? SoundResource.FLOW_SOUND
        : subScreenKey === SoundSuggestionType.MELLOW
        ? SoundResource.MELLOW_SOUND
        : SoundResource.GOGOGO_SOUND;
    playSound(soundResource).then(() => {
      navigator.pop();
    });
    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    let isDismounting = false;
    const interval = setInterval(() => {
      getCurrentPlaybackTimeMs().then(currentTime => {
        if (!isDismounting) {
          setTimeLeft(
            SoundSuggestionDurationsSecond[subScreenKey] * 1000 - currentTime,
          );
        }
      });
    }, REFRESH_RATE_MS);
    return () => {
      clearInterval(interval);
      isDismounting = true;
    };
  }, [setTimeLeft]);

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <TopNavigation
          usePrimaryColor={true}
          title={title}
          onPress={() => navigator.pop()}
          showHelpIcon={true}
        />
        <MainContentContainer>
          <OuterRing color={targetMood} screenWidth={width}>
            <InnerRing color={targetMood} screenWidth={width}>
              <InnerMostRing color={targetMood} screenWidth={width}>
                <TimeLeftText screenWidth={width}>
                  {`${Math.floor(timeLeft / 60000)}`.padStart(2, '0')}:
                  {`${Math.floor((timeLeft % 60000) / 1000)}`.padStart(2, '0')}
                </TimeLeftText>
              </InnerMostRing>
            </InnerRing>
          </OuterRing>
        </MainContentContainer>
      </BackgroundView>
    </StyledSafeAreaView>
  );
};

const BackgroundView = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const MainContentContainer = styled.View`
  padding-top: 1px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterRing = styled.View`
  background-color: ${props => Colors[`${props.color}Dark`]};
  border-radius: ${props => props.screenWidth * 0.4}px;
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenWidth * 0.8}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.screenWidth * 0.2}px;
  position: relative;
`;

const InnerRing = styled.View`
  background-color: ${props => Colors[`${props.color}`]};
  border-radius: ${props => props.screenWidth * 0.4}px;
  width: ${props => props.screenWidth * 0.72}px;
  height: ${props => props.screenWidth * 0.72}px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${props => props.screenWidth * 0.04}px;
  left: ${props => props.screenWidth * 0.04}px;
`;

const InnerMostRing = styled.View`
  background-color: ${props => Colors[`${props.color}Dark`]};
  border-radius: ${props => props.screenWidth * 0.4}px;
  width: ${props => props.screenWidth * 0.66}px;
  height: ${props => props.screenWidth * 0.66}px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${props => props.screenWidth * 0.03}px;
  left: ${props => props.screenWidth * 0.03}px;
`;

const TimeLeftText = styled.Text`
  font-size: ${props => props.screenWidth * 0.12}px;
`;

export default SoundSuggestionScreen;

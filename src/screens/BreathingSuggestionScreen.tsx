import React, {useEffect, useState} from 'react';
import {StatusBar, Text, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useStackNavigation} from '../reducers/combinedReducer';
import IconButton from '../components/IconButton';
import Stack from '@react-navigation/stack';
import {MainStackParams, BreathingScreenParams} from '../App';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {
  BreathingType,
  getCurrentPlaybackTimeMs,
  playSound,
  SoundResource,
  stopSound,
} from '../helpers/audio';
import {useCombinedStore} from '../store/combinedStore';
import Icons from '../constants/icons';
import {
  getBreathCircleVolume,
  BreathingTiming,
  getBreathingText,
} from '../helpers/breathing';

const REFRESH_RATE_MS = 50;

export interface ExplanationScreenProps
  extends Stack.StackScreenProps<MainStackParams> {}

const BreathingSuggestionScreen: (
  props: ExplanationScreenProps,
) => JSX.Element = props => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();
  const [time, setTime] = useState(0);

  const targetMood = useCombinedStore(state => state.mood.targetMood);
  const subScreenKey = (
    props.route?.params as BreathingScreenParams | undefined
  )?.breathingType;
  const title =
    subScreenKey === BreathingType.CLASSIC
      ? 'Classic Breathing'
      : 'Pursed-lip Breathing';

  useEffect(() => {
    const soundResource =
      subScreenKey === BreathingType.CLASSIC
        ? SoundResource.BREATHING_CLASSIC
        : SoundResource.BREATHING_PURSEDLIP;
    playSound(soundResource).then(() => {
      navigator.pop();
    });
    return () => {
      stopSound();
    };
  }, []);

  useEffect(() => {
    console.log('Starting interval');
    let isDismounting = false;
    const interval = setInterval(() => {
      getCurrentPlaybackTimeMs().then(currentTime => {
        if (!isDismounting) {
          setTime(currentTime);
        }
      });
    }, REFRESH_RATE_MS);
    return () => {
      clearInterval(interval);
      isDismounting = true;
    };
  }, [setTime]);

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <TopNavigation>
          <ArrowBackContainer>
            <IconButton
              onPress={() => navigator.pop()}
              icon="BackArrowPrimary"
            />
          </ArrowBackContainer>
          <TextContainer>
            <StateText>{title}</StateText>
          </TextContainer>
          <QuestionMarkContainer>
            <Pressable>
              <QuestionIcon>
                <Icons.Help />
              </QuestionIcon>
            </Pressable>
          </QuestionMarkContainer>
        </TopNavigation>
        <MainContentContainer>
          <OuterRing color={targetMood} screenWidth={width}>
            <InnerRing color={targetMood} screenWidth={width}>
              <BreathingBackgroundContainer>
                <BarContainer screenWidth={width}>
                  <VerticalBar color={targetMood} screenWidth={width} />
                  <HorizontalBar color={targetMood} screenWidth={width} />
                </BarContainer>
              </BreathingBackgroundContainer>
            </InnerRing>
            <BreathingCircleContainer screenWidth={width}>
              <BreathingCircle
                color={targetMood}
                screenWidth={width}
                volume={getBreathCircleVolume(
                  time,
                  BreathingTiming[subScreenKey],
                )}
              />
            </BreathingCircleContainer>
            <BreathingTextContainer screenWidth={width}>
              <BreathingText>
                {getBreathingText(time, BreathingTiming[subScreenKey])}
              </BreathingText>
            </BreathingTextContainer>
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

const TopNavigation = styled.View`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  height: 72px;
  width: 100%;
  background-color: ${Colors.Background};
  border-bottom: 1px solid ${Colors.Primary};
`;

const ArrowBackContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionIcon = styled.Text`
  padding: 8px;
  border-radius: 24px;
`;

const QuestionMarkContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  background-color: ${Colors.Background};
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

const InnerRingWhite = styled.View`
  background-color: ${Colors.Background}99;
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

const BreathingBackgroundContainer = styled.View`
  padding-top: 1px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BarContainer = styled.View`
  position: relative;
  width: ${props => props.screenWidth * 0.5}px;
  height: ${props => props.screenWidth * 0.5}px;
`;

const VerticalBar = styled.View`
  background-color: ${props => Colors[props.color]};
  border-radius: 8px;
  width: ${props => props.screenWidth * 0.5}px;
  height: ${props => props.screenWidth * 0.2}px;
  position: absolute;
  top: ${props => props.screenWidth * 0.15}px;
  left: 0;
`;

const HorizontalBar = styled.View`
  background-color: ${props => Colors[props.color]};
  border-radius: 8px;
  width: ${props => props.screenWidth * 0.2}px;
  height: ${props => props.screenWidth * 0.5}px;
  position: absolute;
  top: 0;
  left: ${props => props.screenWidth * 0.15}px;
`;

const BreathingCircleContainer = styled.View`
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenWidth * 0.8}px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BreathingCircle = styled.View`
  background-color: ${props => Colors[`${props.color}Dark`]};
  border-radius: ${props => props.screenWidth * 0.4}px;
  width: ${props => props.screenWidth * props.volume * 0.8}px;
  height: ${props => props.screenWidth * props.volume * 0.8}px;
`;

const BreathingTextContainer = styled.View`
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenWidth * 0.8}px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BreathingText = styled.Text`
  font-size: 24px;
  color: ${Colors.FontDark};
  text-align: center;
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Primary};
  text-align: center;
  margin-bottom: 4px;
`;

export default BreathingSuggestionScreen;

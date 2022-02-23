import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, Pressable, Animated} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import WigglyLineContainer from '../components/WigglyLineContainer';
import {EmotionStateWithNone} from '../constants/emotionState';
import Screens from '../constants/screens';
import {useStackNavigation} from '../store/combinedStore';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import Easing from 'react-native/Libraries/Animated/Easing';
import {useAppDispatch, useCombinedStore} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
import Icons from '../constants/icons';
import MoodButtonList from '../components/MoodButtonList';
import {
  checkPermission,
  startVoiceRecording,
  stopRecordingAndDiscardAudio,
} from '../helpers/audio';
import CircleGraph from '../components/CircleGraph';

const NAVIGATION_TIMEOUT = 600;

const QuoteContent =
  `Moods tend to echo particular emotions, like happiness or sadness, ` +
  `but they are usually less intense and more persistent - a state of mind that lasts for ` +
  `an extended period of time.`;

const enum VoiceCheckinStep {
  Instruction,
  Listening,
  Result,
}

let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
let previousMood: EmotionStateWithNone = EmotionStateWithNone.NoEmotion;

const VoiceCheckinScreen: () => JSX.Element = () => {
  const dispatch = useAppDispatch();
  const {currentMood, isRecording, lastScores} = useCombinedStore(
    store => store.mood,
  );
  const [currentStep, setCurrentStep] = useState(VoiceCheckinStep.Instruction);

  useEffect(() => {
    if (currentStep === VoiceCheckinStep.Listening && !isRecording) {
      setCurrentStep(VoiceCheckinStep.Result);
      Animated.timing(fadeAnim, {
        easing: Easing.linear,
        fromValue: 0,
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      dispatch(moodSlice.actions.cancelRecording());
      stopRecordingAndDiscardAudio();
    };
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  // const currentColor = Colors[currentMood];
  const navigator = useStackNavigation();
  const {width} = useWindowDimensions();

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <ScreenContainer
        style={{
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.Background, Colors[currentMood]],
          }),
        }}>
        <TopTextContainer>
          <ExplanationText>
            {currentStep === VoiceCheckinStep.Instruction
              ? `This is a voice check-in to help measure your state of mind.\n\n` +
                `Press the icon to start.`
              : currentStep === VoiceCheckinStep.Listening
              ? `Please read the following quote:`
              : `Great! Judging by the sound of your voice, you appear to be in a ${currentMood} ` +
                `state of mind`}
          </ExplanationText>
        </TopTextContainer>
        <CenterContentContainer width={width}>
          <WigglyLinePlacement width={width}>
            <WigglyLineContainer
              baseColor={
                currentStep === VoiceCheckinStep.Result
                  ? currentMood
                  : EmotionStateWithNone.NoEmotion
              }
            />
          </WigglyLinePlacement>
          <CheckInButtonContainer
            onPress={() => {
              if (currentStep === VoiceCheckinStep.Instruction) {
                setCurrentStep(VoiceCheckinStep.Listening);
                checkPermission().then(() => {
                  dispatch(moodSlice.actions.startRecording());
                  startVoiceRecording();
                });
              }
            }}>
            {currentStep !== VoiceCheckinStep.Listening ? (
              <CheckInButton>
                <CheckInCircleBackground
                  color={
                    currentStep === VoiceCheckinStep.Instruction
                      ? EmotionStateWithNone.NoEmotion
                      : currentMood
                  }
                  width={width}>
                  {currentStep === VoiceCheckinStep.Instruction ? (
                    <Icons.VoiceCheckin
                      width={width * 0.5 - 4}
                      height={width * 0.5 - 4}
                    />
                  ) : (
                    <Icons.VoiceCheckinDone
                      width={width * 0.5 - 4}
                      height={width * 0.5 - 4}
                    />
                  )}
                </CheckInCircleBackground>
              </CheckInButton>
            ) : (
              <></>
            )}
          </CheckInButtonContainer>
        </CenterContentContainer>
        {currentStep === VoiceCheckinStep.Instruction ? (
          <ExplanationLink>What is a voice check-in?</ExplanationLink>
        ) : (
          <></>
        )}
        <BottomContainer>
          {currentStep === VoiceCheckinStep.Instruction ? (
            <NoThanksButton
              onPress={() => navigator.replace(Screens.MirrorScreen)}>
              <NoThanksText>No, thanks!</NoThanksText>
            </NoThanksButton>
          ) : currentStep === VoiceCheckinStep.Listening ? (
            <QuoteContainer>
              <QuoteBefore>“</QuoteBefore>
              <QuoteText>{QuoteContent}</QuoteText>
              <QuoteAfter>”</QuoteAfter>
            </QuoteContainer>
          ) : (
            <ResultText>
              Please choose a state of mind to go into, or stay in the current
              one.
            </ResultText>
          )}
          {currentStep === VoiceCheckinStep.Listening ? (
            <CountdownContainer>
              <CircleGraph value={lastScores.length * 16.67} />
              <StopButton
                onPress={() => {
                  setCurrentStep(VoiceCheckinStep.Instruction);
                  dispatch(moodSlice.actions.cancelRecording());
                  stopRecordingAndDiscardAudio();
                }}
              />
            </CountdownContainer>
          ) : (
            <></>
          )}
          {currentStep !== VoiceCheckinStep.Listening ? (
            <></>
          ) : (
            <ResetButton
              onPress={() => {
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeoutId = undefined;
                }
                setCurrentStep(VoiceCheckinStep.Instruction);
                dispatch(moodSlice.actions.cancelRecording());
                stopRecordingAndDiscardAudio();
              }}>
              <ResetText>Restart</ResetText>
            </ResetButton>
          )}
        </BottomContainer>
        {currentStep === VoiceCheckinStep.Result ? (
          <BackButton
            onPress={() => {
              navigator.replace(Screens.MirrorScreen);
            }}>
            <BackText>Back</BackText>
          </BackButton>
        ) : (
          <></>
        )}
      </ScreenContainer>
      {currentStep === VoiceCheckinStep.Result ? (
        <MoodButtonList
          onPress={emotion => {
            dispatch(moodSlice.actions.setTargetMood(emotion));
            setTimeout(() => {
              navigator.push(Screens.SuggestionsScreen);
            }, NAVIGATION_TIMEOUT);
          }}
        />
      ) : (
        <></>
      )}
    </StyledSafeAreaView>
  );
};

const ScreenContainer = styled(Animated.View)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* background-color: ${props => props.color}; */
  padding: 16px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px 0 0 0;
  justify-content: center;
  align-items: center;
  height: 120px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const ExplanationText = styled.Text`
  font-size: 22px;
  color: ${Colors.Font};
  padding: 0 24px;
  text-align: center;
`;

const CenterContentContainer = styled.View`
  z-index: 1;
  position: relative;
  display: flex;
  width: ${props => props.width}px;
  height: ${props => props.width * 0.6}px;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

const WigglyLinePlacement = styled.View`
  position: absolute;
  left: 0;
  top: 50%;
`;

const CheckInButtonContainer = styled(Pressable)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckInButton = styled.View``;

const CheckInCircleBackground = styled.View`
  width: ${props => props.width * 0.5}px;
  height: ${props => props.width * 0.5}px;
  border-radius: ${props => props.width * 0.5}px;
  border: 2px solid ${props => Colors[`${props.color}Border`]};
  background-color: ${props => Colors[`${props.color}Blurred`]};
`;

const BottomContainer = styled.View`
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const ExplanationLink = styled.Text`
  margin-top: 24px;
  text-decoration: underline;
  color: ${Colors.Font};
  font-size: 16px;
`;

const ResetButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ResetText = styled.Text`
  font-size: 16px;
  text-decoration: underline;
  color: ${Colors.Font};
`;

const BackButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const BackText = styled.Text`
  font-size: 16px;
  text-decoration: underline;
  color: ${Colors.Font};
`;

const ResultText = styled.Text`
  font-size: 22px;
  color: ${Colors.Font};
  margin: 24px;
`;

const NoThanksButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const NoThanksText = styled.Text`
  font-size: 20px;
  color: ${Colors.Font};
  padding: 4px 72px;
  border: 1px solid ${Colors.LightGreyAccent};
  background-color: ${Colors.Background};
  border-radius: 24px;
`;

const QuoteContainer = styled.View`
  position: relative;
`;

const QuoteText = styled.Text`
  font-size: 16px;
  color: ${Colors.Font};
  margin: 36px;
  text-align: left;
  font-weight: 600;
  line-height: 24px;
`;

const QuoteBefore = styled.Text`
  font-family: serif;
  font-size: 48px;
  color: ${Colors.Font};
  transform: rotate(-12deg);
  position: absolute;
  top: 8px;
  left: 12px;
`;

const QuoteAfter = styled.Text`
  font-family: serif;
  font-size: 48px;
  color: ${Colors.Font};
  transform: rotate(12deg);
  position: absolute;
  bottom: 8px;
  right: 12px;
`;

const CountdownContainer = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 64px;
  width: 64px;
  height: 64px;
  margin-bottom: 48px;
  background-color: ${Colors.Background};
`;

const StopButton = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px 0 0 0;
  justify-content: center;
  align-items: center;
  height: 120px;
  flex-shrink: 0;
  flex-grow: 0;
`;

export default VoiceCheckinScreen;

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
import {isAndroid} from '../helpers/accessoryFunctions';
import {VoiceCheckinExplanationModal} from '../modals/VoiceCheckinExplanationModal';
import { FullPageContainer } from '../components/FullPageContainer';

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
  const [modalVisible, setModalVisible] = useState(false);

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
    <FullPageContainer backgroundColor={Colors[currentMood]}>
      <ScreenContainer
        style={{
          backgroundColor: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.NoEmotion, Colors[currentMood]],
          }),
        }}>
        <TopTextContainer>
          <ExplanationText>
            {currentStep === VoiceCheckinStep.Instruction
              ? `This is a voice check-in to help measure your state of mind.\n\n` +
                `Press the icon to start.`
              : currentStep === VoiceCheckinStep.Listening
              ? `Talk about your day and how you are feeling. Or just read the following quote instead:`
              : `Great! Judging by the sound of your voice, you mood appear to be:`}
          </ExplanationText>
          {currentStep === VoiceCheckinStep.Result ? (
            <MoodText>{currentMood}</MoodText>
          ) : (
            <></>
          )}
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
              <CircleGraph
                value={5 + Math.min(100, lastScores.length * 16.67)}
              />
              <StopButton
                onPress={() => {
                  dispatch(moodSlice.actions.cancelRecording());
                  stopRecordingAndDiscardAudio();
                  navigator.replace(Screens.MirrorScreen);
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
        {currentStep === VoiceCheckinStep.Instruction ? (
          <ExplanationButton onPress={() => setModalVisible(true)}>
            <ExplanationButtonText>
              What is a voice check-in?
            </ExplanationButtonText>
          </ExplanationButton>
        ) : (
          <></>
        )}
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
      <VoiceCheckinExplanationModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </FullPageContainer>
  );
};

const ScreenContainer = styled(Animated.View)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 154px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const ExplanationText = styled.Text`
  font-size: 20px;
  color: ${Colors.Font};
  padding: 0 24px;
  text-align: center;
`;

const MoodText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.Font};
  text-align: center;
  margin-top: 12px;
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

const ExplanationButton = styled(Pressable)`
  text-align: center;
  margin-bottom: 20px;
`;

const ExplanationButtonText = styled.Text`
  margin-top: 24px;
  text-decoration: underline;
  color: ${Colors.Font};
  font-size: 15px;
`;

const ResetButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ResetText = styled.Text`
  font-size: 15px;
  text-decoration: underline;
  color: ${Colors.Font};
`;

const BackButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const BackText = styled.Text`
  font-size: 15px;
  text-decoration: underline;
  color: ${Colors.Font};
`;

const ResultText = styled.Text`
  font-size: 22px;
  color: ${Colors.Font};
  margin: 24px;
  text-align: center;
`;

const NoThanksButton = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Colors.LightGreyAccent};
  background-color: ${Colors.Background};
  border-radius: 24px;
`;

const NoThanksText = styled.Text`
  font-size: 20px;
  color: ${Colors.Font};
  padding: 4px 72px;
`;

const QuoteContainer = styled.View`
  position: relative;
`;

const QuoteText = styled.Text`
  font-size: 15px;
  color: ${Colors.Font};
  margin: 36px;
  text-align: left;
  line-height: 24px;
`;

const QuoteBefore = styled.Text`
  font-family: ${isAndroid ? 'serif' : 'Courier'};
  font-size: 48px;
  color: ${Colors.Font};
  transform: rotate(-12deg);
  position: absolute;
  top: 8px;
  left: 12px;
`;

const QuoteAfter = styled.Text`
  font-family: ${isAndroid ? 'serif' : 'Courier'};
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
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -15px;
  margin-top: -15px;
  border-radius: 4px;
  background-color: #d22929;
  width: 30px;
  height: 30px;
`;

export default VoiceCheckinScreen;

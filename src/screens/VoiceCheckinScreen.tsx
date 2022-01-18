import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Pressable
} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import WigglyLine from '../components/WigglyLine';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import WigglyLineContainer from '../components/WigglyLineContainer';
import EmotionState, { EmotionStateWithNone } from '../constants/emotionState';
import SuggestionsScreen from './SuggestionsScreen';
import Screens from '../constants/screens';
import { useStackNavigation } from '../reducers/combinedReducer';
import StyledSafeAreaView from '../components/StyledSafeAreaView';

const NAVIGATION_TIMEOUT = 600;

const enum VoiceCheckinStep {
  Instruction,
  Listening,
  Result
}

const VoiceCheckinScreen: () => Node = () => {
  const [currentState, setCurrentState] = useState(EmotionStateWithNone.NoEmotion);
  const [currentStep, setCurrentStep] = useState(VoiceCheckinStep.Instruction);
  const currentColor = Colors[currentState];
  const navigator = useStackNavigation();

  const setTargetState = (state: any) => {};

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
        <MirrorContainer color={currentColor}>
        {currentStep === VoiceCheckinStep.Result ? (<></>) : (
          <TopTextContainer>
            <ExplanationText>Measured State of Mind</ExplanationText>
          </TopTextContainer>
        )}
          <CheckInButtonContainer>
            <WigglyLineContainer baseColor={currentState} />
            {currentStep === VoiceCheckinStep.Instruction ? (
            <CheckInButton>
              <CheckInCircleBorder />
              <CheckInCircleBackground color={currentState}/>
            </CheckInButton>
            ) : (<></>)}
          </CheckInButtonContainer>
        </MirrorContainer>
        {currentStep === VoiceCheckinStep.Result ? (
        <ButtonContainer>
          <Button color={Colors.Mellow} onPress={() => {
            setTargetState(EmotionState.Mellow);
            setTimeout(() => {
              navigator.push(Screens.SuggestionsScreen);
            }, NAVIGATION_TIMEOUT);
          }}>
            <ButtonText>Mellow</ButtonText>
          </Button>
          <Button color={Colors.Flow} onPress={() => {
            setTargetState(EmotionState.Flow);
            setTimeout(() => {
              navigator.push(Screens.SuggestionsScreen);
            }, NAVIGATION_TIMEOUT);
          }}>
            <ButtonText>Flow</ButtonText>
          </Button>
          <Button color={Colors.GoGoGo} onPress={() => {
            setTargetState(EmotionState.GoGoGo);
            setTimeout(() => {
              navigator.push(Screens.SuggestionsScreen);
            }, NAVIGATION_TIMEOUT);
          }}>
            <ButtonText>GoGoGo</ButtonText>
          </Button>
        </ButtonContainer>
        ) : (<></>)}
    </StyledSafeAreaView>
  );
};

const MirrorContainer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 16px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px 0 0 0;
`;

const ExplanationText = styled.Text`
  font-size: 16px;
  color: ${Colors.Font};
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Font};
  text-align: center;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled(Pressable)`
  height: 90px;
  flex-grow: 1;
  flex-basis: 1px;
  background-color: ${(props) => props.color};
  border: 1px solid ${Colors.LightGreyAccent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${Colors.Font};
`;

const AvatarSectionContainer = styled.View`
  z-index: 1;
`;

const CheckInButtonContainer = styled(Pressable)`
  position: relative;
  width: 150px;
  height: 40px;
`;

const CheckInButton = styled.View`
`;


const CheckInButtonText = styled.Text`
  padding: 8px;
  background-color:  ${(props) => Colors[`${props.color}Blurred`]};
  border-radius: 20px;
  border: 1px solid ${Colors.LightGreyAccent};
  position: relative;
  top: 11px;
  left: 35px;
  text-align: center;
  width: 110px;
  padding-right: 2px;
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
  top: 2px;
  left: 2px;
  width: 56px;
  height: 56px;
  border-radius: 30px;
  background-color:  ${(props) => Colors[`${props.color}Blurred`]};
`;


export default VoiceCheckinScreen;

import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../constants/colors';
import CircleGraph from '../components/CircleGraph';
import {BaseModal, ModalVisibilityProps} from './BaseModal';

export const VoiceCheckinExplanationModal: (
  props: ModalVisibilityProps,
) => JSX.Element = props => {
  const {height, width} = useWindowDimensions();

  return (
    <BaseModal {...props}>
      <BorderContainer
        screenWidth={width}
        screenHeight={height}
        onPress={() => undefined}>
        <ContentContainer screenWidth={width}>
          <FreeFloatingText screenWidth={width}>
            A voice check-in helps determine your state of mind by measuring
            your voice.
          </FreeFloatingText>
          <FreeFloatingText screenWidth={width}>
            You will be asked to read a quote for roughly 10 seconds.
          </FreeFloatingText>
          <FreeFloatingText screenWidth={width}>
            You can cancel at any time by clicking on the following icon.
          </FreeFloatingText>

          <CountdownContainer>
            <CircleGraph value={0} />
            <StopButton />
          </CountdownContainer>
        </ContentContainer>

        <LearnMoreButton>
          <LearnMoreButtonText>Learn more</LearnMoreButtonText>
        </LearnMoreButton>
      </BorderContainer>
    </BaseModal>
  );
};

const BorderContainer = styled(Pressable)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.screenWidth * 0.8}px;
	margin: ${props =>
    `${props.screenHeight * 0.1}px ${props.screenWidth * 0.1}px `}
  border-radius: 8px;
  background-color: ${Colors.Background};
	border: 1px solid ${Colors.LightGreyAccent};
`;

const ContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
`;

const FreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
`;

const CountdownContainer = styled(Pressable)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 64px;
  width: 64px;
  height: 64px;
  margin-top: 28px;
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

const LearnMoreButton = styled(Pressable)`
  text-align: center;
  margin: 24px 0 36px;
`;

const LearnMoreButtonText = styled.Text`
  font-size: 16px;
  color: ${Colors.Primary};
  text-decoration: underline;
`;

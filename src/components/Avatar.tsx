import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import {useWindowDimensions, Pressable} from 'react-native';
import Svg, {Circle, Defs, RadialGradient, Stop} from 'react-native-svg';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import {AvatarImage} from './AvatarImage';
import {AvatarType} from '../constants/avatarImages';

export interface AvatarProps {
  currentMood: EmotionStateWithNone;
  targetMood: EmotionState;
  avatarType?: AvatarType;
  onPress?: () => void;
  width?: number;
}

const Avatar: (props: AvatarProps) => JSX.Element = (props) => {
  const {
    currentMood,
    targetMood,
    avatarType,
    onPress,
  } = props;
  let {width} = useWindowDimensions();
  if (props.width) {
    width = props.width;
  }
  return (
    <OuterContainer width={width} onPress={onPress || (() => undefined)}>
      <GradientContainer>
        <Svg height={width} width={width} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              rx="45%"
              ry="45%"
              fx="50%"
              fy="50%">
              <Stop offset="0" stopColor="#fff" stopOpacity="1" />
              <Stop offset="0.4" stopColor="#fff" stopOpacity="1" />
              <Stop offset="1" stopColor="#fff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="45" fill="url(#grad)" />
        </Svg>
      </GradientContainer>
      <InnerContainer width={width}>
        <ThinRing baseColor={targetMood}>
          <BroadRing baseColor={targetMood}>
            <ThinRing baseColor={targetMood}>
              <AvatarImage
                width={width}
                currentMood={currentMood}
                avatarType={avatarType}
                onPress={onPress}
              />
            </ThinRing>
          </BroadRing>
        </ThinRing>
      </InnerContainer>
    </OuterContainer>
  );
};

const OuterContainer = styled(Pressable)`
  display: flex;
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.width}px;
`;

const InnerContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.width}px;
`;

const GradientContainer = styled.View`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const ThinRing = styled.View`
  border-radius: 600px;
  border: 1px solid ${props => Colors[`${props.baseColor}Border`]};
`;

const BroadRing = styled.View`
  border-radius: 600px;
  border: 8px solid ${props => Colors[`${props.baseColor}Dark`]};
`;

export default Avatar;

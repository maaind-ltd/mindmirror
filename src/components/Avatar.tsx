import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import {useWindowDimensions, Pressable} from 'react-native';
import Svg, {Circle, Defs, RadialGradient, Stop} from 'react-native-svg';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import AvatarImages from '../constants/avatarImages';

export interface AvatarProps {
  currentMood: EmotionStateWithNone;
  targetMood: EmotionState;
  onPress?: () => void;
}

const Avatar: (props: AvatarProps) => JSX.Element = ({
  currentMood,
  targetMood,
  onPress,
}) => {
  const {width} = useWindowDimensions();
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
              <AvatarContainer width={width}>
                {currentMood === EmotionStateWithNone.Mellow ? (
                  <AvatarImages.MellowFemale
                    width={width * 0.45}
                    height={width * 0.45}
                  />
                ) : currentMood === EmotionStateWithNone.GoGoGo ? (
                  <AvatarImages.GoGoGoFemale
                    width={width * 0.47}
                    height={width * 0.47}
                  />
                ) : currentMood === EmotionStateWithNone.Flow ? (
                  <AvatarImages.FlowFemale
                    width={width * 0.45}
                    height={width * 0.45}
                  />
                ) : (
                  <AvatarImages.Female
                    width={width * 0.45}
                    height={width * 0.45}
                  />
                )}
              </AvatarContainer>
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

const AvatarContainer = styled.View`
  border-radius: 600px;
  margin: ${props => props.width * 0.08}px;
  background-color: white;
  border: 1px solid ${Colors.LightGreyAccent};
  width: ${props => props.width * 0.45}px;
  height: ${props => props.width * 0.45}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Avatar;

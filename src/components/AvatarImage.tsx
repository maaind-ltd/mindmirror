import React from 'react';
import AvatarImages, {AvatarType} from '../constants/avatarImages';
import {EmotionStateWithNone} from '../constants/emotionState';
import styled from 'styled-components/native';
import Colors from '../constants/colors';
import {Pressable} from 'react-native';

export interface AvatarImageProps {
  width: number;
  currentMood?: EmotionStateWithNone;
  avatarType?: AvatarType;
  onPress?: () => void;
  onLongPress?: () => void;
  noMargin?: boolean;
}

const AvatarElement: (props: AvatarImageProps) => JSX.Element = ({
  width,
  currentMood,
  avatarType,
}) => {
  switch (currentMood) {
    case EmotionStateWithNone.Flow:
      switch (avatarType) {
        case AvatarType.Female:
          return (
            <AvatarImages.FlowFemale
              width={width * 0.45}
              height={width * 0.45}
            />
          );
        case AvatarType.Male:
          return (
            <AvatarImages.FlowMale width={width * 0.45} height={width * 0.45} />
          );
        case AvatarType.Cat:
          return (
            <AvatarImages.FlowCat width={width * 0.45} height={width * 0.45} />
          );
      }
    case EmotionStateWithNone.Mellow:
      switch (avatarType) {
        case AvatarType.Female:
          return (
            <AvatarImages.MellowFemale
              width={width * 0.45}
              height={width * 0.45}
            />
          );
        case AvatarType.Male:
          return (
            <AvatarImages.MellowMale
              width={width * 0.45}
              height={width * 0.45}
            />
          );
        case AvatarType.Cat:
          return (
            <AvatarImages.MellowCat
              width={width * 0.45}
              height={width * 0.45}
            />
          );
      }
    case EmotionStateWithNone.GoGoGo:
      switch (avatarType) {
        case AvatarType.Female:
          return (
            <AvatarImages.GoGoGoFemale
              width={width * 0.47}
              height={width * 0.47}
            />
          );
        case AvatarType.Male:
          return (
            <AvatarImages.GoGoGoMale
              width={width * 0.45}
              height={width * 0.45}
            />
          );
        case AvatarType.Cat:
          return (
            <AvatarImages.GoGoGoCat
              width={width * 0.45}
              height={width * 0.45}
            />
          );
      }
    default:
      switch (avatarType) {
        case AvatarType.Female:
          return (
            <AvatarImages.Female width={width * 0.45} height={width * 0.45} />
          );
        case AvatarType.Male:
          return (
            <AvatarImages.Male width={width * 0.45} height={width * 0.45} />
          );
        case AvatarType.Cat:
          return (
            <AvatarImages.Cat width={width * 0.45} height={width * 0.45} />
          );
        default:
          return (
            <AvatarImages.Female width={width * 0.45} height={width * 0.45} />
          );
      }
  }
};

export const AvatarImage: (props: AvatarImageProps) => JSX.Element = props => {
  const {width} = props;

  return (
    <AvatarContainer
      width={width}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      noMargin={props.noMargin}>
      <AvatarElement {...props} />
    </AvatarContainer>
  );
};

const AvatarContainer = styled(Pressable)`
  border-radius: ${props => props.width * 0.45}px;
  margin: ${props => (props.noMargin ? 0 : props.width * 0.08)}px;
  background-color: white;
  border: 1px solid ${Colors.LightGreyAccent};
  width: ${props => props.width * 0.45}px;
  height: ${props => props.width * 0.45}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

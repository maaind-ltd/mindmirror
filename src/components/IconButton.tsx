import React from 'react';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Icons from '../constants/icons';
import {Pressable} from 'react-native';

export interface IconButtonProps {
  onPress: () => void;
  icon: keyof typeof Icons;
}

const IconButton: (props: IconButtonProps) => JSX.Element = ({
  onPress,
  icon,
}) => {
  const IconElement = Icons[icon];
  return (
    <IconContainer>
      {Platform.OS === "android" ? (
      <InnerButton
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#00000033', true, 24)}>
        <IconElement />
      </InnerButton>
      ) : (
        <InnerButtonIos
          onPress={onPress}>
          <IconElement />
        </InnerButtonIos>
      )}
    </IconContainer>
  );
};

export default IconButton;

const IconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerButton = styled(TouchableNativeFeedback)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerButtonIos = styled(Pressable)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 48px;
`;

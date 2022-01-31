import React, {useEffect, useState} from 'react';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Icons from '../constants/icons';

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
      <InnerButton
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#00000033', true, 24)}>
        <IconElement />
      </InnerButton>
    </IconContainer>
  );
};

export default IconButton;

const IconContainer = styled.View`
  border-radius: 48px;
`;

const InnerButton = styled(TouchableNativeFeedback)`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

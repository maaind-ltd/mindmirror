import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../constants/colors';
import {BaseModal, ModalVisibilityProps} from './BaseModal';

export interface HelpModalProps extends ModalVisibilityProps {
  children: JSX.Element;
}

export const HelpModal: (props: HelpModalProps) => JSX.Element = props => {
  const {height, width} = useWindowDimensions();

  return (
    <BaseModal {...props}>
      <BorderContainer
        screenHeight={height}
        screenWidth={width}
        onPress={() => undefined}>
        {props.children}
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

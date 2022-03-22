import React from 'react';
import {Modal, Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../constants/colors';

export interface ModalVisibilityProps {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export interface BaseModalProps extends ModalVisibilityProps {
  children: JSX.Element;
}

export const BaseModal: (props: BaseModalProps) => JSX.Element = ({
  visible,
  setModalVisible,
  children,
}) => {
  const {height, width} = useWindowDimensions();

  return (
    <CenteredView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setModalVisible(!visible);
        }}>
        <BackgroundContainer
          screenWidth={width}
          screenHeight={height}
          onPress={() => {
            setModalVisible(false);
          }}>
          {children}
        </BackgroundContainer>
      </Modal>
    </CenteredView>
  );
};

const CenteredView = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackgroundContainer = styled(Pressable)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.screenWidth}px;
  height: ${props => props.screenHeight}px;
  background-color: #0006;
`;

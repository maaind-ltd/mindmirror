import React from 'react';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {AvatarType} from '../constants/avatarImages';
import {AvatarImage} from '../components/AvatarImage';
import Colors from '../constants/colors';
import {useDispatch} from 'react-redux';
import settingsSlice from '../store/settingsSlice';
import {BaseModal, ModalVisibilityProps} from './BaseModal';

export interface AvatarSelectionModalProps {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export const AvatarSelectionModal: (
  props: ModalVisibilityProps,
) => JSX.Element = props => {
  const {setModalVisible} = props;
  const {height, width} = useWindowDimensions();
  const dispatch = useDispatch();

  return (
    <BaseModal {...props}>
      <BorderContainer
        screenWidth={width}
        screenHeight={height}
        onPress={() => undefined}>
        <AvatarContainer screenWidth={width}>
          <AvatarImage
            width={width * 0.8}
            avatarType={AvatarType.Cat}
            onPress={() => {
              dispatch(settingsSlice.actions.setAvatarType(AvatarType.Cat));
              setModalVisible(false);
            }}
          />
          <AvatarImage
            width={width * 0.8}
            avatarType={AvatarType.Female}
            onPress={() => {
              dispatch(settingsSlice.actions.setAvatarType(AvatarType.Female));
              setModalVisible(false);
            }}
          />
          <AvatarImage
            width={width * 0.8}
            avatarType={AvatarType.Male}
            onPress={() => {
              dispatch(settingsSlice.actions.setAvatarType(AvatarType.Male));
              setModalVisible(false);
            }}
          />
        </AvatarContainer>
      </BorderContainer>
    </BaseModal>
  );
};

const BorderContainer = styled(Pressable)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenHeight * 0.8}px;
	margin: ${props =>
    `${props.screenHeight * 0.1}px ${props.screenWidth * 0.1}px `}
  border-radius: 8px;
  background-color: ${Colors.Background};
	border: 1px solid ${Colors.LightGreyAccent};
`;

const AvatarContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

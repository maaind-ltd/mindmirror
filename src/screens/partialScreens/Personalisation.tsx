import React, {useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {useCombinedStore} from '../../store/combinedStore';
import {AvatarImage} from '../../components/AvatarImage';
import {AvatarSelectionModal} from '../../modals/AvatarSelectionModal';
import {TextInput} from 'react-native-gesture-handler';
import settingsSlice from '../../store/settingsSlice';
import {useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

const Personalisation: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const {userName, avatarType} = useCombinedStore(store => store.settings);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ArticleContent>
      <FreeFloatingText screenWidth={width}>
        MindMirrow allows you to track your emotion and stess levels using
        integrated technology and varied suggestions.
      </FreeFloatingText>
      <NicknameContainer>
        <NicknameText>Nickname</NicknameText>
        <NicknameInput
          screenWidth={width}
          value={userName}
          onChangeText={userName => {
            dispatch(settingsSlice.actions.setUserName(userName));
          }}
        />
      </NicknameContainer>
      <AvatarContainer screenWidth={width}>
        <AvatarImage
          width={width * 0.8}
          avatarType={avatarType}
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </AvatarContainer>
      <CenterText screenWidth={width}>
        Choose an avatar to represent you in the app. You can change this later
        by clicking on your avatar.
      </CenterText>
      <AvatarSelectionModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const FreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
`;

const CenterText = styled.Text`
  font-size: 16px;
  color: ${Colors.Primary};
  text-align: center;
  margin: ${props =>
    `24px ${props.screenWidth * 0.08}px 24px ${props.screenWidth * 0.08}px`};
`;

const NicknameContainer = styled.View`
  margin: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NicknameText = styled.Text`
  font-size: 22px;
  color: ${Colors.Primary};
  text-align: center;
`;

const NicknameInput = styled(TextInput)`
  font-size: 24px;
  color: ${Colors.Primary};
  text-align: center;
  width: ${props => props.screenWidth * 0.6}px;
  border: 1px solid ${Colors.Primary};
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  margin-top: 12px;
  margin-bottom: 24px;
`;

const AvatarContainer = styled.View`
  height: ${props => props.screenWidth * 0.7}px;
  margin-top: -${props => props.screenWidth * 0.2}px;
  margin-bottom: -${props => props.screenWidth * 0.2}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Personalisation;

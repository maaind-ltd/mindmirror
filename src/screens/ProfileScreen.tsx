import React, {useState} from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import Screens from '../constants/screens';
import {useCombinedStore, useStackNavigation} from '../store/combinedStore';
import ItemListEntry from '../components/ItemListEntry';
import IconButton from '../components/IconButton';
import settingsSlice from '../store/settingsSlice';
import {HelpModal} from '../modals/HelpModal';
import {AvatarImage} from '../components/AvatarImage';
import {useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {AvatarSelectionModal} from '../modals/AvatarSelectionModal';
import {setupNotifications} from '../helpers/notificationHelpers';
import {FullPageContainer} from '../components/FullPageContainer';

const ProfileScreen: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();
  const dispatch = useDispatch();
  const {userName, avatarType, showNotifications} = useCombinedStore(
    store => store.settings,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [featureModalVisible, setFeatureModalVisible] = useState(false);

  return (
    <FullPageContainer backgroundColor={Colors.Background}>
      <BackgroundView>
        <TopNavigation>
          <ArrowBackContainer>
            <IconButton onPress={() => navigator.pop()} icon="BackArrow" />
          </ArrowBackContainer>
          <TextContainer>
            <StateText>Profile</StateText>
          </TextContainer>
          <QuestionMarkContainer />
        </TopNavigation>
        <ProfileAvatarContainer>
          <AvatarContainer screenWidth={width}>
            <AvatarImage
              width={width * 0.9}
              avatarType={avatarType}
              onPress={() => {
                setModalVisible(true);
              }}
              onLongPress={() => {
                dispatch(settingsSlice.actions.setOnboardingFinished(false));
                dispatch(settingsSlice.actions.regenerateUserToken());
                dispatch(settingsSlice.actions.clearPairingCode());
                navigator.replace(Screens.OnboardingScreen);
              }}
              noMargin={true}
            />
          </AvatarContainer>
          <ProfileTextContainer height={width * 0.4}>
            <MindMirrorHeader>MindMirror</MindMirrorHeader>
            <BottomTextContainer>
              <NicknameInput
                screenWidth={width}
                onChangeText={userName => {
                  dispatch(settingsSlice.actions.setUserName(userName));
                }}>
                {userName}
              </NicknameInput>
            </BottomTextContainer>
          </ProfileTextContainer>
        </ProfileAvatarContainer>
        <ArticleList>
          <ItemListEntry
            hasChivron={true}
            color={Colors.Primary}
            title="About MindMirror"
            onPress={() => {
              navigator.push(Screens.ExplanationScreen, {
                subScreen: 'AboutMindMirror',
              });
            }}
          />
          <ItemListEntry
            hasChivron={true}
            color={Colors.Primary}
            title="Spotify Playlists"
            onPress={() => {
              navigator.push(Screens.ExplanationScreen, {
                subScreen: 'SpotifyPlaylists',
              });
            }}
          />
          <ItemListEntry
            isToggle={true}
            toggleValue={showNotifications}
            onValueChange={value => {
              dispatch(settingsSlice.actions.setShowNotifications(value));

              setupNotifications();
            }}
            color={Colors.Primary}
            title="Notifications"
          />
          <ItemListEntry
            color={Colors.Primary}
            title="Request a Feature"
            onPress={() => setFeatureModalVisible(true)}
          />
        </ArticleList>
      </BackgroundView>
      <AvatarSelectionModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <HelpModal
        visible={featureModalVisible}
        setModalVisible={setFeatureModalVisible}>
        <HelpTextContainer>
          <HelpText screenWidth={width}>
            This will open the App Store page for MindMirror once it is publicy
            visible.
          </HelpText>
        </HelpTextContainer>
      </HelpModal>
    </FullPageContainer>
  );
};

const BackgroundView = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${Colors.Background};
`;

const TopNavigation = styled.View`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  height: 72px;
  width: 100%;
  background-color: ${Colors.Background};
  border-bottom: 1px solid ${Colors.Primary};
`;

const ArrowBackContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionMarkContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ArticleList = styled.View`
  flex-grow: 1;
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Primary};
  text-align: center;
  margin-bottom: 4px;
`;

const ProfileAvatarContainer = styled(Pressable)`
  background-color: ${Colors.Primary};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 24px;
  align-items: center;
`;

const AvatarContainer = styled.View`
  width: ${props => props.screenWidth * 0.45}px;
  height: ${props => props.screenWidth * 0.45}px;
  margin-right: ${props => props.screenWidth * 0.05}px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ProfileTextContainer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${props => props.height}px;
`;

const BottomTextContainer = styled.View``;

const MindMirrorHeader = styled.Text`
  color: ${Colors.Background};
  font-size: 28px;
`;

const NicknameInput = styled(TextInput)`
  font-size: 20px;
  color: ${Colors.Background};
  text-align: left;
  width: ${props => props.screenWidth * 0.4}px;
  border: 1px solid ${Colors.Background};
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
`;

const HelpTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 48px 24px;
`;

const HelpText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
`;

export default ProfileScreen;

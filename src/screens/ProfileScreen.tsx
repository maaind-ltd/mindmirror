import React from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import Screens from '../constants/screens';
import {useStackNavigation} from '../reducers/combinedReducer';
import AvatarImages from '../constants/avatarImages';
import ItemListEntry from '../components/ItemListEntry';
import IconButton from '../components/IconButton';
import settingsSlice from '../store/settingsSlice';
import {useAppDispatch} from '../store/combinedStore';

const ProfileScreen: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();
  const dispatch = useAppDispatch();

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
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
        <ProfileAvatarContainer
          onLongPress={() => {
            dispatch(settingsSlice.actions.setOnboardingFinished(false));
            navigator.replace(Screens.OnboardingScreen);
          }}>
          <AvatarContainer height={width}>
            <AvatarImages.Female height={width * 0.4} width={width * 0.4} />
          </AvatarContainer>
          <ProfileTextContainer height={width * 0.4}>
            <MindMirrorHeader>MindMirror</MindMirrorHeader>
            <BottomTextContainer>
              <NameText>Jane Doe</NameText>
              <AgeText>28 years old</AgeText>
            </BottomTextContainer>
          </ProfileTextContainer>
        </ProfileAvatarContainer>
        <ArticleList>
          <ItemListEntry
            hasChivron={true}
            color={Colors.Primary}
            title="About MindMirror"
            onPress={() => {
              console.log('Changing route.');
              navigator.push(Screens.ExplanationScreen, {
                subScreen: 'AboutMindMirror',
              });
            }}
          />
          <ItemListEntry
            hasChivron={true}
            color={Colors.Primary}
            title="Spotify playlists"
          />
          <ItemListEntry
            hasChivron={true}
            color={Colors.Primary}
            title="Notifications"
          />
          <ItemListEntry color={Colors.Primary} title="Previous Suggestions" />
          <ItemListEntry color={Colors.Primary} title="Request a Feature" />
        </ArticleList>
      </BackgroundView>
    </StyledSafeAreaView>
  );
};

const BackgroundView = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
  width: ${props => props.height * 0.4}px;
  height: ${props => props.height * 0.4}px;
  border-radius: ${props => props.height * 0.2}px;
  background-color: ${Colors.Background};
  margin-right: ${props => props.height * 0.05}px;
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

const NameText = styled.Text`
  color: ${Colors.Background};
  font-size: 18px;
`;

const AgeText = styled.Text`
  color: ${Colors.Background};
  font-size: 18px;
`;

export default ProfileScreen;

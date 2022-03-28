import React, {useEffect} from 'react';
import {StatusBar, Pressable, View, SafeAreaView} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import WigglyLineContainer from '../components/WigglyLineContainer';
import {EmotionStateWithNone} from '../constants/emotionState';
import Screens from '../constants/screens';
import {useStackNavigation} from '../store/combinedStore';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useAppDispatch, useCombinedStore} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
import Icons from '../constants/icons';
import MoodButtonList from '../components/MoodButtonList';
import notifee, {EventType} from '@notifee/react-native';

const NAVIGATION_TIMEOUT = 600;

const nextEmotion = {
  [EmotionStateWithNone.Mellow]: EmotionStateWithNone.Flow,
  [EmotionStateWithNone.Flow]: EmotionStateWithNone.GoGoGo,
  [EmotionStateWithNone.GoGoGo]: EmotionStateWithNone.NoEmotion,
  [EmotionStateWithNone.NoEmotion]: EmotionStateWithNone.Mellow,
};

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const MirrorScreen: () => JSX.Element = () => {
  const dispatch = useAppDispatch();
  const {currentMood, targetMood} = useCombinedStore(store => store.mood);
  const avatarType = useCombinedStore(store => store.settings.avatarType);
  const currentColor = Colors[currentMood];
  const navigator = useStackNavigation();
  const {width} = useWindowDimensions();

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          navigator.replace(Screens.VoiceCheckinScreen);
          break;
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <View style={styles.appBar} />
      <View style={styles.content}>
        <MirrorContainer color={currentColor}>
          {currentMood !== EmotionStateWithNone.NoEmotion ? (
            <TopTextContainer
              screenWidth={width}
              onPress={() => {
                dispatch(
                  moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
                );
              }}>
              <ExplanationText>Measured State of Mind</ExplanationText>
              <StateText>{currentMood}</StateText>
            </TopTextContainer>
          ) : (
            <TopTextContainer
              screenWidth={width}
              onPress={() =>
                dispatch(
                  moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
                )
              }>
              <ExplanationText>
                Please do a voice check-in to find out your current state of
                mind
              </ExplanationText>
            </TopTextContainer>
          )}
          <AvatarSectionContainer>
            <WigglyLineContainer baseColor={currentMood} />
            <Avatar
              currentMood={currentMood}
              targetMood={targetMood}
              avatarType={avatarType}
              onPress={() => {
                navigator.push(Screens.ProfileScreen);
              }}
            />
          </AvatarSectionContainer>
          <CheckInButtonContainer
            onPress={() => navigator.push(Screens.VoiceCheckinScreen)}>
            <CheckInButton>
              <CheckInCircleBorder></CheckInCircleBorder>
              <CheckInButtonTextContainer color={currentMood}>
                <CheckInButtonText color={currentMood}>
                  Check-in
                </CheckInButtonText>
              </CheckInButtonTextContainer>
              <CheckInCircleBackground color={currentMood}>
                <Icons.VoiceCheckin width="58px" height="58px" />
              </CheckInCircleBackground>
            </CheckInButton>
          </CheckInButtonContainer>
        </MirrorContainer>
        <MoodButtonList
          onPress={emotion => {
            dispatch(moodSlice.actions.setTargetMood(emotion));
            setTimeout(() => {
              navigator.push(Screens.SuggestionsScreen);
            }, NAVIGATION_TIMEOUT);
          }}
        />
      </View>
    </View>
  );
};

const MirrorContainer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.color};
  padding: 15px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px ${props => props.screenWidth * 0.1}px 0
    ${props => props.screenWidth * 0.1}px;
  height: 44px;
`;

const ExplanationText = styled.Text`
  font-size: 15px;
  color: ${Colors.Font};
  text-align: center;
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Font};
  text-align: center;
`;

const AvatarSectionContainer = styled.View`
  z-index: 1;
`;

const CheckInButtonContainer = styled(Pressable)`
  position: relative;
  width: 150px;
  height: 40px;
`;

const CheckInButton = styled.View``;

const CheckInButtonTextContainer = styled.View`
  padding: 8px;
  background-color: ${props => Colors[`${props.color}Blurred`]};
  border-radius: 20px;
  border: 1px solid ${Colors.LightGreyAccent};
  position: relative;
  top: 13px;
  left: 35px;
  width: 110px;
  padding-right: 2px;
`;

const CheckInButtonText = styled.Text`
  text-align: center;
  color: ${Colors.Font};
`;

const CheckInCircleBorder = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 1px solid ${Colors.LightGreyAccent};
`;

const CheckInCircleBackground = styled.View`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 58px;
  height: 58px;
  border-radius: 30px;
  background-color: ${props => Colors[`${props.color}Blurred`]};
`;

export default MirrorScreen;

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});

import React, {useState} from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import WigglyLineContainer from '../components/WigglyLineContainer';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import Screens from '../constants/screens';
import {useStackNavigation} from '../reducers/combinedReducer';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useAppDispatch, useCombinedStore} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
import Icons from '../constants/icons';
import MoodButtonList from '../components/MoodButtonList';

const NAVIGATION_TIMEOUT = 600;

const nextEmotion = {
  [EmotionStateWithNone.Mellow]: EmotionStateWithNone.Flow,
  [EmotionStateWithNone.Flow]: EmotionStateWithNone.GoGoGo,
  [EmotionStateWithNone.GoGoGo]: EmotionStateWithNone.NoEmotion,
  [EmotionStateWithNone.NoEmotion]: EmotionStateWithNone.Mellow,
};

const MirrorScreen: () => JSX.Element = () => {
  const dispatch = useAppDispatch();
  const {currentMood, targetMood} = useCombinedStore(store => store.mood);
  const currentColor = Colors[currentMood];
  const navigator = useStackNavigation();
  const {width} = useWindowDimensions();

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <MirrorContainer color={currentColor}>
        {currentMood !== EmotionStateWithNone.NoEmotion ? (
          <TopTextContainer
            onPress={() =>
              dispatch(
                moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
              )
            }>
            <ExplanationText>Measured State of Mind</ExplanationText>
            <StateText>{currentMood}</StateText>
          </TopTextContainer>
        ) : (
          <TopTextContainer
            onPress={() =>
              dispatch(
                moodSlice.actions.setCurrentMood(nextEmotion[currentMood]),
              )
            }>
            <ExplanationText>
              Currently, there is no data to gauge your mood.{'\n'}Please do a
              voice check-in.
            </ExplanationText>
          </TopTextContainer>
        )}
        <AvatarSectionContainer>
          <WigglyLineContainer baseColor={currentMood} />
          <Avatar
            currentMood={currentMood}
            targetMood={targetMood}
            onPress={() => {
              navigator.push(Screens.ProfileScreen);
            }}
          />
        </AvatarSectionContainer>
        <CheckInButtonContainer
          onPress={() => navigator.push(Screens.VoiceCheckinScreen)}>
          <CheckInButton>
            <CheckInCircleBorder></CheckInCircleBorder>
            <CheckInButtonText color={currentMood}>Check-in</CheckInButtonText>
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
    </StyledSafeAreaView>
  );
};

const MirrorContainer = styled.View`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${props => props.color};
  padding: 16px 0;
`;

const TopTextContainer = styled(Pressable)`
  display: flex;
  flex-direction: column;
  margin: 24px 0 0 0;
  height: 44px;
`;

const ExplanationText = styled.Text`
  font-size: 16px;
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

const CheckInButtonText = styled.Text`
  padding: 8px;
  background-color: ${props => Colors[`${props.color}Blurred`]};
  border-radius: 20px;
  border: 1px solid ${Colors.LightGreyAccent};
  position: relative;
  top: 13px;
  left: 35px;
  text-align: center;
  width: 110px;
  padding-right: 2px;
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

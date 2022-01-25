import React, {useEffect, useState} from 'react';
import {StatusBar, Text, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import Screens from '../constants/screens';
import {useStackNavigation} from '../reducers/combinedReducer';
import EmotionState from '../constants/emotionState';
import {useCombinedStore} from '../store/combinedStore';
import SuggestionsListEntry, {
  SuggestionListEntryData,
} from '../components/SuggestionListEntry';

interface MoodBasedSuggestionEntries {
  breathing: SuggestionListEntryData[];
  sound: SuggestionListEntryData[];
}

interface SuggestionList {
  [EmotionState.Mellow]: MoodBasedSuggestionEntries;
  [EmotionState.Flow]: MoodBasedSuggestionEntries;
  [EmotionState.GoGoGo]: MoodBasedSuggestionEntries;
}

const Suggestions: SuggestionList = {
  [EmotionState.Mellow]: {
    breathing: [
      {
        key: 'breathing-mellow',
        icon: 'breathing-mellow',
        title: 'Mellow Breathing',
        description: 'Slow, methodic breathing',
        meta: '7 minutes',
      },
    ],
    sound: [
      {
        key: 'spotify-mellow',
        icon: 'spotify',
        title: 'Mellow Playlist',
        description: 'Mellow songs from...',
      },
    ],
  },
  [EmotionState.Flow]: {
    breathing: [
      {
        key: 'breathing-flow',
        icon: 'breathing-flow',
        title: 'Flow Breathing',
        description: 'Steady, rythmical breathing',
        meta: '7 minutes',
      },
    ],
    sound: [
      {
        key: 'spotify-flow',
        icon: 'spotify',
        title: 'Flow Playlist',
        description: 'Flow songs from...',
      },
    ],
  },
  [EmotionState.GoGoGo]: {
    breathing: [
      {
        key: 'breathing-gogogo',
        icon: 'breathing-gogogo',
        title: 'GoGoGo Breathing',
        description: 'Fast, quickening breathing',
        meta: '7 minutes',
      },
    ],
    sound: [
      {
        key: 'spotify-gogogo',
        icon: 'spotify',
        title: 'GoGoGo Playlist',
        description: 'GoGoGo songs from...',
      },
    ],
  },
};

const SuggestionsScreen: () => JSX.Element = () => {
  const [isBreathingActive, setBreathingActive] = useState(true);

  const {targetMood} = useCombinedStore(store => store.mood);
  const {height} = useWindowDimensions();
  const navigator = useStackNavigation();

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <TopNavigation height={height} color={targetMood}>
          <ArrowBackContainer>
            <Pressable onPress={() => navigator.push(Screens.MirrorScreen)}>
              <ArrowBackText>{'<'}</ArrowBackText>
            </Pressable>
          </ArrowBackContainer>
          <TextContainer>
            <StateText>{targetMood}</StateText>
            <ExplanationText>suggestions</ExplanationText>
          </TextContainer>
          <QuestionMarkContainer>
            <Pressable>
              <QuestionText>{'?'}</QuestionText>
            </Pressable>
          </QuestionMarkContainer>
        </TopNavigation>
        <SuggestionTypeSwitcher>
          <SuggestionTypeButton
            active={isBreathingActive}
            onPress={() => setBreathingActive(true)}>
            <SuggestionTypeButtonText>Breathing</SuggestionTypeButtonText>
          </SuggestionTypeButton>
          <SuggestionTypeButton
            active={!isBreathingActive}
            onPress={() => setBreathingActive(false)}>
            <SuggestionTypeButtonText>Sounds</SuggestionTypeButtonText>
          </SuggestionTypeButton>
        </SuggestionTypeSwitcher>
        <SuggestionsList>
          {(isBreathingActive
            ? Suggestions[targetMood].breathing
            : Suggestions[targetMood].sound
          ).map(data => (
            <SuggestionsListEntry key={data.key} data={data} />
          ))}
        </SuggestionsList>
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
  height: 120px;
  border-bottom: 1px solid #999;
  width: 100%;
  background-color: ${props => Colors[props.color]};
`;

const ArrowBackContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowBackText = styled.Text`
  font-size: 18px;
  padding: 8px;
  border-radius: 24px;
`;

const QuestionText = styled.Text`
  font-size: 18px;
  padding: 8px;
  border-radius: 24px;
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

const SuggestionTypeSwitcher = styled.View`
  flex-grow: 0;
  display: flex;
  flex-direction: row;
`;

const SuggestionsList = styled.View`
  flex-grow: 1;
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
  margin-bottom: 4px;
`;

const SuggestionTypeButton = styled(Pressable)`
  border: 1px solid ${Colors.LightGreyAccent};
  flex-grow: 1;
  height: 56px;
  display: flex;
  flex-basis: 1px;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.active ? Colors.Background : Colors.LightGreyAccent};
`;

const SuggestionTypeButtonText = styled.Text`
  font-size: 16px;
  color: ${Colors.Font};
  text-align: center;
`;

export default SuggestionsScreen;

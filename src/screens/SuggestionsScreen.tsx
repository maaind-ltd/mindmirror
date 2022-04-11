import React, {useState} from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import Screens from '../constants/screens';
import {useStackNavigation} from '../store/combinedStore';
import EmotionState from '../constants/emotionState';
import {useCombinedStore} from '../store/combinedStore';
import SuggestionsListEntry, {
  ItemListEntryData,
} from '../components/ItemListEntry';
import Icons from '../constants/icons';
import {BreathingType, SoundSuggestionType} from '../helpers/audio';
import {HelpModal} from '../modals/HelpModal';
import { FullPageContainer } from '../components/FullPageContainer';

interface MoodBasedSuggestionEntries {
  breathing: ItemListEntryData[];
  sound: ItemListEntryData[];
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
        icon: 'Breathing',
        title: 'Mellow Breathing',
        description: 'Slow, methodic breathing',
        meta: '3 minutes',
        breathingType: BreathingType.CLASSIC,
      },
    ],
    sound: [
      {
        key: 'spotify-mellow',
        icon: 'Spotify',
        title: 'Mellow Playlist',
        description: 'Mellow songs on Spotify',
        spotifyMood: EmotionState.Mellow,
      },
      {
        key: 'binaural-mellow',
        icon: 'Loudspeaker',
        title: 'Mellow Binaural Sounds',
        description: 'Mellow Binaural Sounds',
        soundSuggestionType: SoundSuggestionType.MELLOW,
        meta: '15 minutes',
      },
    ],
  },
  [EmotionState.Flow]: {
    breathing: [
      {
        key: 'breathing-flow',
        icon: 'Breathing',
        title: 'Flow Breathing',
        description: 'Breathing to the beat of music',
        meta: '3 minutes',
        soundSuggestionType: SoundSuggestionType.FLOW_BREATHING,
      },
    ],
    sound: [
      {
        key: 'spotify-flow',
        icon: 'Spotify',
        title: 'Flow Playlist',
        description: 'Flow songs on Spotify',
        spotifyMood: EmotionState.Flow,
      },
      {
        key: 'binaural-flow',
        icon: 'Loudspeaker',
        title: 'Flow Binaural Sounds',
        description: 'Flow Binaural Sounds',
        soundSuggestionType: SoundSuggestionType.FLOW,
        meta: '3 minutes',
      },
    ],
  },
  [EmotionState.GoGoGo]: {
    breathing: [
      {
        key: 'breathing-gogogo',
        icon: 'Breathing',
        title: 'GoGoGo Breathing',
        description: 'Energizing, fast breathing',
        soundSuggestionType: SoundSuggestionType.GOGOGO_BREATHING,
        meta: '50 seconds',
      },
    ],
    sound: [
      {
        key: 'spotify-gogogo',
        icon: 'Spotify',
        title: 'GoGoGo Playlist',
        description: 'GoGoGo songs on Spotify',
        spotifyMood: EmotionState.GoGoGo,
      },
      {
        key: 'binaural-gogogo',
        icon: 'Loudspeaker',
        title: 'GoGoGo Binaural Sounds',
        description: 'GoGoGo Binaural Sounds',
        soundSuggestionType: SoundSuggestionType.GOGOGO,
        meta: '30 minutes',
      },
    ],
  },
};

const SuggestionsScreen: () => JSX.Element = () => {
  const [isSoundActive, setSoundActive] = useState(true);

  const {targetMood} = useCombinedStore(store => store.mood);
  const {width, height} = useWindowDimensions();
  const navigator = useStackNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <FullPageContainer backgroundColor={Colors[targetMood]}>
      <BackgroundView>
        <TopNavigation height={height} color={targetMood}>
          <ArrowBackContainer>
            <Pressable onPress={() => navigator.push(Screens.MirrorScreen)}>
              <ArrowBackIcon>
                <Icons.BackArrow />
              </ArrowBackIcon>
            </Pressable>
          </ArrowBackContainer>
          <TextContainer>
            <StateText>{targetMood}</StateText>
            <ExplanationText>suggestions</ExplanationText>
          </TextContainer>
          <QuestionMarkContainer>
            <Pressable onPress={() => setModalVisible(true)}>
              <QuestionIcon>
                <Icons.Help />
              </QuestionIcon>
            </Pressable>
          </QuestionMarkContainer>
        </TopNavigation>
        <SuggestionTypeSwitcher>
          <SuggestionTypeButton
            active={isSoundActive}
            onPress={() => setSoundActive(true)}>
            <SuggestionTypeButtonText>Sound</SuggestionTypeButtonText>
          </SuggestionTypeButton>
          <SuggestionTypeButton
            active={!isSoundActive}
            onPress={() => setSoundActive(false)}>
            <SuggestionTypeButtonText>Breathing</SuggestionTypeButtonText>
          </SuggestionTypeButton>
        </SuggestionTypeSwitcher>
        <SuggestionsList>
          {(isSoundActive
            ? Suggestions[targetMood].sound
            : Suggestions[targetMood].breathing
          ).map(data => (
            <SuggestionsListEntry key={data.key} {...data} />
          ))}
        </SuggestionsList>
        <HelpModal visible={modalVisible} setModalVisible={setModalVisible}>
          <HelpTextContainer>
            <HelpText screenWidth={width}>
              These suggestions are specifically curated to get you into your
              desired state of mind.
            </HelpText>
            <HelpText screenWidth={width}>
              You can read more about them here:
            </HelpText>

            <LearnMoreButton
              onPress={() => {
                setModalVisible(false);
                navigator.replace(Screens.ExplanationScreen, {
                  subScreen: 'ScienceAndTechnology',
                });
              }}>
              <LearnMoreButtonText>Science and Technology</LearnMoreButtonText>
            </LearnMoreButton>
          </HelpTextContainer>
        </HelpModal>
      </BackgroundView>
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
`;

const TopNavigation = styled.View`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  height: 128px;
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

const ArrowBackIcon = styled.View`
  padding: 8px;
  border-radius: 24px;
`;

const QuestionIcon = styled.Text`
  padding: 8px;
  border-radius: 24px;
  display: flex;
  width: 24px;
  height: 24px;
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
  font-size: 15px;
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
    props.active ? Colors.Background : Colors.LighterGreyAccent};
`;

const SuggestionTypeButtonText = styled.Text`
  font-size: 18px;
  color: ${Colors.Font};
  text-align: center;
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
  text-align: center;
  margin-bottom: 48px;
`;

const LearnMoreButton = styled(Pressable)`
  text-align: center;
  margin: 24px 0 36px;
`;

const LearnMoreButtonText = styled.Text`
  font-size: 15px;
  color: ${Colors.Primary};
  text-decoration: underline;
`;

export default SuggestionsScreen;

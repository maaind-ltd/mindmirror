import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import Icons from '../constants/icons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {Switch, TouchableNativeFeedback} from 'react-native-gesture-handler';
import {openSpotifyPlaylistForMood} from '../helpers/spotifyHelpers';
import {BreathingType, SoundSuggestionType} from '../helpers/audio';
import {useStackNavigation} from '../store/combinedStore';
import Screens from '../constants/screens';
import EmotionState from '../constants/emotionState';

export interface ItemListEntryData {
  key?: string;
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
  meta?: string;
  color?: string;
  onPress?: () => void;
  hasChivron?: boolean;
  spotifyMood?: EmotionState;
  breathingType?: BreathingType;
  soundSuggestionType?: SoundSuggestionType;
  isToggle?: boolean;
  toggleValue?: boolean;
  onValueChange?: (value: boolean) => void;
}

const ItemListEntry: (props: ItemListEntryData) => JSX.Element = ({
  title,
  description,
  meta,
  icon,
  color,
  onPress,
  hasChivron,
  spotifyMood,
  breathingType,
  soundSuggestionType,
  isToggle,
  toggleValue,
  onValueChange,
}) => {
  const navigator = useStackNavigation();
  const {width} = useWindowDimensions();
  const IconElement = Icons[icon];

  return (
    <BorderProvider
      width={width}
      onPress={
        isToggle
          ? () => {
              onValueChange(!toggleValue);
            }
          : spotifyMood
          ? () => {
              if (onPress) {
                onPress();
              }
              openSpotifyPlaylistForMood(spotifyMood);
            }
          : breathingType
          ? () => {
              if (onPress) {
                onPress();
              }
              navigator.push(Screens.BreathingSuggestionScreen, {
                breathingType: breathingType,
              });
            }
          : soundSuggestionType
          ? () => {
              if (onPress) {
                onPress();
              }
              navigator.push(Screens.SoundSuggestionScreen, {
                soundSuggestionType: soundSuggestionType,
              });
            }
          : onPress || (() => undefined)
      }>
      <EntryContainer>
        {icon ? (
          <IconContainer>
            <IconElement />
          </IconContainer>
        ) : (
          <></>
        )}
        <TextContainer>
          <TitleText color={color} screenWidth={width}>
            {title}
          </TitleText>
          {description ? (
            <DescriptionText color={color} screenWidth={width}>
              {description}
            </DescriptionText>
          ) : (
            <></>
          )}
          {meta ? (
            <MetaText color={color} screenWidth={width}>
              {meta}
            </MetaText>
          ) : (
            <></>
          )}
        </TextContainer>
        {hasChivron ? <ChivronText color={color}>{'>'}</ChivronText> : <></>}
        {isToggle ? (
          <Switch
            trackColor={{false: Colors.NoEmotion, true: `${Colors.Primary}aa`}}
            thumbColor={Colors.Primary}
            ios_backgroundColor={Colors.NoEmotion}
            value={toggleValue}
            onValueChange={onValueChange}
          />
        ) : (
          <></>
        )}
      </EntryContainer>
    </BorderProvider>
  );
};

const BorderProvider = styled(TouchableNativeFeedback)`
  padding-bottom: 1px;
  width: ${props => props.width}px;
  background-color: ${Colors.LightGreyAccent};
`;

const EntryContainer = styled.View`
  background-color: ${Colors.Background}
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 32px 24px 31px;
  width: 100%;
  margin: 0px 0px 1px;
`;

const IconContainer = styled.View`
  border-radius: 32px;
  width: 64px;
  height: 64px;
  margin-right: 24px;
`;

const TextContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
`;

const TitleText = styled.Text`
  font-size: ${props => Math.min(props.screenWidth * 0.055, 24)}px;
  color: ${props => props.color || Colors.Font};
`;

const DescriptionText = styled.Text`
  font-size: ${props => Math.min(props.screenWidth * 0.04, 16)}px;
  color: ${props => props.color || Colors.Font};
`;

const MetaText = styled.Text`
  font-size: ${props => Math.min(props.screenWidth * 0.035, 14)}px;
  color: ${Colors.FontLight};
  margin-top: 2px;
`;

const ChivronText = styled.Text`
  font-size: 24px;
  color: ${props => props.color || Colors.Font};
`;

export default ItemListEntry;

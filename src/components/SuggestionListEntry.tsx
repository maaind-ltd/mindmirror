import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import {Pressable} from 'react-native';

export interface SuggestionListEntryData {
  key: string;
  icon: string;
  title: string;
  description: string;
  meta?: string;
}

const SuggestionListEntry: ({data: SuggestionListEntryData}) => JSX.Element = ({
  data: {title, description, meta},
}) => {
  return (
    <BorderProvider>
      <EntryContainer>
        <IconContainer></IconContainer>
        <TextContainer>
          <TitleText>{title}</TitleText>
          <DescriptionText>{description}</DescriptionText>
          {meta ? <MetaText>{meta}</MetaText> : <></>}
        </TextContainer>
        <ChivronText>{'>'}</ChivronText>
      </EntryContainer>
    </BorderProvider>
  );
};

const BorderProvider = styled.View`
  padding-bottom: 1px;
  width: 100%;
  background-color: ${Colors.LightGreyAccent};
`;

const EntryContainer = styled(Pressable)`
  background-color: ${Colors.Background};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 32px 24px 31px;
  width: 100%;
`;

const IconContainer = styled.View`
  background-color: ${Colors.LightGreyAccent};
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
  font-size: 24px;
  color: ${Colors.Font};
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${Colors.Font};
`;

const MetaText = styled.Text`
  font-size: 14px;
  color: ${Colors.LightGreyAccent};
  margin-top: 2px;
`;

const ChivronText = styled.Text`
  font-size: 24px;
  color: ${Colors.Font};
`;

export default SuggestionListEntry;

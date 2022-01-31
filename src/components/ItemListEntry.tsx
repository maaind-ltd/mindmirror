import React from 'react';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import {Pressable} from 'react-native';
import Icons from '../constants/icons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';

export interface ItemListEntryData {
  key?: string;
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
  meta?: string;
  color?: string;
  onPress?: () => void;
  hasChivron?: boolean;
}

const ItemListEntry: (props: ItemListEntryData) => JSX.Element = ({
  title,
  description,
  meta,
  icon,
  color,
  onPress,
  hasChivron,
}) => {
  const {width} = useWindowDimensions();
  const IconElement = Icons[icon];
  return (
    <BorderProvider width={width} onPress={onPress || (() => undefined)}>
      <EntryContainer>
        {icon ? (
          <IconContainer>
            <IconElement />
          </IconContainer>
        ) : (
          <></>
        )}
        <TextContainer>
          <TitleText color={color}>{title}</TitleText>
          {description ? (
            <DescriptionText color={color}>{description}</DescriptionText>
          ) : (
            <></>
          )}
          {meta ? <MetaText color={color}>{meta}</MetaText> : <></>}
        </TextContainer>
        {hasChivron ? <ChivronText color={color}>{'>'}</ChivronText> : <></>}
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
  background-color: ${Colors.Background};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 32px 24px 31px;
  width: 100%;
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
  font-size: 24px;
  color: ${props => props.color || Colors.Font};
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${props => props.color || Colors.Font};
`;

const MetaText = styled.Text`
  font-size: 14px;
  color: ${Colors.LightGreyAccent};
  margin-top: 2px;
`;

const ChivronText = styled.Text`
  font-size: 24px;
  color: ${props => props.color || Colors.Font};
`;

export default ItemListEntry;

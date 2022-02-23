import React, {useEffect, useState} from 'react';
import {useStackNavigation} from '../store/combinedStore';
import styled from 'styled-components/native';
import Colors from '../constants/colors';
import {Pressable} from 'react-native';
import IconButton from './IconButton';
import Icons from '../constants/icons';

export interface TopNavigationProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  usePrimaryColor?: boolean;
  showHelpIcon?: boolean;
}

export const TopNavigation: (props: TopNavigationProps) => JSX.Element = ({
  title,
  subtitle,
  showHelpIcon,
  onPress,
  usePrimaryColor,
}) => {
  const navigator = useStackNavigation();

  return (
    <Container usePrimaryColor={usePrimaryColor}>
      <ArrowBackContainer>
        <IconButton
          onPress={onPress}
          icon={usePrimaryColor ? 'BackArrowPrimary' : 'BackArrow'}
        />
      </ArrowBackContainer>
      <TextContainer>
        <StateText usePrimaryColor={usePrimaryColor}>{title}</StateText>
        {subtitle ? (
          <ExplanationText usePrimaryColor={usePrimaryColor}>
            {subtitle}
          </ExplanationText>
        ) : (
          <></>
        )}
      </TextContainer>
      <QuestionMarkContainer>
        {showHelpIcon ? (
          <Pressable>
            <QuestionIcon>
              <Icons.Help />
            </QuestionIcon>
          </Pressable>
        ) : (
          <></>
        )}
      </QuestionMarkContainer>
    </Container>
  );
};

const Container = styled.View`
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  height: 72px;
  width: 100%;
  background-color: ${Colors.Background};
  border-bottom: 1px solid
    ${props => (props.usePrimaryColor ? Colors.Primary : Colors.Font)};
`;

const ArrowBackContainer = styled.View`
  height: 100%;
  flex-grow: 0;
  flex-basis: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionIcon = styled.Text`
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

const StateText = styled.Text`
  font-size: 24px;
  color: ${props => (props.usePrimaryColor ? Colors.Primary : Colors.Font)}
  text-align: center;
  margin-bottom: 4px;
`;

const ExplanationText = styled.Text`
  font-size: 16px;
  color: ${props => (props.usePrimaryColor ? Colors.Primary : Colors.Font)}
  text-align: center;
`;

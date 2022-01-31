import React, {useEffect, useState} from 'react';
import {StatusBar, Text, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useStackNavigation} from '../reducers/combinedReducer';
import IconButton from '../components/IconButton';
import Stack from '@react-navigation/stack';
import {ExplanationScreenParams, MainStackParams} from '../App';
import {PartialScreens} from './partialScreens/index';
import {ScrollView} from 'react-native-gesture-handler';

export interface ExplanationScreenProps
  extends Stack.StackScreenProps<MainStackParams> {}

const ExplanationScreen: (
  props: ExplanationScreenProps,
) => JSX.Element = props => {
  const navigator = useStackNavigation();

  const subScreenKey = (
    props.route?.params as ExplanationScreenParams | undefined
  )?.subScreen;
  const ScreenContent = PartialScreens[subScreenKey].component;
  const screenTitle = PartialScreens[subScreenKey].title!;
  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <TopNavigation>
          <ArrowBackContainer>
            <IconButton
              onPress={() => navigator.pop()}
              icon="BackArrowPrimary"
            />
          </ArrowBackContainer>
          <TextContainer>
            <StateText>{screenTitle}</StateText>
          </TextContainer>
          <QuestionMarkContainer />
        </TopNavigation>
        <ExplanationContentBorderProvider>
          <ExplanationContent>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <ScreenContentContainer>
                <ScreenContent />
              </ScreenContentContainer>
            </ScrollView>
          </ExplanationContent>
        </ExplanationContentBorderProvider>
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

const ExplanationContentBorderProvider = styled.View`
  padding-top: 1px;
  background-color: ${Colors.Primary};
  flex-grow: 1;
  display: flex;
`;

const ExplanationContent = styled.View`
  background-color: ${Colors.Background};
  flex-grow: 1;
`;

const StateText = styled.Text`
  font-size: 24px;
  color: ${Colors.Primary};
  text-align: center;
  margin-bottom: 4px;
`;

const ScreenContentContainer = styled.View`
  padding-top: 24px;
  padding-bottom: 72px;
`;

export default ExplanationScreen;

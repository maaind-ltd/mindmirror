import React from 'react';
import {StatusBar} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import IconButton from '../components/IconButton';
import Stack from '@react-navigation/stack';
import {ExplanationScreenParams, MainStackParams} from '../App';
import {PartialScreens} from './partialScreens/index';
import {ScrollView} from 'react-native-gesture-handler';
import {useStackNavigation} from '../store/combinedStore';
import {TopNavigation} from '../components/TopNavigation';
import {FullPageContainer} from '../components/FullPageContainer';

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
    <FullPageContainer backgroundColor="white">
      <BackgroundView>
        <TopNavigation
          usePrimaryColor={true}
          title={screenTitle}
          onPress={() => navigator.pop()}
          showHelpIcon={false}
        />
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

const ExplanationContentBorderProvider = styled.View`
  padding-top: 1px;
  background-color: ${Colors.Primary};
  flex-grow: 1;
  display: flex;
  width: 100%;
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

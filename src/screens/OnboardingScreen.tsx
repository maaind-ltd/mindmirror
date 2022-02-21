import React from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useCombinedStore, useStackNavigation} from '../store/combinedStore';
import Stack from '@react-navigation/stack';
import {MainStackParams, OnboardingScreenParams} from '../App';
import {OnboardingScreens} from './partialScreens/index';
import {ScrollView} from 'react-native-gesture-handler';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Screens from '../constants/screens';
import {useAppDispatch} from '../store/combinedStore';
import settingsSlice from '../store/settingsSlice';
import IndicatorDots from '../components/IndicatorDots';
import {generateUid} from '../helpers/accessoryFunctions';
import {useStore} from 'react-redux';

const ONBOARDING_PAGES = Object.keys(OnboardingScreens).length;

export interface ExplanationScreenProps
  extends Stack.StackScreenProps<MainStackParams> {}

const OnboardingScreen: (
  props: ExplanationScreenProps,
) => JSX.Element = props => {
  const navigator = useStackNavigation();
  const dispatch = useAppDispatch();
  const {height} = useWindowDimensions();
  const userToken = useCombinedStore(state => state.settings.userToken);

  const onboardingIndex =
    (props.route?.params as OnboardingScreenParams | undefined)
      ?.onboardingIndex || 0;
  const ScreenContent = OnboardingScreens[onboardingIndex];
  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <ExplanationContent>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ScreenContentContainer screenHeight={height}>
              <ScreenContent />
              <SpacingElement />
              <NextButton
                onPress={() => {
                  if (onboardingIndex === ONBOARDING_PAGES - 1) {
                    dispatch(settingsSlice.actions.setOnboardingFinished(true));
                    if (userToken) {
                      dispatch(
                        settingsSlice.actions.setUserToken(generateUid()),
                      );
                    }
                    console.log(generateUid());
                    navigator.replace(Screens.MirrorScreen);
                  } else {
                    navigator.push(Screens.OnboardingScreen, {
                      onboardingIndex: onboardingIndex + 1,
                    });
                  }
                }}>
                <NextButtonText>
                  {onboardingIndex === ONBOARDING_PAGES - 1
                    ? 'Done'
                    : 'Continue'}
                </NextButtonText>
              </NextButton>
              <IndicatorDots
                vertical={false}
                numberOfDots={ONBOARDING_PAGES}
                currentDot={onboardingIndex}
              />
            </ScreenContentContainer>
          </ScrollView>
        </ExplanationContent>
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

const NextButton = styled(Pressable)`
  display: flex;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: ${Colors.Primary};
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const SpacingElement = styled.View`
  flex-grow: 1;
`;

const NextButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

const ExplanationContent = styled.View`
  background-color: ${Colors.Background};
  flex-grow: 1;
`;

const ScreenContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
  min-height: ${props => props.screenHeight}px;
  padding-top: 24px;
`;

export default OnboardingScreen;

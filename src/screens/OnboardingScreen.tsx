import React, {useState} from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useCombinedStore, useStackNavigation} from '../store/combinedStore';
import Stack from '@react-navigation/stack';
import {MainStackParams, OnboardingScreenParams} from '../App';
import {OnboardingScreens} from './partialScreens/index';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Screens from '../constants/screens';
import {useAppDispatch} from '../store/combinedStore';
import settingsSlice from '../store/settingsSlice';
import IndicatorDots from '../components/IndicatorDots';
import {generateUid} from '../helpers/accessoryFunctions';
import {setupNotifications} from '../helpers/notificationHelpers';
import {isAndroid} from '../helpers/accessoryFunctions';
import _ from 'lodash';
import {FullPageContainer} from '../components/FullPageContainer';

const ONBOARDING_PAGES = Object.keys(OnboardingScreens).length;

export interface ExplanationScreenProps
  extends Stack.StackScreenProps<MainStackParams> {}

let wasSwiped = false;
let resetSwipe = _.debounce(
  () => {
    wasSwiped = false;
  },
  500,
  {leading: true},
);

const OnboardingScreen: (
  props: ExplanationScreenProps,
) => JSX.Element = props => {
  const navigator = useStackNavigation();
  const dispatch = useAppDispatch();
  const {height, width} = useWindowDimensions();
  const isEulaAccepted = useCombinedStore(
    state => state.settings.isEulaAccepted,
  );
  const userToken = useCombinedStore(state => state.settings.userToken);

  const onboardingIndex =
    (props.route?.params as OnboardingScreenParams | undefined)
      ?.onboardingIndex || 0;
  const ScreenContent = OnboardingScreens[onboardingIndex];
  return (
    <FullPageContainer backgroundColor={Colors.Background}>
      <BackgroundView>
        <ExplanationContent>
          <PanGestureHandler
            onGestureEvent={event => {
              resetSwipe();
              if (wasSwiped) {
                return;
              }
              if (
                event.nativeEvent.translationX > width * 0.2 &&
                onboardingIndex > 0
              ) {
                wasSwiped = true;
                navigator.pop();
              } else if (
                event.nativeEvent.translationX < width * -0.2 &&
                onboardingIndex < ONBOARDING_PAGES - 1
              ) {
                // Don't allow skipping required steps by swiping
                if (onboardingIndex === 0 && !isEulaAccepted) {
                  return;
                }
                wasSwiped = true;
                navigator.push(Screens.OnboardingScreen, {
                  onboardingIndex: onboardingIndex + 1,
                });
              }
            }}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}>
              <ScreenContentContainer screenHeight={height}>
                <ScreenContent />
                <SpacingElement />
                <BottomContent screenHeight={height}>
                  <NextButton
                    onPress={() => {
                      if (onboardingIndex === 0 && !isEulaAccepted) {
                        return;
                      }
                      if (onboardingIndex === ONBOARDING_PAGES - 1) {
                        // Don't allow skipping required steps
                        dispatch(
                          settingsSlice.actions.setOnboardingFinished(true),
                        );
                        setupNotifications();
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
                    }}
                    disabled={onboardingIndex === 0 && !isEulaAccepted}>
                    <NextButtonText>Continue</NextButtonText>
                  </NextButton>
                  <IndicatorDots
                    vertical={false}
                    numberOfDots={ONBOARDING_PAGES}
                    currentDot={onboardingIndex}
                  />
                </BottomContent>
              </ScreenContentContainer>
            </ScrollView>
          </PanGestureHandler>
        </ExplanationContent>
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

const NextButton = styled(Pressable)`
  display: flex;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: ${props =>
    props.disabled ? Colors.LightGreyAccent : Colors.Primary};
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
  min-height: ${props => (isAndroid ? `${props.screenHeight}px` : `100%`)};
  padding-top: 8px;
`;

const BottomContent = styled.View`
  margin-bottom: ${props => (props.screenHeight < 800 ? `0px` : `24px`)};
`;

export default OnboardingScreen;

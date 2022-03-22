import React from 'react';
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
                wasSwiped = true;
                navigator.push(Screens.OnboardingScreen, {
                  onboardingIndex: onboardingIndex + 1,
                });
              }
            }}
            // onSwipeableLeftWillOpen={() => console.log('Opening Left')}
            // onSwipeableRightWillOpen={() => console.log('Opening Right')}
          >
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}>
              <ScreenContentContainer height={height}>
                <ScreenContent />
                <SpacingElement />
                <BottomContent>
                  <NextButton
                    onPress={() => {
                      if (onboardingIndex === ONBOARDING_PAGES - 1) {
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
                </BottomContent>
              </ScreenContentContainer>
            </ScrollView>
          </PanGestureHandler>
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
  margin-bottom: ${isAndroid ? 24 : 48}px;
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
  min-height: 96%;
  padding-top: 8px;
`;

const BottomContent = styled.View`
  margin-bottom: 20px;
`;

export default OnboardingScreen;

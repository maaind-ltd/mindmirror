import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import WigglyLineContainer from '../components/WigglyLineContainer';
import {EmotionStateWithNone} from '../constants/emotionState';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {useStackNavigation} from '../reducers/combinedReducer';
import Screens from '../constants/screens';
import StyledSafeAreaView from '../components/StyledSafeAreaView';
import {useCombinedStore} from '../store/combinedStore';

const App: () => JSX.Element = () => {
  const {width, height} = useWindowDimensions();
  const navigator = useStackNavigation();
  const {onboardingFinished} = useCombinedStore(store => store.settings);

  useEffect(() => {
    setTimeout(() => {
      navigator.replace(
        onboardingFinished ? Screens.MirrorScreen : Screens.OnboardingScreen,
      );
    }, 2000);
  }, []);

  return (
    <StyledSafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <BackgroundView>
        <AppTextContainer height={height}>
          <AppText>MindMirror</AppText>
          <BarContainer>
            <Bar color={Colors.Mellow}></Bar>
            <Bar color={Colors.Flow}></Bar>
            <Bar color={Colors.GoGoGo}></Bar>
          </BarContainer>
        </AppTextContainer>
        <OuterLineContainer width={width} height={height}>
          <WigglyLineContainer
            baseColor={EmotionStateWithNone.NoEmotion}
            multiColor={true}
          />
        </OuterLineContainer>
        <FooterText>powered by{'\n'}Maaind</FooterText>
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

const AppTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: ${props => props.height * 0.6}px;
  padding-top: ${props => props.height * 0.2}px;
`;

const BarContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Bar = styled.View`
  height: 6px;
  flex-grow: 1;
  background-color: ${props => props.color}
  margin: 4px 2px;
`;

const AppText = styled.Text`
  font-weight: bold;
  font-size: 36px;
  color: ${Colors.Primary};
`;

const FooterText = styled.Text`
  font-size: 16px;
  text-align: center;
`;

const OuterLineContainer = styled.View`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height * 0.2}px;
`;

export default App;

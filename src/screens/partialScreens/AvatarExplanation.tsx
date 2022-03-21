import React from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {useCombinedStore} from '../../store/combinedStore';
import Avatar from '../../components/Avatar';
import MoodButtonList from '../../components/MoodButtonList';
import {EmotionStateWithNone} from '../../constants/emotionState';

const AvatarExplanation: () => JSX.Element = () => {
  const {height, width} = useWindowDimensions();

  const {currentMood, targetMood} = useCombinedStore(store => store.mood);

  return (
    <ArticleContent>
      <FirstFreeFloatingText screenWidth={width}>
        The circle around your avatar represents your desired mood.{'\n'}
        Your avatar helps represent your measured mood.
      </FirstFreeFloatingText>

      <AvatarSectionContainer screenWidth={width} screenHeight={height}>
        <Avatar
          currentMood={EmotionStateWithNone.GoGoGo}
          targetMood={targetMood}
          width={Math.min(height * 0.4, width)}
        />
      </AvatarSectionContainer>

      <FreeFloatingText screenWidth={width}>
        You can choose your desired mood by clicking on the buttons at the
        bottom of the mirror screen.
      </FreeFloatingText>

      <BottomSpaceProvider>
        <MoodButtonList maxHeight={Math.min(height * 0.1, 90)} />
      </BottomSpaceProvider>
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const FirstFreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `0px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
  text-align: center;
`;

const FreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
  text-align: center;
`;

const AvatarSectionContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => Math.min(props.screenHeight * 0.4, props.screenWidth * 0.85)}px;
  margin-top: -${props => Math.min(props.screenHeight * 0.4, props.screenWidth * 0.85) * 0.2}px;
  margin-bottom: -${props => Math.min(props.screenHeight * 0.4, props.screenWidth * 0.85) * 0.15}px;
`;

const BottomSpaceProvider = styled.View`
  margin-bottom: 36px;
`;

export default AvatarExplanation;

import React from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {useCombinedStore} from '../../store/combinedStore';
import Avatar from '../../components/Avatar';
import MoodButtonList from '../../components/MoodButtonList';
import {EmotionStateWithNone} from '../../constants/emotionState';

const AvatarExplanation: () => JSX.Element = () => {
  const {width} = useWindowDimensions();

  const {currentMood, targetMood} = useCombinedStore(store => store.mood);

  return (
    <ArticleContent>
      <FreeFloatingText screenWidth={width}>
        The circle around your avatar represents your desired mood.{'\n'}
        Your avatar helps represent your measured mood.
      </FreeFloatingText>

      <AvatarSectionContainer screenWidth={width}>
        <Avatar
          currentMood={EmotionStateWithNone.GoGoGo}
          targetMood={targetMood}
        />
      </AvatarSectionContainer>

      <FreeFloatingText screenWidth={width}>
        You can choose your desired mood by clicking on the buttons at the
        bottom of the mirror screen.
      </FreeFloatingText>

      <BottomSpaceProvider>
        <MoodButtonList />
      </BottomSpaceProvider>
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const FreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
`;

const AvatarSectionContainer = styled.View`
  height: ${props => props.screenWidth * 0.85}px;
  margin-top: -${props => props.screenWidth * 0.2}px;
`;

const BottomSpaceProvider = styled.View`
  margin-bottom: 48px;
`;

export default AvatarExplanation;

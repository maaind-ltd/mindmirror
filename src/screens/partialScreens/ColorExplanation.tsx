import React from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {useStackNavigation} from '../../store/combinedStore';
import Colors from '../../constants/colors';
import {useCombinedStore} from '../../store/combinedStore';

const ColorExplanation: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const navigator = useStackNavigation();

  const {currentMood, targetMood, randomId} = useCombinedStore(
    store => store.mood,
  );

  return (
    <ArticleContent>
      <FreeFloatingText screenWidth={width}>
        MindMirror offers three different moods for you to enjoy, represented by
        three different colors.
      </FreeFloatingText>
      <MoodBlock>
        <MoodColorBlock color={Colors.Mellow} screenWidth={width} />
        <MoodTextBlock screenWidth={width}>
          <MoodHeaderText>Mellow</MoodHeaderText>
          <MoodDescriptionText>Calming mood to relax.</MoodDescriptionText>
        </MoodTextBlock>
      </MoodBlock>
      <MoodBlock>
        <MoodColorBlock color={Colors.Flow} screenWidth={width} />
        <MoodTextBlock screenWidth={width}>
          <MoodHeaderText>Flow</MoodHeaderText>
          <MoodDescriptionText>
            Mood focused on creativity and socializing.
          </MoodDescriptionText>
        </MoodTextBlock>
      </MoodBlock>
      <MoodBlock>
        <MoodColorBlock color={Colors.GoGoGo} screenWidth={width} />
        <MoodTextBlock screenWidth={width}>
          <MoodHeaderText>GoGoGo</MoodHeaderText>
          <MoodDescriptionText>
            Mood to get into a more energetic state of mind.
          </MoodDescriptionText>
        </MoodTextBlock>
      </MoodBlock>
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

const MoodHeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.Primary};
`;

const MoodDescriptionText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
`;

const MoodBlock = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 48px;
`;

const MoodColorBlock = styled.View`
  width: ${props => props.screenWidth * 0.2}px;
  margin-right: ${props => props.screenWidth * 0.05}px;
  height: 24px;
  margin-top: 6px;
  background-color: ${props => props.color};
  flex-shrink: 1;
`;

const MoodTextBlock = styled.View`
  width: ${props => props.screenWidth * 0.7}px;
  margin-right: ${props => props.screenWidth * 0.05}px;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
`;

export default ColorExplanation;

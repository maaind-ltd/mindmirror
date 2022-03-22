import React from 'react';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import EmotionState from '../constants/emotionState';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../constants/colors';

export interface MoodButtonListProps {
  onPress?: (emotion: EmotionState) => void;
  maxHeight?: number;
}

const MoodButtonList: (props: MoodButtonListProps) => JSX.Element = ({
  onPress,
  maxHeight
}) => {
  const {width} = useWindowDimensions();

  return (
    <ButtonContainer
    maxHeight={maxHeight}>
      <Button
        onPress={() => (onPress ? onPress(EmotionState.Mellow) : undefined)}
        width={width}
        maxHeight={maxHeight}>
        <ButtonContent color={Colors.Mellow}
        maxHeight={maxHeight}>
          <ButtonText>Mellow</ButtonText>
        </ButtonContent>
      </Button>
      <Button
        onPress={() => (onPress ? onPress(EmotionState.Flow) : undefined)}
        width={width}
        maxHeight={maxHeight}>
        <ButtonContent color={Colors.Flow}
        maxHeight={maxHeight}>
          <ButtonText>Flow</ButtonText>
        </ButtonContent>
      </Button>
      <Button
        onPress={() => (onPress ? onPress(EmotionState.GoGoGo) : undefined)}
        width={width}
        maxHeight={maxHeight}>
        <ButtonContent color={Colors.GoGoGo}
        maxHeight={maxHeight}>
          <ButtonText>GoGoGo</ButtonText>
        </ButtonContent>
      </Button>
    </ButtonContainer>
  );
};

export default MoodButtonList;

const Button = styled(TouchableNativeFeedback)`
  width: ${props => props.width / 3}px;
  height: ${props => props.maxHeight || 90}px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${props => props.maxHeight || 90}px;
`;

const ButtonContent = styled.View`
  height: ${props => props.maxHeight || 90}px;
  flex-grow: 1;
  flex-basis: 1px;
  background-color: ${props => props.color};
  border: 1px solid ${Colors.LightGreyAccent};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${Colors.Font};
`;

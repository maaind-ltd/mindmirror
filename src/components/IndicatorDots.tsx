import React from 'react';
import styled from 'styled-components/native';
import {Pressable} from 'react-native';
import Colors from '../constants/colors';

export interface IndicatorDotsProps {
  numberOfDots: number;
  currentDot: number;
  vertical?: boolean;
  onPress?: (index: number) => void;
}

export default function IndicatorDots(props: IndicatorDotsProps): JSX.Element {
  return (
    <DotContainer vertical={props.vertical}>
      {[...Array(props.numberOfDots)].map((_, index) => (
        <Dot
          key={index}
          vertical={props.vertical}
          selected={index === props.currentDot}
          onPress={() => (props.onPress ? props.onPress!(index) : undefined)}
        />
      ))}
    </DotContainer>
  );
}

export interface DotProps {
  selected?: boolean;
  vertical?: boolean;
  onPress: () => void;
}

function Dot(props: DotProps): JSX.Element {
  if (props.selected) {
    return (
      <Pressable onPress={() => props.onPress()}>
        <ActiveDot vertical={!!props.vertical} />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={() => props.onPress()}>
      <InactiveDot vertical={!!props.vertical} />
    </Pressable>
  );
}

const ActiveDot = styled.View<{vertical: boolean}>`
  border-radius: 12px;
  background-color: ${Colors.Primary};
  width: 12px;
  height: 12px;
  margin: ${props => (props.vertical ? '4px 0px' : '0px 4px')};
`;

const InactiveDot = styled.View<{vertical: boolean}>`
  border-radius: 12px;
  background-color: ${Colors.LightGreyAccent};
  width: 12px;
  height: 12px;
  margin: ${props => (props.vertical ? '4px 0px' : '0px 4px')};
`;

const DotContainer = styled.View<{vertical: boolean}>`
  display: flex;
  flex-direction: ${({vertical}) => (vertical ? 'column' : 'row')};
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

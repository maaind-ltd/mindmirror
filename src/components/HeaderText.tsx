import React from 'react';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import styled from 'styled-components/native';
import Colors from '../constants/colors';

export const HeaderText: (props: {
  children: string; // Text only
  color?: string;
  verticalMargin?: boolean;
  large?: boolean;
}) => JSX.Element = ({children, color, verticalMargin, large}) => {
  const {width} = useWindowDimensions();
  return (
    <TextElement
      screenWidth={width}
      color={color}
      verticalMargin={verticalMargin}
      large={large}>
      {children}
    </TextElement>
  );
};

export const TextElement = styled.Text`
  font-size: ${props => (props.large ? 22 : 18)}px;
  font-weight: bold;
  color: ${props => (props.color ? props.color : Colors.Primary)};
  margin: ${props =>
    `${props.verticalMargin ? props.screenWidth * 0.04 : 0}px ${
      props.screenWidth * 0.08
    }px ${props.verticalMargin ? props.screenWidth * 0.08 : 0}px`};
`;

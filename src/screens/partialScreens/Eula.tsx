import React from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';

const EulaScreen: () => JSX.Element = () => {
  const {width} = useWindowDimensions();

  return (
    <ArticleContent>
      <WarningText screenWidth={width}>Warning</WarningText>
      <FreeFloatingText screenWidth={width}>
        Please be aware that this is an internal Testing Version.
      </FreeFloatingText>
      <FreeFloatingText screenWidth={width}>
        If you are not an internal tester, please do not countinue.
      </FreeFloatingText>
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
  text-align: center;
`;

const WarningText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.Warning};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
  text-align: center;
`;

export default EulaScreen;

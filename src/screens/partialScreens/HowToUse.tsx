import React from 'react';
import styled from 'styled-components/native';
import ColorExplanation from './ColorExplanation';
import AvatarExplanation from './AvatarExplanation';

const HowToUse: () => JSX.Element = () => {
  return (
    <ArticleContent>
      <ColorExplanation />
      <AvatarExplanation />
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

export default HowToUse;

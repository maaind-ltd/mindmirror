import React from 'react';
import styled from 'styled-components/native';
import ColorExplanation from './ColorExplanation';
import AvatarExplanation from './AvatarExplanation';
import {FreeFloatingText} from '../../components/FreeFloatingText';
import Icons from '../../constants/icons';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {HeaderText} from '../../components/HeaderText';

const ScienceAndTechnology: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  return (
    <ArticleContent>
      <HeaderText large={true} verticalMargin={true}>
        Maaind wellbeing technology
      </HeaderText>
      <FreeFloatingText>
        Mind Mirror app is powered by a novel neuroscience-based AI technology
        that measures emotional state from voice and wearables and uses
        artificial intelligence to personalize the experience.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.ScienceVoice />
      </IconContainer>
      <HeaderText>Voice Analysis</HeaderText>
      <FreeFloatingText>
        Advanced voice technology in the app analyzes signals from your voice to
        measure your state of mind. Voice biomarkers give accurate measure of
        different parameters of emotions and stress.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.ScienceWearable />
      </IconContainer>
      <HeaderText>Smart Watch</HeaderText>
      <FreeFloatingText>
        Data from wearables adds further to the mental state measurement,
        enabling continuous tracking from HRV.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.SciencePrivacy />
      </IconContainer>
      <HeaderText>Privacy</HeaderText>
      <FreeFloatingText>
        Our technology follows the highest privacy standards. The voice
        technology doesn´t know what you say, it just analyses the voice
        parameters related to wellbeing.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.ScienceBrain />
      </IconContainer>
      <HeaderText>Neuroscience</HeaderText>
      <FreeFloatingText>
        MindMirror’s design relies on the latest neuroscience and psychology
        research that is built in into various aspects of the app.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.ScienceBreathing />
      </IconContainer>
      <HeaderText>Breathing</HeaderText>
      <FreeFloatingText>
        Short breathing exercises are a powerful tool to cause immediate changes
        in the nervous system. The library of curated breathing exercises to get
        you into different mental states.
      </FreeFloatingText>
      <IconContainer screenWidth={width}>
        <Icons.ScienceMusic />
      </IconContainer>
      <HeaderText>Music</HeaderText>
      <FreeFloatingText>
        Curated music playlists on Spotify and other sound experiences are
        designed specifically for each state of mind.
      </FreeFloatingText>
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const IconContainer = styled.View`
  width: ${props => props.screenWidth * 0.4}px;
  height: ${props => props.screenWidth * 0.2}px;
  margin-top: ${props => props.screenWidth * 0.1}px;
  margin-bottom: ${props => props.screenWidth * 0.04}px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export default ScienceAndTechnology;

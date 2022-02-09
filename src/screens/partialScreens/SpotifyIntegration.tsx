import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable} from 'react-native';
const {UniqueIdReader} = NativeModules;

let intervalId: ReturnType<typeof setInterval> | undefined;

const SpotifyIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const [spotifyToken, setSpotifyToken] = useState(undefined);

  useEffect(() => () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  const connectToSpotify = () => {
    UniqueIdReader.startSpotifyAuthentication((innerText: string) => {
      console.log('Starting playlist worked? ' + innerText);
    });
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
      UniqueIdReader.getSpotifyToken((text: string, error: string) => {
        console.log(text);
        if (text.startsWith('Token:')) {
          console.log('Token received.');
          const token = text.substring('Token:'.length);

          setSpotifyToken(token);
          clearInterval(intervalId);
        }
      });
    }, 1000);
  };

  return (
    <ArticleContent>
      <HeaderText screenWidth={width}>Spotify Integration</HeaderText>
      {!spotifyToken ? (
        <>
          <FreeFloatingText screenWidth={width}>
            Click below to connect MindMirror with your Spotify account.
          </FreeFloatingText>

          <ConnectWithSpotifyButton
            screenWidth={width}
            onPress={() => connectToSpotify()}>
            <ConnectWithSpotifyButtonText>Connect</ConnectWithSpotifyButtonText>
          </ConnectWithSpotifyButton>

          <FreeFloatingText screenWidth={width}>
            You can also continue without Spotify, but not all features will be
            available to you.
          </FreeFloatingText>
        </>
      ) : (
        <FreeFloatingText screenWidth={width}>
          Connection established
        </FreeFloatingText>
      )}
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const ConnectWithSpotifyButton = styled(Pressable)`
  border-radius: ${props => `${props.screenWidth * 0.6}px`};
  height: ${props => `${props.screenWidth * 0.6}px`};
  width: ${props => `${props.screenWidth * 0.6}px`};
  margin: ${props =>
    `${props.screenWidth * 0.1}px ${props.screenWidth * 0.2}px`};
  background-color: ${Colors.SpotifyGreen};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConnectWithSpotifyButtonText = styled.Text`
  font-size: 28px;
  color: ${Colors.SpotifyBlack};
`;

const HeaderText = styled.Text`
  font-size: 24px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
`;

const FreeFloatingText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
`;

export default SpotifyIntegration;

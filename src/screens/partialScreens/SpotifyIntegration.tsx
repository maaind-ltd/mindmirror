import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import spotifySlice from '../../store/spotifySlice';
import {useDispatch} from 'react-redux';
import {
  getUserId,
  createPlaylist,
  setupSpotifyIntegration,
} from '../../helpers/spotifyHelpers';
import {number} from 'yargs';
const {UniqueIdReader} = NativeModules;

let intervalId: ReturnType<typeof setInterval> | undefined;

const enum ProcessingState {
  NOT_STARTED,
  STARTED,
  FINISHED,
  FAILED,
}

const SpotifyIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const spotifyToken = useCombinedStore(store => store.spotify.token);
  const dispatch = useDispatch();
  const [processingState, setProcessingState] = useState<ProcessingState>(
    ProcessingState.NOT_STARTED,
  );

  useEffect(
    () => () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    },
    [],
  );

  const connectToSpotify = () => {
    setProcessingState(ProcessingState.STARTED);
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
          setupSpotifyIntegration(token, false)
            .then(() => {
              setProcessingState(ProcessingState.FINISHED);
            })
            .catch(error => {
              console.error(error);
              setProcessingState(ProcessingState.FAILED);
            });
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
            state={processingState}
            onPress={() => {
              if (
                processingState === ProcessingState.NOT_STARTED ||
                processingState === ProcessingState.FAILED
              ) {
                connectToSpotify();
              }
            }}>
            <ConnectWithSpotifyButtonText>
              {processingState === ProcessingState.FAILED
                ? `Retry`
                : processingState === ProcessingState.STARTED
                ? 'Connecting'
                : `Connect`}
            </ConnectWithSpotifyButtonText>
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

const ConnectWithSpotifyButton = styled(Pressable)<{
  screenWidth: number;
  state: ProcessingState;
}>`
  border-radius: ${props => `${props.screenWidth * 0.6}px`};
  height: ${props => `${props.screenWidth * 0.6}px`};
  width: ${props => `${props.screenWidth * 0.6}px`};
  margin: ${props =>
    `${props.screenWidth * 0.1}px ${props.screenWidth * 0.2}px`};
  background-color: ${props =>
    props.state === ProcessingState.NOT_STARTED
      ? Colors.SpotifyGreen
      : props.state === ProcessingState.FAILED
      ? Colors.SpotifyRed
      : Colors.LightGreyAccent};
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

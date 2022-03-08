import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import {
  loginOnSpotify,
  setupSpotifyIntegration,
} from '../../helpers/spotifyHelpers';
import ImageResources from '../../constants/imageResources';
import {isAndroid} from '../../helpers/accessoryFunctions';

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
    if (isAndroid) {
      UniqueIdReader.startSpotifyAuthentication();
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(() => {
        UniqueIdReader.getSpotifyToken((text: string, error: string) => {
          if (text.startsWith('Token:')) {
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
    } else {
      loginOnSpotify().then(token => {
        if (token) {
          console.log(`Result for spotify login came back: ${token}.`);
          setupSpotifyIntegration(token, false)
            .then(() => {
              setProcessingState(ProcessingState.FINISHED);
            })
            .catch(error => {
              console.error(error);
              setProcessingState(ProcessingState.FAILED);
            });
        }
        console.error(`Failed to login. Token was ${token}.`);
        setProcessingState(ProcessingState.FAILED);
      });
    }
  };

  return (
    <ArticleContent>
      <SpotifyLogoContainer>
        <ImageResources.Spotify
          width={width * 0.6}
          height={width * 0.6 * 0.3024 /* aspect ratio for Spotify logo */}
        />
      </SpotifyLogoContainer>
      {!spotifyToken ? (
        <>
          <FreeFloatingText screenWidth={width}>
            MindMirror uses Spotify to play the mood playlists.
          </FreeFloatingText>

          <ConnectWithSpotifyButton
            screenWidth={width}
            state={processingState}
            onPress={() => {
              connectToSpotify();
            }}>
            <ConnectWithSpotifyButtonText>
              {processingState === ProcessingState.FAILED
                ? `Retry`
                : processingState === ProcessingState.STARTED
                ? 'Connecting'
                : `Connect to your Account`}
            </ConnectWithSpotifyButtonText>
          </ConnectWithSpotifyButton>

          <FreeFloatingText screenWidth={width}>
            You can also continue without Spotify, but not all features will be
            available to you.
          </FreeFloatingText>
        </>
      ) : (
        <TextCenteringContainer>
          <FreeFloatingText screenWidth={width}>
            Connection established
          </FreeFloatingText>
        </TextCenteringContainer>
      )}
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const TextCenteringContainer = styled.View`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SpotifyLogoContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const ConnectWithSpotifyButton = styled(Pressable)<{
  screenWidth: number;
  state: ProcessingState;
}>`
  margin: ${props => `48px 15% 48px`};
  display: flex;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  border-radius: 24px;
  justify-content: center;
  align-items: center;

  background-color: ${props =>
    props.state === ProcessingState.NOT_STARTED
      ? Colors.SpotifyGreen
      : props.state === ProcessingState.FAILED
      ? Colors.SpotifyRed
      : Colors.LightGreyAccent};
`;

const ConnectWithSpotifyButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.Background};
  margin-bottom: 2px;
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

export default SpotifyIntegration;

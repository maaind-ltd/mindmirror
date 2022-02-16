import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import {setupSpotifyIntegration} from '../../helpers/spotifyHelpers';
import settingsSlice from '../../store/settingsSlice';
import {useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';

const {UniqueIdReader} = NativeModules;

let intervalId: ReturnType<typeof setInterval> | undefined;

const enum ProcessingState {
  NOT_STARTED,
  STARTED,
  FINISHED,
  FAILED,
}

const FitbitIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const dispatch = useDispatch();
  const userToken = useCombinedStore(store => store.settings.userToken);
  const [processingState, setProcessingState] = useState<ProcessingState>(
    ProcessingState.NOT_STARTED,
  );

  // useEffect(
  //   () => () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   },
  //   [],
  // );

  // const connectToFitbit = () => {
  //   setProcessingState(ProcessingState.STARTED);
  //   UniqueIdReader.startSpotifyAuthentication((innerText: string) => {
  //     console.log('Starting playlist worked? ' + innerText);
  //   });
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //   }
  //   intervalId = setInterval(() => {
  //     UniqueIdReader.getSpotifyToken((text: string, error: string) => {
  //       console.log(text);
  //       if (text.startsWith('Token:')) {
  //         console.log('Token received.');
  //         const token = text.substring('Token:'.length);
  //         setupSpotifyIntegration(token, false)
  //           .then(() => {
  //             setProcessingState(ProcessingState.FINISHED);
  //           })
  //           .catch(error => {
  //             console.error(error);
  //             setProcessingState(ProcessingState.FAILED);
  //           });
  //         clearInterval(intervalId);
  //       }
  //     });
  //   }, 1000);
  // };

  return (
    <ArticleContent>
      <HeaderText screenWidth={width}>Fitbit Integration</HeaderText>

      <PairingCodeContainer>
        <PairingCodeText>Pairing Code</PairingCodeText>
        <PairingCodeInput
          screenWidth={width}
          onChangeText={userToken => {
            dispatch(settingsSlice.actions.setUserToken(userToken));
          }}>
          {userToken}
        </PairingCodeInput>
      </PairingCodeContainer>
      <TestConnectionButton>
        <TextConnectionButtonText>Test Connection</TextConnectionButtonText>
      </TestConnectionButton>
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

const PairingCodeContainer = styled.View`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PairingCodeText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  text-align: center;
`;

const PairingCodeInput = styled(TextInput)`
  font-size: 24px;
  color: ${Colors.Primary};
  text-align: center;
  width: ${props => props.screenWidth * 0.6}px;
  border: 1px solid ${Colors.Primary};
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
`;

const TestConnectionButton = styled.View`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextConnectionButtonText = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  text-align: center;
`;

export default FitbitIntegration;

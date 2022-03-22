import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable, Linking} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import {setupSpotifyIntegration} from '../../helpers/spotifyHelpers';
import settingsSlice from '../../store/settingsSlice';
import {useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {PairingDeepLink} from '../../constants/urls';

const {UniqueIdReader} = NativeModules;

let intervalId: ReturnType<typeof setInterval> | undefined;

const enum ProcessingState {
  NOT_STARTED,
  STARTED,
  FINISHED,
  FAILED,
}

const AppleWatchIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const pairingCode = useCombinedStore(store => store.settings.pairingCode);

  return (
    <ArticleContent>
      <HeaderText screenWidth={width}>Apple watch Integration</HeaderText>

      {!pairingCode ? (
        <>
          <FreeFloatingText screenWidth={width}>
            You can connect your Apple watch with MindMirror. To do so, please
            install the MindMirror Apple watch Companion app and click on
            connect in the settings screen.
          </FreeFloatingText>
        </>
      ) : (
        <FreeFloatingText screenWidth={width}>
          Your Apple watch is now set up.
        </FreeFloatingText>
      )}
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const HeaderText = styled.Text`
  font-size: 24px;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
  text-align: center;
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

export default AppleWatchIntegration;

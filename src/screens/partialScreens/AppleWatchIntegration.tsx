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
import ImageResources from '../../constants/imageResources';

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
      <LogoImage source={ImageResources.AppleWatch} screenWidth={width} />

      {!pairingCode ? (
        <>
          <FreeFloatingText screenWidth={width}>
            If you have an Apple Watch, the MindMirror companion app will be
            automatically downloaded.
          </FreeFloatingText>
          <FreeFloatingText screenWidth={width}>
            Please make sure give “all permissions” access to your Health data
            when prompted upon opening the app.
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

const LogoImage = styled.Image`
  margin: ${props =>
    `${props.screenWidth * 0.08}px ${props.screenWidth * 0.28}px ${
      props.screenWidth * 0.08
    }px`};
  width: ${props => props.screenWidth * 0.4}px;
  height: ${props => props.screenWidth * 0.4 * 0.2794 /* Image ratio */}px;
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

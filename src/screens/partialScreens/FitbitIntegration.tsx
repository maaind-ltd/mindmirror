import React from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {Pressable} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import ImageResources from '../../constants/imageResources';
import {
  FitbitCompanionApp,
  openFitbitStorePage,
} from '../../helpers/fitbitHelpers';

const FitbitIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const pairingCode = useCombinedStore(store => store.settings.pairingCode);

  return (
    <ArticleContent>
      <LogoImage source={ImageResources.FitBit} screenWidth={width} />

      {!pairingCode ? (
        <>
          <FreeFloatingText screenWidth={width}>
            You can connect your Fitbit Versa with MindMirror.
          </FreeFloatingText>
          <FreeFloatingText screenWidth={width}>
            To do so, please install the MindMirror Fitbit Companion app and
            click on connect in the settings screen.
          </FreeFloatingText>
          <ConnectWithFitbitButton
            screenWidth={width}
            onPress={() => {
              openFitbitStorePage(FitbitCompanionApp.Versa_1_2);
            }}>
            <FibitButtonText>App for Versa 1 and Versa 2</FibitButtonText>
          </ConnectWithFitbitButton>
          <ConnectWithFitbitButton
            screenWidth={width}
            onPress={() => {
              openFitbitStorePage(FitbitCompanionApp.Versa_3);
            }}>
            <FibitButtonText>App for Versa 3 and Sense</FibitButtonText>
          </ConnectWithFitbitButton>
        </>
      ) : (
        <CenteringContainer>
          <FreeFloatingText screenWidth={width}>
            Your Fitbit is now set up.
          </FreeFloatingText>
        </CenteringContainer>
      )}
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
`;

const CenteringContainer = styled.View`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
`;

const LogoImage = styled.Image`
  margin: ${props =>
    `${props.screenWidth * 0.08}px ${props.screenWidth * 0.23}px ${
      props.screenWidth * 0.08
    }px`};
  width: ${props => props.screenWidth * 0.5}px;
  height: ${props => props.screenWidth * 0.5 * 0.2794 /* Image ratio */}px;
  text-align: center;
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

const ConnectWithFitbitButton = styled(Pressable)`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: white;
  border-radius: 24px;
  margin-bottom: 24px;
  border: 1px solid ${Colors.Primary};
`;

const FibitButtonText = styled.Text`
  font-size: 16px;
  color: ${Colors.Primary};
  margin-bottom: 2px;
`;

export default FitbitIntegration;

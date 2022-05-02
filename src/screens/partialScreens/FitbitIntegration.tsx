import React, {useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import {NativeModules, Pressable} from 'react-native';
import {useCombinedStore} from '../../store/combinedStore';
import ImageResources from '../../constants/imageResources';
import {BaseModal} from '../../modals/BaseModal';
import {HelpModal} from '../../modals/HelpModal';
import {
  FitbitCompanionApp,
  openFitbitStorePage,
} from '../../helpers/fitbitHelpers';
import {FreeFloatingText} from '../../components/FreeFloatingText';

const {UniqueIdReader} = NativeModules;

const FitbitIntegration: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const pairingCode = useCombinedStore(store => store.settings.pairingCode);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  console.log('pairingCode =', pairingCode);
  return (
    <ArticleContent screenWidth={width}>
      <LogoImage source={ImageResources.FitBit} screenWidth={width} />

      {!pairingCode ? (
        <>
          <FreeFloatingText center={true} verticalMargin={true}>
            If you have a Fitbit please follow theses steps:
          </FreeFloatingText>
          <FreeFloatingText center={false}>
            1. Download MindMirror Fitbit app
          </FreeFloatingText>
          <FreeFloatingText center={false}>
            2. In Permissions, give "All permissions"
          </FreeFloatingText>
          <FreeFloatingText center={false}>
            3. In Settings, click "Connect to MindMirror"
          </FreeFloatingText>
          <ExplanationImage
            source={ImageResources.FitBitSetupInfo}
            screenWidth={width}
          />
          <ConnectWithFitbitButton
            screenWidth={width}
            onPress={() => setModalVisible(true)}>
            <ModalButtonText>Download</ModalButtonText>
          </ConnectWithFitbitButton>
          <HelpModal
            visible={modalVisible}
            setModalVisible={visible => setModalVisible(visible)}>
            <>
              <FreeFloatingText center={true} verticalMargin={true}>
                Choose the app matching your Fitbit device version below
              </FreeFloatingText>
              <ModalButton
                screenWidth={width}
                onPress={() => {
                  UniqueIdReader.requestOpenByDefaultRights(() => {
                    openFitbitStorePage(FitbitCompanionApp.Versa_1_2);
                  });
                }}>
                <FibitButtonText>App for Versa 1 and Versa 2</FibitButtonText>
              </ModalButton>
              <ModalButton
                screenWidth={width}
                onPress={() => {
                  UniqueIdReader.requestOpenByDefaultRights(() => {
                    openFitbitStorePage(FitbitCompanionApp.Versa_3);
                  });
                }}>
                <FibitButtonText>App for Versa 3 and Sense</FibitButtonText>
              </ModalButton>
            </>
          </HelpModal>
        </>
      ) : (
        <CenteringContainer>
          <FreeFloatingText center={true}>
            Your Fitbit is now set up.
          </FreeFloatingText>
        </CenteringContainer>
      )}
    </ArticleContent>
  );
};

const ArticleContent = styled.View`
  flex-grow: 1;
  width: ${props => props.screenWidth}px;
`;

const CenteringContainer = styled.View`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
`;

const LogoImage = styled.Image`
  margin: ${props =>
    `${props.screenWidth * 0.08}px ${props.screenWidth * 0.28}px ${
      props.screenWidth * 0.08
    }px`};
  width: ${props => props.screenWidth * 0.4}px;
  height: ${props => props.screenWidth * 0.4 * 0.2794 /* Image ratio */}px;
`;

const ExplanationImage = styled.Image`
  margin: ${props =>
    `${props.screenWidth * 0.08}px ${props.screenWidth * 0.28}px ${
      props.screenWidth * 0.08
    }px`};
  width: ${props => props.screenWidth * 0.4}px;
  height: ${props => props.screenWidth * 0.4 * 1.419 /* Image ratio */}px;
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

const ConnectWithFitbitButton = styled(Pressable)`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: ${Colors.Primary};
  border-radius: 24px;
  margin-bottom: 24px;
  border: 1px solid ${Colors.Primary};
`;

const ModalButton = styled(Pressable)`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 42px;
  width: 70%;
  background-color: ${Colors.Primary};
  border-radius: 24px;
  margin-bottom: 24px;
  border: 1px solid ${Colors.Primary};
`;

const ModalButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

const FibitButtonText = styled.Text`
  font-size: 15px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

export default FitbitIntegration;

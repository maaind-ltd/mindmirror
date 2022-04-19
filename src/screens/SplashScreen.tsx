import React, {useEffect, useState} from 'react';
import {StatusBar, Pressable} from 'react-native';
import Colors from '../constants/colors';
import styled from 'styled-components/native';
import WigglyLineContainer from '../components/WigglyLineContainer';
import {EmotionStateWithNone} from '../constants/emotionState';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {useStackNavigation} from '../store/combinedStore';
import Screens from '../constants/screens';
import {useCombinedStore} from '../store/combinedStore';
import notifee, {EventType} from '@notifee/react-native';
import {FullPageContainer} from '../components/FullPageContainer';
import {TextInput} from 'react-native-gesture-handler';
import {HelpModal} from '../modals/HelpModal';
import settingsSlice from '../store/settingsSlice';
import {useDispatch} from 'react-redux';
import {isValidActivationKey, useActivationCode} from '../helpers/keys';

// Bootstrap sequence function
async function bootstrap() {
  const initialNotification = await notifee.getInitialNotification();

  if (initialNotification) {
    console.log(
      'Notification caused application to open',
      initialNotification.notification,
    );
    console.log(
      'Press action used to open the app',
      initialNotification.pressAction,
    );
  }
  return initialNotification;
}

const App: () => JSX.Element = () => {
  const {width, height} = useWindowDimensions();
  const navigator = useStackNavigation();
  const dispatch = useDispatch();
  const {activationCode, onboardingFinished} = useCombinedStore(
    store => store.settings,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCodeValid, setCodeValid] = useState(true);
  const [localActivationCode, setLocalActivationCode] =
    useState(activationCode);

  const redirect = () => {
    bootstrap().then(initialNotification => {
      if (initialNotification && onboardingFinished) {
        navigator.replace(Screens.VoiceCheckinScreen);
      } else {
        navigator.replace(
          onboardingFinished ? Screens.MirrorScreen : Screens.OnboardingScreen,
        );
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (!activationCode || !isValidActivationKey(activationCode)) {
        setModalVisible(true);
      } else {
        redirect();
      }
    }, 2000);
  }, []);
  return (
    <FullPageContainer backgroundColor={Colors.Background}>
      <BackgroundView>
        <AppTextContainer height={height}>
          <AppText>MindMirror</AppText>
          <BarContainer>
            <Bar color={Colors.Mellow}></Bar>
            <Bar color={Colors.Flow}></Bar>
            <Bar color={Colors.GoGoGo}></Bar>
          </BarContainer>
        </AppTextContainer>
        <OuterLineContainer width={width} height={height}>
          <WigglyLineContainer
            baseColor={EmotionStateWithNone.NoEmotion}
            multiColor={true}
          />
        </OuterLineContainer>
        <FooterText>powered by{'\n'}Maaind</FooterText>
      </BackgroundView>
      <HelpModal visible={isModalVisible} setModalVisible={() => undefined}>
        <InputView>
          <InputLabel>Activation Code</InputLabel>
          <StyledTextInput
            screenWidth={width}
            isCodeValid={isCodeValid}
            value={localActivationCode}
            onChangeText={newActivationCode => {
              console.log(`Activation code to set: ${newActivationCode}`);
              setLocalActivationCode(newActivationCode);
              if (newActivationCode.length === 8) {
                setCodeValid(isValidActivationKey(newActivationCode));
              }
            }}
          />
          <SaveButton
            onPress={async () => {
              if (isValidActivationKey(localActivationCode)) {
                const upperCaseCode = localActivationCode.toUpperCase();
                const wasAccepted = await useActivationCode(upperCaseCode);
                if (wasAccepted) {
                  dispatch(
                    settingsSlice.actions.setActivationCode(upperCaseCode),
                  );
                  setCodeValid(true);
                  setModalVisible(false);
                  redirect();
                } else {
                  setCodeValid(false);
                }
              } else {
                setCodeValid(false);
              }
            }}>
            <SaveButtonText>Activate</SaveButtonText>
          </SaveButton>
        </InputView>
      </HelpModal>
    </FullPageContainer>
  );
};

const BackgroundView = styled.View`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const AppTextContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: ${props => props.height * 0.6}px;
  padding-top: ${props => props.height * 0.2}px;
`;

const BarContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Bar = styled.View`
  height: 6px;
  flex-grow: 1;
  background-color: ${props => props.color}
  margin: 4px 2px;
`;

const AppText = styled.Text`
  font-weight: bold;
  font-size: 36px;
  color: ${Colors.Primary};
`;

const FooterText = styled.Text`
  font-size: 15px;
  text-align: center;
`;

const OuterLineContainer = styled.View`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height * 0.2}px;
`;

const SaveButton = styled(Pressable)`
  margin: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 42px;
  width: 70%;
  background-color: white;
  border-radius: 24px;
  margin-bottom: 24px;
  border: 1px solid ${Colors.Primary};
  background-color: ${Colors.Font};
`;

const InputView = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 24px 0;
`;

const InputLabel = styled.Text`
  font-size: 18px;
  color: ${Colors.Primary};
  margin-bottom: 2px;
`;

const SaveButtonText = styled.Text`
  font-size: 15px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

const StyledTextInput = styled(TextInput)`
  font-size: 24px;
  color: ${props => (props.isCodeValid ? Colors.Primary : Colors.Error)};
  text-align: center;
  width: ${props => props.screenWidth * 0.6}px;
  border: 1px solid
    ${props => (props.isCodeValid ? Colors.Primary : Colors.Error)};
  text-decoration: none;
  height: 56px;
  border-top-width: 0;
  border-left-width: 0;
  border-right-width: 0;
  margin-top: 12px;
  margin-bottom: 24px;
`;

export default App;

import React, {useState} from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import Pdf from 'react-native-pdf';
import {StyleSheet, Dimensions, View, Pressable} from 'react-native';
import store, {getTypedState} from '../../store/combinedStore';
import settingsSlice from '../../store/settingsSlice';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useCombinedStore} from '../../store/combinedStore';

const EulaScreen: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const englishEULA = {
    uri: 'https://www.maaind.com/mindmirror_eula_english.pdf',
    cache: true,
  };
  const dutchEULA = {
    uri: 'https://www.maaind.com/mindmirror_eula_dutch.pdf',
    cache: true,
  };
  const [pdfLanguage, setPdfLanguage] = useState('English');
  const isEulaAccepted = useCombinedStore(
    store => store.settings.isEulaAccepted,
  );

  return (
    <ArticleContent>
      <WarningText screenWidth={width}>Terms and Conditions</WarningText>
      <FreeFloatingText screenWidth={width}>
        Please read and agree to the following terms and conditions before using
        this app. You can select between an English version and a Dutch version
        of the same terms and conditions.
      </FreeFloatingText>
      <SwitchLanguageButton
        onPress={() => {
          if (pdfLanguage === 'English') {
            setPdfLanguage('Dutch');
          } else {
            setPdfLanguage('English');
          }
        }}>
        <SwitchLanguageButtonText>
          Switch to {pdfLanguage == 'English' ? 'Dutch' : 'English'}
        </SwitchLanguageButtonText>
      </SwitchLanguageButton>
      <View style={styles.container}>
        <Pdf
          source={pdfLanguage == 'English' ? englishEULA : dutchEULA}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          fitPolicy={0}
          style={styles.pdf}
        />
      </View>
      <BouncyCheckbox
        text="I agree to these conditions"
        style={{
          alignSelf: 'center',
          marginVertical: 15,
        }}
        textStyle={{
          textDecorationLine: 'none',
        }}
        isChecked={isEulaAccepted}
        onPress={(isChecked: boolean) => {
          store.dispatch(settingsSlice.actions.setIsEulaAccepted(isChecked));
        }}
      />
    </ArticleContent>
  );
};
// disabled={!scrolledToEnd}>
const EULAView = styled.View`
  width: 100%;
`;

const SwitchLanguageButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

const SwitchLanguageButton = styled(Pressable)`
  display: flex;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: ${Colors.Primary};
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    flexGrow: 1,
  },
  pdf: {
    flex: 1,
    flexGrow: 1,
    width: Dimensions.get('window').width,
  },
});

const ArticleContent = styled.View`
  flex-grow: 1;
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

const WarningText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${Colors.Primary};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px 0px`};
  text-align: center;
`;

export default EulaScreen;

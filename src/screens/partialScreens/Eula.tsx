import React, { useState } from 'react';
import styled from 'styled-components/native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import Colors from '../../constants/colors';
import Pdf from 'react-native-pdf';
import { StyleSheet, Dimensions, View, Pressable } from 'react-native';
import store, {getTypedState} from '../../store/combinedStore';
import settingsSlice from '../../store/settingsSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const EulaScreen: () => JSX.Element = () => {
  const {width} = useWindowDimensions();
  const englishEULA = { uri: 'https://www.maaind.com/mindmirror_eula_english.pdf', cache: true };
  const dutchEULA = { uri: 'https://www.maaind.com/mindmirror_eula_dutch.pdf', cache: true };
  const [pdfLanguage, setPdfLanguage] = useState("English");

  // 
  return (
    <ArticleContent>
      <WarningText screenWidth={width}>Warning</WarningText>
      <FreeFloatingText screenWidth={width}>
        Please read and agree to the following terms and conditions before using this app.
      </FreeFloatingText>
      <NextButton
          onPress={() => {
            if(pdfLanguage === "English") {
              setPdfLanguage("Dutch");
            } else {
              setPdfLanguage("English");
            }
          }}>
          <NextButtonText>Switch to {pdfLanguage == "English" ? "Dutch" : "English"}</NextButtonText>
        </NextButton>
      <EULAView>
        <Pdf
            source={pdfLanguage == "English" ? englishEULA : dutchEULA}
            onLoadComplete={(numberOfPages,filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page,numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}/>
      </EULAView>
      <BouncyCheckbox 
        text="I agree to these conditions"
        style={{
          alignSelf: 'center',
          marginVertical: 15,
        }}
        textStyle={{
          textDecorationLine: "none",
        }}
        onPress={
          (isChecked: boolean) => {
            store.dispatch(settingsSlice.actions.setIsEulaAccepted(isChecked));
          }
        } />

    </ArticleContent>
  );
};
// disabled={!scrolledToEnd}>
const EULAView = styled.View`
`;

const NextButtonText = styled.Text`
  font-size: 20px;
  color: ${Colors.Background};
  margin-bottom: 2px;
`;

const NextButton = styled(Pressable)`
  display: flex;
  height: 42px;
  width: 70%;
  margin-left: 15%;
  background-color: ${props =>
    props.disabled ? Colors.LightGreyAccent : Colors.Primary};
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 25,
  },
  pdf: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
  }
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
  color: ${Colors.Warning};
  margin: ${props =>
    `${props.screenWidth * 0.04}px ${props.screenWidth * 0.08}px ${
      props.screenWidth * 0.08
    }px`};
  text-align: center;
`;

export default EulaScreen;

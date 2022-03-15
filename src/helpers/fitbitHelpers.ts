import {Linking, Alert} from 'react-native';

export const enum FitbitCompanionApp {
  Versa_1_2,
  Versa_3,
}

export const FibitAppIds = {
  [FitbitCompanionApp.Versa_1_2]: '038fdf03-a4cb-4876-8073-98c22edf2bd4',
  [FitbitCompanionApp.Versa_3]: 'b7826163-8cd0-4e05-924f-506e351b170a',
};

const FITBIT_BASE_URL = 'https://gallery.fitbit.com/details';

export const openFitbitStorePage = async (companionApp: FitbitCompanionApp) => {
  const uri = `${FITBIT_BASE_URL}/${FibitAppIds[companionApp]}`;
  const supported = await Linking.canOpenURL(uri);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(uri);
  } else {
    Alert.alert(`Don't know how to open this URL: ${uri}`);
  }
};

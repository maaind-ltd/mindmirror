import {NativeModules, Pressable} from 'react-native';
import {UrlVoice} from '../constants/urls';
import store, {getTypedState} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
const {UniqueIdReader} = NativeModules;

/**
 * Triggers a request to the server, uploading the file content as base64 string and receiving a
 * set of scores in return. Dispatches an addScores action if scores were retrieved.
 * @param fileContent base64 encoded .wav audio data
 */
export function fetchEmotionScoreForAudioFileContent(fileContent: string) {
  const {userToken, pairingCode} = getTypedState().settings;
  
  const body = JSON.stringify({
    token: pairingCode || userToken,
    raw_audio: fileContent,
  });

  if (Platform.OS === 'android') {
    UniqueIdReader.performPostRequest(
      UrlVoice,
      body,
      (err: any, data: string) => {
      // if (data && !err) {
      try {
        const responseBody = JSON.parse(data);
        console.log('Got body ', responseBody);
        if (responseBody && responseBody.contains_speech === 1) {
          store.dispatch(moodSlice.actions.addCurrentScore(responseBody.calm));
          if (getTypedState().mood.lastScores.length > 5) {
            store.dispatch(moodSlice.actions.stopRecording());
            store.dispatch(moodSlice.actions.recalculateMood());
          }
        }
      } catch (error) {
          console.error(error);
      }
    });
  } else {
    
  const request = fetch(UrlVoice, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  })
    .then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      }
      throw new Error(`Response failed: ${response.status}`);
    })
    .then(jsonData => {
      console.log(jsonData);
      if (jsonData?.contains_speech === 1) {
        store.dispatch(moodSlice.actions.addCurrentScore(jsonData.calm));
        if (getTypedState().mood.lastScores.length > 5) {
          store.dispatch(moodSlice.actions.stopRecording());
          store.dispatch(moodSlice.actions.recalculateMood());
        }
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
}

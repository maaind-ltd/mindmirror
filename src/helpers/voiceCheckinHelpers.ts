import {NativeModules, Pressable} from 'react-native';
import {ID_TOKEN, UrlVoice} from '../constants/urls';
import store from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
const {UniqueIdReader} = NativeModules;

/**
 * Triggers a request to the server, uploading the file content as base64 string and receiving a
 * set of scores in return. Dispatches an addScores action if scores were retrieved.
 * @param fileContent base64 encoded .wav audio data
 */
export function fetchEmotionScoreForAudioFileContent(fileContent: string) {
  UniqueIdReader.performPostRequest(
    UrlVoice,
    JSON.stringify({
      token: ID_TOKEN,
      raw_audio: fileContent,
    }),
    (err: any, data: string) => {
      // if (data && !err) {
      try {
        const responseBody = JSON.parse(data);
        console.log('Got body ', responseBody);
        if (responseBody && responseBody.contains_speech === 1) {
          store.dispatch(moodSlice.actions.addCurrentScore(responseBody.calm));
          if (store.getState().mood.lastScores.length > 5) {
            store.dispatch(moodSlice.actions.stopRecording());
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  );
}

import {NativeModules, Pressable} from 'react-native';
import {UrlVoice} from '../constants/urls';
import store, {getTypedState} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
import {isAndroid} from './accessoryFunctions';
const {UniqueIdReader} = NativeModules;

let averagedScores = {
  calm: [],
  sad: [],
  angry: [],
  neutral: [],
  happy: [],
};

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

  if (isAndroid) {
    UniqueIdReader.performPostRequest(
      UrlVoice,
      body,
      (err: any, data: string) => {
        // if (data && !err) {
        try {
          const responseBody = JSON.parse(data);
          if (
            responseBody &&
            responseBody.contains_speech === 1 &&
            responseBody.calm
          ) {
            const gogogoFactors =
              responseBody.happy +
              responseBody.angry +
              (1 - responseBody.calm) / 2;
            const flow = responseBody.neutral;
            const mellow = (responseBody.calm + responseBody.sad) * 1.4;

            averagedScores.calm.push(responseBody.calm);
            averagedScores.sad.push(responseBody.sad);
            averagedScores.angry.push(responseBody.angry);
            averagedScores.neutral.push(responseBody.neutral);
            averagedScores.happy.push(responseBody.happy);

            store.dispatch(
              moodSlice.actions.addCurrentScore(responseBody.calm),
            );
            if (getTypedState().mood.lastScores.length > 5) {
              store.dispatch(moodSlice.actions.stopRecording());
              store.dispatch(moodSlice.actions.recalculateMood());

              const avgCalm =
                averagedScores.calm.reduce((sum, val) => sum + val, 0) /
                averagedScores.calm.length;
              const avgSad =
                averagedScores.sad.reduce((sum, val) => sum + val, 0) /
                averagedScores.sad.length;
              const avgAngry =
                averagedScores.angry.reduce((sum, val) => sum + val, 0) /
                averagedScores.angry.length;
              const avgNeutral =
                averagedScores.neutral.reduce((sum, val) => sum + val, 0) /
                averagedScores.neutral.length;
              const avgHappy =
                averagedScores.happy.reduce((sum, val) => sum + val, 0) /
                averagedScores.happy.length;

              console.log(
                `Averaged: calm ${avgCalm}, sad ${avgSad}, angry ${avgAngry}, ` +
                  `neutral ${avgNeutral}, happy ${avgHappy}`,
              );

              averagedScores = {
                calm: [],
                sad: [],
                angry: [],
                neutral: [],
                happy: [],
              };
            }
          }
        } catch (error) {
          console.error(error);
        }
      },
    );
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

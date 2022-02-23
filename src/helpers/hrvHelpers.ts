import {NativeModules, Pressable} from 'react-native';
import {UrlVoice, UrlHrv} from '../constants/urls';
import store, {getTypedState} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
const {UniqueIdReader} = NativeModules;

/**
 * Triggers a request to the server, getting the current hrv data from fitbit as a response.
 */
export async function fetchHrvData() {
  const {pairingCode} = getTypedState().settings;
  if (!pairingCode) {
    return;
  }

  const request = fetch(UrlHrv, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: `{"token": "${pairingCode}"}`,
  })
    .then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      }
      throw new Error(`Response failed: ${response.status}`);
    })
    .then(jsonData => {
      console.log(jsonData);
      if (jsonData.latest_calm_score !== undefined) {
        store.dispatch(
          moodSlice.actions.addHrvScore(jsonData.latest_calm_score),
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
  return request;
}

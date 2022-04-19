import {NativeModules, Pressable} from 'react-native';
import {UrlVoice, UrlHrv, UrlReceiveHR} from '../constants/urls';
import store, {getTypedState} from '../store/combinedStore';
import moodSlice from '../store/moodSlice';
const {UniqueIdReader} = NativeModules;
const UniqueIdModule = NativeModules.UniqueIdModule;

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
        const timestamp = jsonData.timestamp_ms || Date.now();
        store.dispatch(
          moodSlice.actions.addHrvScore([
            jsonData.latest_calm_score / 100,
            timestamp,
          ]),
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
  return request;
}

var randomNonce = 0;

function add_one_make_two_digit(num) {
  return ('00' + num.toString()).slice(-2);
}

const generateDateString = date => {
  let date_string =
    date.getUTCFullYear() +
    '_' +
    add_one_make_two_digit(date.getUTCMonth() + 1) +
    '_' +
    add_one_make_two_digit(date.getUTCDate()) +
    '_' +
    add_one_make_two_digit(date.getUTCHours()) +
    '_' +
    add_one_make_two_digit(date.getUTCMinutes()) +
    '_' +
    add_one_make_two_digit(date.getUTCSeconds()) +
    '_' +
    ('00' + date.getUTCMilliseconds()).slice(-3);
  return date_string;
};

function getCalmFromHeartRatesAndUpdateStore(heartRates: string) {
  const {userToken} = getTypedState().settings;
  if (!userToken) {
    return;
  }

  const {currentMood} = getTypedState().mood;

  try {
    //check if heartRates is an empty string
    if (heartRates !== '') {
      let heartRatesArray = heartRates.split(';');
      let timestamps = [];
      let heartRateValues = [];
      // We do -1 because the last value is an empty string, we can ignore that one
      for (let i = 0; i < heartRatesArray.length - 1; i++) {
        let hrReadingSplit = heartRatesArray[i].split(':');
        timestamps.push(hrReadingSplit[0]);
        heartRateValues.push(hrReadingSplit[1]);
      }

      console.log(
        "heartRateValues we're sending to backend = ",
        heartRateValues,
      );

      let contentString = '';
      for (let i = 0; i < timestamps.length; i++) {
        contentString += `${Math.round(timestamps[i] * 1000)},${
          heartRateValues[i]
        },${Math.round(timestamps[i] * 1000)},${randomNonce}.0,1.0,0.0,0.0\n`;
      }

      let referenceDateRounded = Math.round(timestamps[0]) * 1000;
      let referenceDateAsDate = new Date(referenceDateRounded);
      let referenceDateFormatted =
        '' + generateDateString(referenceDateAsDate).toString() + '';

      let basicJSON = JSON.stringify({
        fileName:
          'hr.fitbit_hr.0._' +
          referenceDateFormatted +
          '__n' +
          timestamps.length +
          '.csv',
        content: contentString,
      });

      let queryJSON = {};
      queryJSON['token'] = userToken;
      let contentPayload = {};
      contentPayload[referenceDateFormatted] = basicJSON;
      queryJSON['content'] = contentPayload;

      fetch(UrlReceiveHR, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryJSON),
      })
        .then(response => {
          if (response.status === 200 && response.ok) {
            return response.json();
          }
          throw new Error(`Response failed: ${response.status}`);
        })
        .then(jsonData => {
          let calmValue = Object.values(
            jsonData.predicted_calm_value,
          )[0] as number;
          console.log('calmValue ===> ', calmValue);
          const timestamp = jsonData.timestamp_utc || Date.now();
          store.dispatch(
            moodSlice.actions.addHrvScore([calmValue / 100, timestamp]),
          ),
            /* We need to update the mood but it refreshes and tries to send again */
            store.dispatch(moodSlice.actions.recalculateMood());
          console.log('currentMood = ', currentMood);
        })
        .catch(error => {
          if (error.status === 500) {
            console.log(
              "Backend error, but let's not console.error and blow up the app",
            );
          }
          // console.error(error);
        });
    }
  } catch (err) {
    console.log(`Failed to start watch session: ${err}`);
  }
}

export async function updateHeartRatesApple() {
  try {
    try {
      console.log('Trying to start watch session in android');
      UniqueIdModule.startWatchSession('').then(async () => {
        console.log('Started watch session in android');
      });
    } catch (err) {
      console.log(`Failed to start watch session: ${err}`);
    }
    const hrResult = await UniqueIdModule.getHeartRates('');
    const heartRates = hrResult.heartrates;

    if (!heartRates) {
      return;
    } else {
      getCalmFromHeartRatesAndUpdateStore(heartRates);
    }
    console.log(`${Date.now()}: HR is: ` + heartRates);
  } catch (err) {
    console.log(`Failed to read HR: ${err}`);
  }
}

import {Alert, Button, Linking, StyleSheet, View} from 'react-native';

export const playSong = (token: string) => {
  fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      context_uri: 'spotify:album:5ht7ItJgpBH7W6vJ5BqpPr',
    }),
  }).then(response => {
    console.log(response);
  });
};

export const openSpotifyURI = async (uri: string) => {
  const supported = await Linking.canOpenURL(uri);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(uri);
  } else {
    Alert.alert(`Don't know how to open this URL: ${uri}`);
  }
};

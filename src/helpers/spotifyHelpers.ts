import {Alert, Button, Linking, StyleSheet, View} from 'react-native';
import EmotionState from '../constants/emotionState';
import store from '../store/combinedStore';
import spotifySlice, {MasterPlaylistIds} from '../store/spotifySlice';

const BASE_SPOTIFY_URL = `https://open.spotify.com/playlist`;

export const openSpotifyPlaylistForMood = async (spotifyMood: EmotionState) => {
  const storeIdKey = `${spotifyMood.toLowerCase()}PlaylistId`;
  const moodPlaylistId = store.getState().spotify[storeIdKey];
  const uri = `${BASE_SPOTIFY_URL}/${moodPlaylistId}`;
  const supported = await Linking.canOpenURL(uri);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(uri);
  } else {
    Alert.alert(`Don't know how to open this URL: ${uri}`);
  }
};

export const getUserId = (token: string) => {
  const url = 'https://api.spotify.com/v1/me/';
  const request = fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      }
      throw new Error(`Failed to parse to json: ${response.body}`);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  return request;
};

export interface PlaylistOptions {
  name: string;
  public?: boolean;
  collaborative?: boolean;
  description?: string;
}

export const getPlaylistSongs = (token: string, playlistId: string) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;
  const request = fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.status === 200 && response.ok) {
        return response.json();
      }
      throw new Error(
        `Failed to load playlist ${playlistId}: ` +
          `${response.status} ${response.statusText}`,
      );
    })
    .then(responseJson => {
      return responseJson.items
        .map(item => item?.track?.uri)
        .filter(item => !!item);
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  return request;
};

export const createPlaylist = (
  token: string,
  userId: string,
  playlistConfiguration: PlaylistOptions,
) => {
  const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
  const request = fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlistConfiguration),
  })
    .then(response => {
      if (response.status === 201 && response.ok) {
        return response.json();
      }
      throw new Error(
        `Failed to create playlist ${playlistConfiguration.name}: ` +
          `${response.status} ${response.statusText}`,
      );
    })
    .then(responseJson => {
      return responseJson.id;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
  return request;
};

export const addSongsToPlaylist = (
  token: string,
  playlistId: string,
  songUris: string[],
) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const request = fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({uris: songUris}),
  }).then(response => {
    if (response.status === 201 && response.ok) {
      return true;
    }
    throw new Error(
      `Failed to add songs to playlist ${playlistId}: ` +
        `${response.status} ${response.statusText}`,
    );
  });
  return request;
};

export const setupPlaylist: (
  token: string,
  userId: string,
  playlistId: string,
  options: PlaylistOptions,
) => Promise<string> = async (token, userId, playlistId, options) => {
  const playlistSongs = await getPlaylistSongs(token, playlistId);
  const newPlaylistId = await createPlaylist(token, userId, options);
  await addSongsToPlaylist(token, newPlaylistId, playlistSongs);
  return newPlaylistId;
};

export const setupSpotifyIntegration: (
  token: string,
  makePlaylistsPublic: boolean,
) => Promise<void> = async (token, makePlaylistsPublic) => {
  const userData = await getUserId(token);
  const userId = userData?.id;
  if (userId) {
    store.dispatch(spotifySlice.actions.setUserId(userId));
    console.log(`User id was set to ${userId}.`);
    const mellowPlaylistId = await setupPlaylist(
      token,
      userId,
      MasterPlaylistIds.Mellow,
      {
        name: 'My Mellow playlist',
        public: makePlaylistsPublic,
      },
    );
    store.dispatch(spotifySlice.actions.setMellowPlaylistId(mellowPlaylistId));

    const flowPlaylistId = await setupPlaylist(
      token,
      userId,
      MasterPlaylistIds.Flow,
      {
        name: 'My Flow playlist',
        public: makePlaylistsPublic,
      },
    );
    store.dispatch(spotifySlice.actions.setFlowPlaylistId(flowPlaylistId));

    const gogogoPlaylistId = await setupPlaylist(
      token,
      userId,
      MasterPlaylistIds.GoGoGo,
      {
        name: 'My Gogogo playlist',
        public: makePlaylistsPublic,
      },
    );
    store.dispatch(spotifySlice.actions.setGogogoPlaylistId(gogogoPlaylistId));

    console.log(
      `Set these playlist ids: ${mellowPlaylistId}, ${flowPlaylistId}, ${gogogoPlaylistId}.`,
    );
    store.dispatch(spotifySlice.actions.setToken(token));
  } else {
    console.error('Failed to receive user data');
  }
};

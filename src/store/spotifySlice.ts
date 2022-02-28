import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import {NativeModules} from 'react-native';
import {ColorsRgb} from '../constants/colors';
const SharedStorage = NativeModules.SharedStorage;

export const MasterPlaylistIds = {
  [EmotionState.Mellow]: '7CgSpnKvsQEzjL8xMPaWxk',
  [EmotionState.Flow]: '3BtMqXExrfYmKTBESU4RSA',
  [EmotionState.GoGoGo]: '3qV8M4EfWbHgsW81CtyIjt',
};

const spotifySlice = createSlice({
  name: 'spotify',
  initialState: {
    token: undefined,
    userId: undefined,
    flowPlaylistId: MasterPlaylistIds.Flow,
    mellowPlaylistId: MasterPlaylistIds.Mellow,
    gogogoPlaylistId: MasterPlaylistIds.GoGoGo,
  },
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setFlowPlaylistId: (state, action: PayloadAction<string>) => {
      state.flowPlaylistId = action.payload;
    },
    setMellowPlaylistId: (state, action: PayloadAction<string>) => {
      state.mellowPlaylistId = action.payload;
    },
    setGogogoPlaylistId: (state, action: PayloadAction<string>) => {
      state.gogogoPlaylistId = action.payload;
    },
  },
});

export default spotifySlice;

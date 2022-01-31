import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    onboardingFinished: false,
  },
  reducers: {
    setOnboardingFinished: (state, action: PayloadAction<boolean>) => {
      state.onboardingFinished = action.payload;
    },
  },
});

export default settingsSlice;

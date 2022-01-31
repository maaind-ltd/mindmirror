import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import {NativeModules} from 'react-native';
import {ColorsRgb} from '../constants/colors';
const SharedStorage = NativeModules.SharedStorage;

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    currentMood: EmotionStateWithNone.NoEmotion,
    targetMood: EmotionState.Flow,
  },
  reducers: {
    setCurrentMood: (state, action: PayloadAction<EmotionStateWithNone>) => {
      state.currentMood = action.payload;
      SharedStorage.set(
        JSON.stringify({
          name:
            action.payload === EmotionStateWithNone.NoEmotion
              ? 'No measured mood'
              : action.payload,
          color: ColorsRgb[action.payload as keyof typeof ColorsRgb],
        }),
      );
    },
    setTargetMood: (state, action: PayloadAction<EmotionState>) => {
      state.targetMood = action.payload;
    },
  },
});

export default moodSlice;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import EmotionState, { EmotionStateWithNone } from '../constants/emotionState';

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    currentMood: EmotionStateWithNone.NoEmotion,
		targetMood: EmotionState.Flow
  },
  reducers: {
    setCurrentMood: (state, action: PayloadAction<EmotionStateWithNone>) => {
      state.currentMood = action.payload;
    },
    setTargetMood: (state, action: PayloadAction<EmotionState>) => {
      state.targetMood = action.payload;
    }
  }
});

export default moodSlice;
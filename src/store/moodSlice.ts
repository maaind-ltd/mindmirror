import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import {NativeModules} from 'react-native';
import {ColorsRgb} from '../constants/colors';
import {uniqueId} from 'lodash';
const SharedStorage = NativeModules.SharedStorage;

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    randomId: Date.now(),
    lastScores: [],
    currentScore: 0.5,
    isRecording: false,
    currentMood: EmotionStateWithNone.NoEmotion,
    targetMood: EmotionState.Flow,
  },
  reducers: {
    startRecording: state => {
      state.lastScores = [];
      state.isRecording = true;
    },
    addCurrentScore: (state, action: PayloadAction<number>) => {
      state.lastScores = [...state.lastScores, action.payload];
    },
    stopRecording: state => {
      state.currentScore =
        state.lastScores.reduce((sum, score) => sum + score, 0) /
        (state.lastScores.length || 1);
      state.lastScores = [];
      if (state.currentScore < 0.33) {
        state.currentMood = EmotionStateWithNone.Mellow;
      } else if (state.currentScore < 0.67) {
        state.currentMood = EmotionStateWithNone.Flow;
      } else {
        state.currentMood = EmotionStateWithNone.GoGoGo;
      }
      state.isRecording = false;
    },
    setCurrentMood: (state, action: PayloadAction<EmotionStateWithNone>) => {
      state.currentMood = action.payload;
      const sharedJsonString = JSON.stringify({
        name:
          action.payload === EmotionStateWithNone.NoEmotion
            ? 'No measured mood'
            : action.payload,
        colors: ColorsRgb[action.payload as keyof typeof ColorsRgb],
      });
      console.log(sharedJsonString);
      SharedStorage.set(sharedJsonString);
    },
    setTargetMood: (state, action: PayloadAction<EmotionState>) => {
      state.targetMood = action.payload;
    },
  },
});

export default moodSlice;

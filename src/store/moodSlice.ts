import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import EmotionState, {EmotionStateWithNone} from '../constants/emotionState';
import {NativeModules} from 'react-native';
import {ColorsRgb} from '../constants/colors';
import {isAndroid} from '../helpers/accessoryFunctions';
const SharedStorage = NativeModules.SharedStorage;
const UniqueIdModule = NativeModules.UniqueIdModule;

const HRV_MAX_OLDNESS_MS = 60 * 30 * 1000;
const VOICE_MAX_OLDNESS_MS = 60 * 30 * 1000;

const MELLOW_THRESHHOLD = 0.43;
const FLOW_THRESSHOLD = 0.37;

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    randomId: Date.now(),
    lastScores: [],
    currentVoiceScore: -1,
    voiceScoreTimestamp: -Infinity,
    currentHrvScore: -1,
    hrvScoreTimestamp: -Infinity,
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
      console.log(`Received scores are ${state.lastScores}`);
      state.currentVoiceScore =
        state.lastScores.reduce((sum, score) => sum + score, 0) /
        (state.lastScores.length || 1);
      state.voiceScoreTimestamp = Date.now();
      state.isRecording = false;
    },
    addHrvScore: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0) {
        state.currentHrvScore = action.payload;
        state.hrvScoreTimestamp = Date.now();
      }
    },
    recalculateMood: state => {
      const scores: Array<number> = [];

      if (
        state.currentHrvScore > 0 &&
        state.hrvScoreTimestamp > Date.now() - HRV_MAX_OLDNESS_MS
      ) {
        scores.push(state.currentHrvScore);
      }

      if (
        state.currentVoiceScore > 0 &&
        state.voiceScoreTimestamp > Date.now() - VOICE_MAX_OLDNESS_MS
      ) {
        scores.push(state.currentVoiceScore);
      }

      if (scores.length === 0) {
        state.currentScore = -1;
        state.currentMood = EmotionStateWithNone.NoEmotion;
      } else {
        console.log(scores);
        state.currentScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        console.log(`Calculated score: ${state.currentScore}`);
        if (state.currentScore > MELLOW_THRESHHOLD) {
          state.currentMood = EmotionStateWithNone.Mellow;
        } else if (state.currentScore > FLOW_THRESSHOLD) {
          state.currentMood = EmotionStateWithNone.Flow;
        } else {
          state.currentMood = EmotionStateWithNone.GoGoGo;
        }
      }

      const moodText =
        state.currentMood === EmotionStateWithNone.NoEmotion
          ? 'No measured mood'
          : state.currentMood;
      const sharedJsonString = JSON.stringify({
        name: moodText,
        colors: ColorsRgb[state.currentMood as keyof typeof ColorsRgb],
      });
      SharedStorage.set(sharedJsonString);
      if (!isAndroid) {
        UniqueIdModule.setWatchMood(state.currentMood);
      }
    },
    cancelRecording: state => {
      state.lastScores = [];
      state.isRecording = false;
    },
    setCurrentMood: (state, action: PayloadAction<EmotionStateWithNone>) => {
      state.currentMood = action.payload;

      const moodText =
        state.currentMood === EmotionStateWithNone.NoEmotion
          ? 'No measured mood'
          : state.currentMood;
      const sharedJsonString = JSON.stringify({
        name: moodText,
        colors: ColorsRgb[action.payload as keyof typeof ColorsRgb],
      });
      SharedStorage.set(sharedJsonString);
      if (!isAndroid) {
        UniqueIdModule.setWatchMood(state.currentMood);
      }
    },
    setTargetMood: (state, action: PayloadAction<EmotionState>) => {
      state.targetMood = action.payload;
    },
  },
});

export default moodSlice;

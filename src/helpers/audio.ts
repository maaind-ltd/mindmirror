import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import Permissions from 'react-native-permissions';
import {uniqueId} from 'lodash';
import {fetchEmotionScoreForAudioFileContent} from './voiceCheckinHelpers';
import {getTypedState} from '../store/combinedStore';

export enum BreathingType {
  PURSEDLIP = 'PURSEDLIP',
  CLASSIC = 'CLASSIC',
  PANTING = 'PANTING',
}

export enum SoundSuggestionType {
  FLOW = 'FLOW',
  MELLOW = 'MELLOW',
  GOGOGO = 'GOGOGO',
  FLOW_BREATHING = 'FLOW_BREATHING',
  GOGOGO_BREATHING = 'GOGOGO_BREATHING',
}

export enum SoundSuggestionDurationsSecond {
  FLOW = 160,
  MELLOW = 910,
  GOGOGO = 1800,
  FLOW_BREATHING = 160,
  GOGOGO_BREATHING = 51,
}

export enum SoundResource {
  // tslint:disable: no-var-requires
  BREATHING_PURSEDLIP = require('../audio/breathing_pursedlip.mp3'),
  BREATHING_CLASSIC = require('../audio/breathing_classic.mp3'),
  BREATHING_PANTING = require('../audio/breathing_panting.mp3'),
  FLOW_SOUND = require('../audio/flow_sound.mp3'),
  FLOW_BREATHING = require('../audio/flow_breathing.mp3'),
  MELLOW_SOUND = require('../audio/mellow_sound.mp3'),
  GOGOGO_SOUND = require('../audio/gogogo_sound.mp3'),
}

export const SoundData = {
  // tslint:disable: no-var-requires
  BREATHING_PURSEDLIP: require('../audio/breathing_pursedlip.js') as number[][],
  BREATHING_CLASSIC: require('../audio/breathing_classic.js') as number[][],
};

let soundEffect: Sound | undefined;
let currentlyPlaying: SoundResource | undefined;
let playBackPromise: Promise<boolean> | undefined;

let numChunksReceived: number = 0;

let isCurrentlyRecording: boolean = false;

/**
 * Plays the passed sound resource. If no sound is currently playing, or the passed sound is
 * different from the one currently playing, the current playback is stopped and the passed sound
 * is started at the beginning. If the passed sound is already playing, it just keeps playing.
 * @param sound
 * @returns a promise that resolves once the sound playback is finished
 */
export const playSound = (sound: SoundResource) => {
  if (currentlyPlaying && currentlyPlaying === sound && playBackPromise) {
    return playBackPromise;
  }

  stopSound();

  playBackPromise = new Promise((resolve, reject) => {
    soundEffect = new Sound(sound, error => {
      if (error) {
        console.log('Failed to load sound', error);
        currentlyPlaying = undefined;
        reject(error);
        return;
      }
      currentlyPlaying = sound;
      console.log('Playing sound');
      soundEffect!.play(success => {
        currentlyPlaying = undefined;
        resolve(success);
      });
    });
  });
  return playBackPromise;
};

/**
 * Stops playback of the current sound. Save to call even if no sound is currently playing.
 */
export const stopSound = () => {
  if (soundEffect) {
    soundEffect!.stop();
    soundEffect!.release();
  }
  currentlyPlaying = undefined;
  console.log('Stoping sound');
};

/**
 * Returns a promise that resolves with the current milliseconds of playback time of the currently
 * played sound file. If no sound is currently playing, the promise will resolve with 0.
 */
export const getCurrentPlaybackTimeMs: () => Promise<number> = () => {
  return new Promise((resolve, _reject) => {
    if (!soundEffect) {
      resolve(0);
      return;
    }
    soundEffect.getCurrentTime(seconds => {
      resolve(seconds * 1000);
      return;
    });
  });
};

/**
 * Checks whether microphone permissions for android or ios have already been granted, and requests
 * those permissions otherwise
 * @returns A Promise that resolves once permissions were granted.
 */
export const checkPermission = async () => {
  const checkOnAndroid = await Permissions.check(
    Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
  );
  const checkOnIos = await Permissions.check(
    Permissions.PERMISSIONS.IOS.MICROPHONE,
  );
  console.log('permission check android:', checkOnAndroid);
  console.log('permission check iOS:', checkOnIos);
  if (checkOnAndroid === 'granted' || checkOnIos === 'granted') {
    return;
  }

  const requestOnAndroid = await Permissions.request(
    Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
  );
  const requestOnIos = await Permissions.request(
    Permissions.PERMISSIONS.IOS.MICROPHONE,
  );
  console.log('permission request android:', requestOnAndroid);
  console.log('permission request iOS:', requestOnIos);
};

let isDeliveringData = false;

/**
 * Starts recording audio data and pushing them to the server. Assumes that permissions were already
 * given.
 */
const startRecording = (onDataCallback: (data: string) => void) => {
  const options = {
    sampleRate: 44100,
    channels: 1,
    bitsPerSample: 8,
    wavFile: `temp_file_${uniqueId()}.wav`,
  };
  AudioRecord.init(options);

  // Configure sound for recording during playback.
  Sound.setCategory('PlayAndRecord', true);
  Sound.setMode('Default');

  AudioRecord.on('data', onDataCallback);

  AudioRecord.start();
};

let chunkNumberThreshold: number = 25;

export const startVoiceRecording = () => {
  console.log('Starting voice recording');
  startRecording(data => {
    isCurrentlyRecording = true;
    if (data) {
      numChunksReceived++;
      if (numChunksReceived >= chunkNumberThreshold && !isDeliveringData) {
        isDeliveringData = true;
        stopRecording();
      }
    }
  });
};

/**
 * Stops the current audio recording, and submits the collected data to the server.
 */
export const stopRecording = async () => {
  try {
    if (!isCurrentlyRecording) {
      AudioRecord.start();
      isCurrentlyRecording = true;
      return;
    }
    isCurrentlyRecording = false;

    const audioFile = await AudioRecord.stop();
    // console.log(audioFile);
    console.log('Audio recording stopped.');
    try {
      const encodedContent = await RNFS.readFile(audioFile, 'base64');

      numChunksReceived = 0;

      // console.log('Sending audio sample.');
      fetchEmotionScoreForAudioFileContent(encodedContent);
    } catch (error) {
      console.log(error);
    }
  } catch (errorOnStop) {
    console.log(errorOnStop);
  } finally {
    isDeliveringData = false;
    if (getTypedState().mood.isRecording) {
      AudioRecord.start();
    }
  }
};

/**
 * Stops the current audio recording and discards its content.
 */
export const stopRecordingAndDiscardAudio = async () => {
  console.log('Stopping audio recording.');
  try {
    if (isCurrentlyRecording) {
      AudioRecord.stop();
    }
  } catch (errorOnStop) {
    console.log(errorOnStop);
  }
  console.log('audio recording stopped.');
  return true;
};

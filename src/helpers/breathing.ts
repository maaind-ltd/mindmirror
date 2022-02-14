import {BreathingType} from './audio';

export interface BreathingExperienceTiming {
  introTimeMs: number;
  breathInTimeMs: number;
  breathInHoldTimeMs: number;
  breathOutTimeMs: number;
  breathOutHoldTimeMs: number;
}

export const BreathingTiming = {
  [BreathingType.PURSEDLIP]: {
    introTimeMs: 9750,
    breathInTimeMs: 8500,
    breathInHoldTimeMs: 4900,
    breathOutTimeMs: 5830,
    breathOutHoldTimeMs: 3670,
  },
  [BreathingType.CLASSIC]: {
    introTimeMs: 8550,
    breathInTimeMs: 4500,
    breathInHoldTimeMs: 2500,
    breathOutTimeMs: 3700,
    breathOutHoldTimeMs: 2335,
  },
};

/**
 * Returns a factor between 0 and 1 for how much of the active volume of the breathing circle
 * should be shown at the passed time.
 * @param timeMs
 * @param timingData the structed data for the specific breathing experience
 */
export const getBreathCircleVolume = (
  timeMs: number,
  timingData: BreathingExperienceTiming,
) => {
  const {
    introTimeMs,
    breathInTimeMs,
    breathInHoldTimeMs,
    breathOutTimeMs,
    breathOutHoldTimeMs,
  } = timingData;

  if (timeMs < introTimeMs) {
    return 0;
  }

  const repetitionTime =
    breathInTimeMs + breathInHoldTimeMs + breathOutTimeMs + breathOutHoldTimeMs;
  const timeInRepetition = (timeMs - introTimeMs) % repetitionTime;

  if (timeInRepetition <= breathInTimeMs) {
    // breath in part
    return timeInRepetition / breathInTimeMs;
  }
  if (timeInRepetition <= breathInTimeMs + breathInHoldTimeMs) {
    // breath in hold part
    return 1;
  }
  if (
    timeInRepetition <=
    breathInTimeMs + breathInHoldTimeMs + breathOutTimeMs
  ) {
    // breath out part
    const timeInBreathOut =
      timeInRepetition - (breathInTimeMs + breathInHoldTimeMs);
    return 1 - timeInBreathOut / breathOutTimeMs;
  }
  return 0; // breath out hold part
};

/**
 * Returns a factor between 0 and 1 for how much of the active volume of the breathing circle
 * should be shown at the passed time.
 * @param timeMs
 * @param timingData the structed data for the specific breathing experience
 */
export const getBreathingText = (
  timeMs: number,
  timingData: BreathingExperienceTiming,
) => {
  const {
    introTimeMs,
    breathInTimeMs,
    breathInHoldTimeMs,
    breathOutTimeMs,
    breathOutHoldTimeMs,
  } = timingData;

  if (timeMs < introTimeMs) {
    return '';
  }

  const repetitionTime =
    breathInTimeMs + breathInHoldTimeMs + breathOutTimeMs + breathOutHoldTimeMs;
  const timeInRepetition = (timeMs - introTimeMs) % repetitionTime;

  if (timeInRepetition <= breathInTimeMs) {
    // breath in part
    return 'INHALE';
  }
  if (timeInRepetition <= breathInTimeMs + breathInHoldTimeMs) {
    // breath in hold part
    return 'HOLD';
  }
  if (
    timeInRepetition <=
    breathInTimeMs + breathInHoldTimeMs + breathOutTimeMs
  ) {
    // breath out part
    const timeInBreathOut =
      timeInRepetition - (breathInTimeMs + breathInHoldTimeMs);
    return 'EXHALE';
  }
  return 'EXHALE';
};

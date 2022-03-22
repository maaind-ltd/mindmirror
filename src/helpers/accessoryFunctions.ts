import { Platform } from 'react-native';

export function capAt0to100(input: any): number {
  let result = input;
  if (typeof input === typeof 1) {
    result = Math.max(Math.min(input, 100), 0);
  }
  return result;
}

const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function generateUid() {
  let uid = 'DI-';
  for (let i = 0; i < 29; i++) {
    const charIndex = Math.floor(Math.random() * allowedCharacters.length);
    uid += allowedCharacters[charIndex];
  }
  return uid;
}

export const isAndroid = Platform.OS === 'android';
export const majorVersionIOS = parseInt(Platform.Version, 10);
console.log(`major version is ${majorVersionIOS}.`);
export const MobileVersionWithNotch = !isAndroid && majorVersionIOS >= 10;
console.log(`has notch? ${MobileVersionWithNotch}.`);

export const getTimeMsStringRepresentation = (time: number) => {
  const minutes = Math.floor(time / 60 / 1000);
  const seconds = Math.floor((time - minutes * 60 * 1000) / 1000);
  return `${minutes}`.padStart(2, '0') + ':' + `${seconds}`.padStart(2, '0');
};

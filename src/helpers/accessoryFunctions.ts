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

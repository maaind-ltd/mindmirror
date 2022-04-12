export const SmartlookKey = '8cef7d014228632835b14eb23bd97fbc522564ed';

export const isValidActivationKey = (activationKey: string) => {
  if (activationKey.length !== 8) {
    return false;
  }
  const upperCaseKey = activationKey.toUpperCase();
  let charSum = 0;
  for (let i = 0; i < upperCaseKey.length; i++) {
    charSum += upperCaseKey.charCodeAt(i);
  }
  return charSum === 620;
};

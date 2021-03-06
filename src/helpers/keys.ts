import {UrlActivateKey} from '../constants/urls';

export const SmartlookKey = 'a41c55c567fd176b450f5dac2c0e70869d10ceab';

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

export const useActivationCode = async (activationCode: string) => {
  try {
    console.log(`Trying to activate with code: ${activationCode}`);

    const response = await fetch(UrlActivateKey, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: `{"activation_code": "${activationCode}"}`,
    });
    if (response.status === 200 && response.ok) {
      return true;
    }
    console.log(`Failed to use activation code: ${response.status}`);
    return false;
  } catch (error) {
    console.log(`Failed to use activation code: ${error}`);
  }

  return false;
};

// Use this to generate activation keys - they still need to get to the server
// const possibleCodes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// const codes = [];
// let createCode = () => {
//   let chars = '';
//   let charSum = 0;
//   while (charSum < 620 - 90 || charSum > 620 - 65) {
//     chars = '';
//     charSum = 0;
//     for (let i = 0; i < 7; i++) {
//       chars += possibleCodes[Math.floor(Math.random() * possibleCodes.length)];
//       charSum += chars.charCodeAt(i);
//     }
//   }
//   chars += possibleCodes[620 - charSum - 65 /* char code of 'A' */];
//   charSum += chars.charCodeAt(7);
//   if (charSum !== 620) {
//     console.error('Failure while trying to create activation code.');
//   }
//   codes.push(chars);
// };

// for (let i = 0; i <= 500; i++) {
//   createCode();
// }

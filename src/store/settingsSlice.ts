import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AvatarType} from '../constants/avatarImages';
import {generateUid} from '../helpers/accessoryFunctions';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    onboardingFinished: false,
    userName: '',
    avatarType: AvatarType.Cat,
    userToken: '',
  },
  reducers: {
    setOnboardingFinished: (state, action: PayloadAction<boolean>) => {
      state.onboardingFinished = action.payload;
    },
    setAvatarType: (state, action: PayloadAction<AvatarType>) => {
      state.avatarType = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },
  },
});

export default settingsSlice;

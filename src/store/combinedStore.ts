import {createSlice, configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import moodSlice from './moodSlice';
import settingsSlice from './settingsSlice';

const reducers = {
  mood: moodSlice.reducer,
  settings: settingsSlice.reducer,
};

type ReducersType = typeof reducers;

export type CombinedStore = {
  [P in keyof ReducersType]: ReturnType<ReducersType[P]>;
};

const store = configureStore({
  reducer: reducers,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useCombinedStore<T>(selector: (store: CombinedStore) => T): T {
  return useSelector<CombinedStore, T>(selector);
}

export default store;

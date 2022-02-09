import {
  createSlice,
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import moodSlice from './moodSlice';
import settingsSlice from './settingsSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const reducers = {
  mood: moodSlice.reducer,
  settings: settingsSlice.reducer,
};

const combinedReducers = combineReducers(reducers);

type ReducersType = typeof reducers;

const persistedReducer = persistReducer(persistConfig, combinedReducers);

export type CombinedStore = {
  [P in keyof ReducersType]: ReturnType<ReducersType[P]>;
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      /* ignore persistance actions */
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useCombinedStore<T>(selector: (store: CombinedStore) => T): T {
  return useSelector<CombinedStore, T>(selector);
}

export default store;

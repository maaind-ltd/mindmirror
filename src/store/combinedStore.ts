import {
  createSlice,
  configureStore,
  combineReducers,
  getDefaultMiddleware,
  Reducer,
  AnyAction,
  createStore,
  Store,
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
import AsyncStorage from '@react-native-community/async-storage';
import spotifySlice from './spotifySlice';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'v1',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const reducers = {
  mood: moodSlice.reducer,
  settings: settingsSlice.reducer,
  spotify: spotifySlice.reducer,
};

const combinedReducers = combineReducers(reducers);

type ReducersType = typeof reducers;

const persistedReducer = persistReducer(
  persistConfig,
  combinedReducers as Reducer<unknown, AnyAction>,
);

export type CombinedStore = {
  [P in keyof ReducersType]: ReturnType<ReducersType[P]>;
};

export type TypedStore = Store<CombinedStore, AnyAction>;

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      /* ignore persistance actions */
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export function useCombinedStore<T>(selector: (store: CombinedStore) => T): T {
  return useSelector<CombinedStore, T>(selector);
}

export default store;

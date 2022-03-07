import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
  Reducer,
  AnyAction,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import spotifySlice from './spotifySlice';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

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

// Persist somehow messes up the getState typing, this allows us to use it properly typed
export const getTypedState = () => store.getState() as unknown as CombinedStore;

export function useCombinedStore<T>(selector: (store: CombinedStore) => T): T {
  return useSelector<CombinedStore, T>(selector);
}

export function useStackNavigation() {
  return useNavigation() as StackNavigationProp<any>;
}

export default store;

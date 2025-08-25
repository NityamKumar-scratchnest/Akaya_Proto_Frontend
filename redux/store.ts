import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import authReducer from './slices/authSlice';
import devicesReducer from './slices/devicesSlice';
import sensorReducer from './slices/sensorLogsSlice';
import settingsReducer from './slices/settingsSlice';
import userLogReducer from './slices/userLogsSlice'
// Load storage only when needed to avoid bundler errors
let persistStorage;
if (Platform.OS === 'web') {
  persistStorage = require('redux-persist/lib/storage').default; // localStorage for web
} else {
  persistStorage = AsyncStorage; // native
}

const persistConfig = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['auth', 'devices'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  devices: devicesReducer,
  settings: settingsReducer,
  sensorLogs : sensorReducer,
   userLogs: userLogReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

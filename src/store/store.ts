import { configureStore } from '@reduxjs/toolkit';
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
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';
import { authApi } from './api/authApi';
import { interestsApi } from './api/interestsApi';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], //Things you want to persist
  //blacklist: [], //Things you don't want to persist
};

const reducers = combineReducers({
  auth: authReducer, //This reducer is to set credentials & consume state in application
  snackbar: snackbarReducer, //Snackbar state (no persist)
  [authApi.reducerPath]: authApi.reducer, //RTK Query API reducer
  [interestsApi.reducerPath]: interestsApi.reducer, //RTK Query Interests API reducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, interestsApi.middleware),
});

export const persistor = persistStore(store);

export default store;
// Define the root state type from the original reducers, not the persisted store
export type RootState = ReturnType<typeof reducers>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

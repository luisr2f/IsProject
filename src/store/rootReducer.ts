import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
});

export { rootReducer };
export type RootReducerType = ReturnType<typeof rootReducer>;

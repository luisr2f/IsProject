import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiration: string | null;
  userid: string | null;
  username: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  expiration: null,
  userid: null,
  username: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        expiration: string;
        userid: string;
        username: string;
        rememberMe?: boolean;
      }>,
    ) => {
      // Si el estado es null (durante rehidratación), usar initialState
      if (!state) {
        return {
          ...initialState,
          token: action.payload.token,
          expiration: action.payload.expiration,
          userid: action.payload.userid,
          username: action.payload.username,
          rememberMe: action.payload.rememberMe ?? false,
          isAuthenticated: true,
        };
      }
      state.token = action.payload.token;
      state.expiration = action.payload.expiration;
      state.userid = action.payload.userid;
      state.username = action.payload.username;
      state.rememberMe = action.payload.rememberMe ?? false;
      state.isAuthenticated = true;
    },
    logout: state => {
      // Si el estado es null (durante rehidratación), usar initialState
      if (!state) {
        return initialState;
      }
      state.isAuthenticated = false;
      state.token = null;
      state.expiration = null;
      state.userid = null;
      state.username = null;
      state.rememberMe = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

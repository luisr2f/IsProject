import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiration: string | null;
  userid: string | null;
  username: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  expiration: null,
  userid: null,
  username: null,
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
      }>,
    ) => {
      state.token = action.payload.token;
      state.expiration = action.payload.expiration;
      state.userid = action.payload.userid;
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.expiration = null;
      state.userid = null;
      state.username = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

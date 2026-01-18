import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SnackbarType = 'error' | 'success' | 'info' | 'warning';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
}

const initialState: SnackbarState = {
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        type?: SnackbarType;
        duration?: number;
      }>,
    ) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.duration = action.payload.duration || 3000;
    },
    hideSnackbar: state => {
      state.visible = false;
    },
    showError: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.message = action.payload;
      state.type = 'error';
      state.duration = 4000;
    },
    showSuccess: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.message = action.payload;
      state.type = 'success';
      state.duration = 3000;
    },
  },
});

export const { showSnackbar, hideSnackbar, showError, showSuccess } =
  snackbarSlice.actions;

export default snackbarSlice.reducer;

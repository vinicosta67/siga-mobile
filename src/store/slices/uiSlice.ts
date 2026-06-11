import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

interface UiState {
  theme: 'light' | 'dark' | 'system';
  toast: ToastState;
}

const initialState: UiState = {
  theme: 'system',
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<ToastState, 'visible'>>) => {
      state.toast = { ...action.payload, visible: true };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const { setTheme, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: UserProfile }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'idle';
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setError: (state) => {
      state.status = 'failed';
    },
  },
});

export const { loginSuccess, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

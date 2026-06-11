import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import journeyReducer from './slices/journeySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journey: journeyReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

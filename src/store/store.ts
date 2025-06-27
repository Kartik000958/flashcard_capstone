import { configureStore } from '@reduxjs/toolkit';
import flashcardReducer from './flashcardSlice';

export const store = configureStore({
  reducer: {
    flashcards: flashcardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Term {
  id: string;
  term: string;
  definition: string;
  image?: string;
}

export interface Flashcard {
  id: string;
  title: string;
  description: string;
  image?: string;
  terms: Term[];
  createdAt: string;
}

interface FlashcardState {
  flashcards: Flashcard[];
}

const loadFromLocalStorage = (): Flashcard[] => {
  try {
    const serializedState = localStorage.getItem('flashcards');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const saveToLocalStorage = (flashcards: Flashcard[]) => {
  try {
    const serializedState = JSON.stringify(flashcards);
    localStorage.setItem('flashcards', serializedState);
  } catch (err) {
    console.error('Could not save flashcards to localStorage', err);
  }
};

const initialState: FlashcardState = {
  flashcards: loadFromLocalStorage(),
};

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    addFlashcard: (state, action: PayloadAction<Omit<Flashcard, 'id' | 'createdAt'>>) => {
      const newFlashcard: Flashcard = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.flashcards.push(newFlashcard);
      saveToLocalStorage(state.flashcards);
    },
    deleteFlashcard: (state, action: PayloadAction<string>) => {
      state.flashcards = state.flashcards.filter(flashcard => flashcard.id !== action.payload);
      saveToLocalStorage(state.flashcards);
    },
  },
});

export const { addFlashcard, deleteFlashcard } = flashcardSlice.actions;
export default flashcardSlice.reducer;
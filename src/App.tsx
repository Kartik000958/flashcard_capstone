import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout/Layout';
import CreateFlashcard from './components/CreateFlashcard/CreateFlashcard';
import MyFlashcards from './components/MyFlashcards/MyFlashcards';
import FlashcardDetails from './components/FlashcardDetails/FlashcardDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CreateFlashcard />} />
            <Route path="my-flashcards" element={<MyFlashcards />} />
            <Route path="flashcard/:id" element={<FlashcardDetails />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
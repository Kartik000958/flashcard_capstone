import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteFlashcard } from '../../store/flashcardSlice';
import { BookOpen, Trash2, X } from 'lucide-react';

const MyFlashcards: React.FC = () => {
  const flashcards = useAppSelector(state => state.flashcards.flashcards);
  const dispatch = useAppDispatch();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null);

  const handleDeleteClick = (flashcardId: string, flashcardTitle: string) => {
    setFlashcardToDelete(flashcardId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (flashcardToDelete) {
      dispatch(deleteFlashcard(flashcardToDelete));
      setDeleteModalOpen(false);
      setFlashcardToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFlashcardToDelete(null);
  };

  const flashcardToDeleteData = flashcards.find(f => f.id === flashcardToDelete);

  if (flashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Flashcard</h1>
          <div className="flex space-x-8 border-b">
            <Link to="/" className="text-gray-500 font-medium pb-2">
              Create New
            </Link>
            <button className="text-red-600 font-medium pb-2 border-b-2 border-red-600">
              My Flashcard
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards yet</h3>
          <p className="text-gray-500 mb-6">Create your first flashcard to get started</p>
          <Link
            to="/"
            className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Create Flashcard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Flashcard</h1>
          <div className="flex space-x-8 border-b">
            <Link to="/" className="text-gray-500 font-medium pb-2">
              Create New
            </Link>
            <button className="text-red-600 font-medium pb-2 border-b-2 border-red-600">
              My Flashcard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((flashcard) => (
            <div key={flashcard.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative group">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteClick(flashcard.id, flashcard.title)}
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                title="Delete flashcard"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="p-6">
                {flashcard.image ? (
                  <div className="w-12 h-12 mb-4 rounded-full overflow-hidden">
                    <img
                      src={flashcard.image}
                      alt={flashcard.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
                  {flashcard.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {flashcard.description}
                </p>
                
                <div className="text-sm text-gray-500 mb-4">
                  {flashcard.terms.length} {flashcard.terms.length === 1 ? 'Card' : 'Cards'}
                </div>
                
                <Link
                  to={`/flashcard/${flashcard.id}`}
                  className="block w-full text-center border border-red-600 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-50 transition-colors"
                >
                  View Cards
                </Link>
              </div>
            </div>
          ))}
        </div>

        {flashcards.length > 6 && (
          <div className="text-center mt-8">
            <button className="text-red-600 font-medium hover:text-red-700">
              See all
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Delete Flashcard</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Are you sure you want to delete this flashcard?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    "{flashcardToDeleteData?.title}"
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">
                This action cannot be undone. All terms and data associated with this flashcard will be permanently deleted.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyFlashcards;
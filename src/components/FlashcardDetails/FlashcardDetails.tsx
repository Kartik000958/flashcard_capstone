import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { ArrowLeft, Share2, Download, Printer, ChevronLeft, ChevronRight, X, Copy, Facebook, Linkedin, MessageCircle, Twitter, Mail } from 'lucide-react';

const FlashcardDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const flashcard = useAppSelector(state => 
    state.flashcards.flashcards.find(f => f.id === id)
  );
  
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!flashcard) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcard not found</h2>
          <Link to="/my-flashcards" className="text-blue-600 hover:text-blue-700">
            Go back to My Flashcards
          </Link>
        </div>
      </div>
    );
  }

  const currentTerm = flashcard.terms[currentTermIndex];
  const shareUrl = `${window.location.origin}/flashcard/${flashcard.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handlePrevious = () => {
    setCurrentTermIndex(prev => 
      prev > 0 ? prev - 1 : flashcard.terms.length - 1
    );
  };

  const handleNext = () => {
    setCurrentTermIndex(prev => 
      prev < flashcard.terms.length - 1 ? prev + 1 : 0
    );
  };

  const handleDownload = () => {
    // Create a simple text file with flashcard data
    const content = `${flashcard.title}\n\n${flashcard.description}\n\n` +
      flashcard.terms.map((term, index) => 
        `${index + 1}. ${term.term}\n   ${term.definition}\n`
      ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flashcard.title.replace(/\s+/g, '_')}_flashcards.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/my-flashcards')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{flashcard.title}</h1>
        </div>
        
        <p className="text-gray-600 max-w-4xl">
          {flashcard.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Terms Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">Flashcards</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {flashcard.terms.map((term, index) => (
                <button
                  key={term.id}
                  onClick={() => setCurrentTermIndex(index)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 ${
                    index === currentTermIndex ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {term.term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-8 min-h-96 flex items-center justify-center">
            {currentTerm.image ? (
              <div className="text-center">
                <img
                  src={currentTerm.image}
                  alt={currentTerm.term}
                  className="max-w-full max-h-64 object-contain mx-auto mb-4 rounded-lg"
                />
                <p className="text-gray-700 leading-relaxed">{currentTerm.definition}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 text-lg leading-relaxed max-w-lg">
                  {currentTerm.definition}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <span className="text-sm text-gray-500">
              {currentTermIndex + 1}/{flashcard.terms.length}
            </span>
            
            <button
              onClick={handleNext}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Share</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDetails;
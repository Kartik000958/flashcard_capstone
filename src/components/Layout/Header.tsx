import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log(isLogin ? 'Login submitted' : 'Signup submitted');
    setShowLoginModal(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                AI
              </div>
              <span className="text-xl font-semibold text-gray-800">maBetter</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'text-red-600 border-b-2 border-red-600 pb-2' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create New
              </Link>
              <Link
                to="/my-flashcards"
                className={`text-sm font-medium ${
                  location.pathname === '/my-flashcards' 
                    ? 'text-red-600 border-b-2 border-red-600 pb-2' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Flashcard
              </Link>
            </nav>

            <button 
              onClick={handleLoginClick}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Login/Signup
            </button>
          </div>
        </div>
      </header>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {isLogin ? 'Login' : 'Sign Up'}
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
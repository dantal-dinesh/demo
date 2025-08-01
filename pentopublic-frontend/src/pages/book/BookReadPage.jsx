import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/bookService';
import { 
  ArrowLeft, 
  Settings, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Bookmark,
  Sun,
  Moon
} from 'lucide-react';

const BookReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(50); // Mock total pages
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock book content - in real app, this would come from the API
  const mockContent = `
    Chapter 1: The Beginning

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

    Chapter 2: The Journey Continues

    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.

    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

    Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
  `;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const result = await bookService.getBookById(id);
        
        if (result.success) {
          setBook(result.data);
          // Load user's reading progress if available
          const savedPage = localStorage.getItem(`book_${id}_page`);
          if (savedPage) {
            setCurrentPage(parseInt(savedPage));
          }
        } else {
          console.error('Failed to fetch book:', result.error);
          navigate('/books');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        navigate('/books');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, navigate]);

  // Save reading progress
  useEffect(() => {
    if (book && currentPage > 1) {
      localStorage.setItem(`book_${id}_page`, currentPage.toString());
    }
  }, [id, book, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFontSizeChange = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, save bookmark to backend
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <button onClick={() => navigate('/books')} className="btn-primary">
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`book-reader ${isDarkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <header className={`sticky top-0 z-10 border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/books/${id}`)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div>
                  <h1 className="font-semibold text-lg">{book.title}</h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    by {book.authorName || 'Unknown Author'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-lg transition-colors ${
                    isBookmarked 
                      ? 'text-yellow-500' 
                      : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Page {currentPage} of {totalPages}
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {Math.round((currentPage / totalPages) * 100)}% complete
                </span>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Font Size:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFontSizeChange(-2)}
                        className={`px-3 py-1 rounded text-sm ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        A-
                      </button>
                      <span className="text-sm">{fontSize}px</span>
                      <button
                        onClick={() => handleFontSizeChange(2)}
                        className={`px-3 py-1 rounded text-sm ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded text-sm ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div 
            className="prose max-w-none leading-relaxed"
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* In a real app, this would be the actual book content for the current page */}
            <div className="whitespace-pre-wrap">
              {mockContent}
            </div>
          </div>
        </main>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>

              <div className={`px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <span className="text-sm">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReadPage;
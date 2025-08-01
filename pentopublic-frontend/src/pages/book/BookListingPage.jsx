import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/bookService';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Grid3X3, 
  List,
  ChevronDown
} from 'lucide-react';

const BookListingPage = () => {
  const { isAuthenticated, role } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('title'); // 'title', 'rating', 'recent'
  const [showFilters, setShowFilters] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology'
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const result = await bookService.getAllBooks();
        
        if (result.success) {
          setBooks(result.data);
          setFilteredBooks(result.data);
        } else {
          console.error('Failed to fetch books:', result.error);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = [...books];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedGenre, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSortBy('title');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Books</h1>
          <p className="text-gray-600 text-lg">
            Discover amazing stories from talented authors around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books, authors, or descriptions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="recent">Sort by Recent</option>
                  </select>

                  <button
                    onClick={clearFilters}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>

            {/* View Mode and Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
              </span>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find more books.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredBooks.map((book) => (
              viewMode === 'grid' ? (
                <BookCard key={book.bookId} book={book} isAuthenticated={isAuthenticated} role={role} />
              ) : (
                <BookListItem key={book.bookId} book={book} isAuthenticated={isAuthenticated} role={role} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Grid view component
const BookCard = ({ book, isAuthenticated, role }) => (
  <div className="card p-6 hover:shadow-lg transition-shadow group">
    <Link to={`/books/${book.bookId}`}>
      <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
        <BookOpen className="h-16 w-16 text-primary-600 group-hover:scale-110 transition-transform" />
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
        {book.title}
      </h3>
    </Link>
    
    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{book.description}</p>
    
    <div className="flex items-center justify-between text-sm mb-4">
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{book.genre}</span>
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="text-gray-600">{book.rating || '4.5'}</span>
      </div>
    </div>

    <div className="space-y-2">
      <Link
        to={`/books/${book.bookId}`}
        className="btn-primary w-full text-center block"
      >
        View Details
      </Link>
      
      {isAuthenticated && (
        <Link
          to={`/books/${book.bookId}/read`}
          className="btn-secondary w-full text-center block"
        >
          Read Now
        </Link>
      )}
    </div>
  </div>
);

// List view component
const BookListItem = ({ book, isAuthenticated, role }) => (
  <div className="card p-6 hover:shadow-lg transition-shadow">
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-24 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary-600" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/books/${book.bookId}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                {book.title}
              </h3>
            </Link>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">{book.genre}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{book.rating || '4.5'}</span>
                <span>({book.reviewCount || '0'} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            <Link
              to={`/books/${book.bookId}`}
              className="btn-primary text-center"
            >
              View Details
            </Link>
            
            {isAuthenticated && (
              <Link
                to={`/books/${book.bookId}/read`}
                className="btn-secondary text-center"
              >
                Read Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookListingPage;
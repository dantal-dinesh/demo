import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookService from '../services/bookService';
import { 
  BookOpen, 
  Star, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, role } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredResult, recentResult] = await Promise.all([
          bookService.getFeaturedBooks(),
          bookService.getRecentBooks(8)
        ]);

        if (featuredResult.success) {
          setFeaturedBooks(featuredResult.data);
        }

        if (recentResult.success) {
          setRecentBooks(recentResult.data);
        }

        // Mock top authors data (replace with actual API call)
        setTopAuthors([
          { id: 1, name: 'Sarah Johnson', books: 12, rating: 4.8, avatar: null },
          { id: 2, name: 'Michael Chen', books: 8, rating: 4.7, avatar: null },
          { id: 3, name: 'Emma Wilson', books: 15, rating: 4.9, avatar: null },
          { id: 4, name: 'David Brown', books: 6, rating: 4.6, avatar: null }
        ]);

      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredBooks.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBooks.length) % Math.max(1, featuredBooks.length));
  };

  const getDashboardRoute = () => {
    switch (role) {
      case 'Reader':
        return '/reader/dashboard';
      case 'Author':
        return '/author/dashboard';
      case 'Admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to{' '}
                <span className="text-primary-200">PenToPublic</span>
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed">
                Discover amazing stories, connect with talented authors, and immerse yourself 
                in a world of digital literature. Your next favorite book is just a click away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardRoute()}
                      className="btn-primary bg-white text-primary-600 hover:bg-primary-50 inline-flex items-center space-x-2"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/books"
                      className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center space-x-2"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Browse Books</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary bg-white text-primary-600 hover:bg-primary-50 inline-flex items-center space-x-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/books"
                      className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600 inline-flex items-center space-x-2"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Explore Books</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-primary-200">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5K+</div>
                  <div className="text-primary-200">Authors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-primary-200">Readers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">For Readers</h3>
                      <p className="text-primary-200 text-sm">Access premium content with subscription</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">For Authors</h3>
                      <p className="text-primary-200 text-sm">Publish and monetize your stories</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Growing Community</h3>
                      <p className="text-primary-200 text-sm">Join thousands of book lovers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Carousel */}
      {featuredBooks.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredBooks.map((book) => (
                  <div key={book.bookId} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="order-2 lg:order-1">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{book.genre}</span>
                          </div>
                          
                          <h3 className="text-3xl font-bold text-gray-900">{book.title}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">{book.description}</p>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <span className="font-medium">4.8</span>
                              <span className="text-gray-500">(124 reviews)</span>
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <Link
                              to={`/books/${book.bookId}`}
                              className="btn-primary inline-flex items-center space-x-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>Read Now</span>
                            </Link>
                            <Link
                              to={`/books/${book.bookId}`}
                              className="btn-secondary"
                            >
                              Learn More
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="order-1 lg:order-2">
                        <div className="relative">
                          <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                            <BookOpen className="h-24 w-24 text-primary-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredBooks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Uploads */}
      {recentBooks.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recent Uploads</h2>
              <Link
                to="/books"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentBooks.map((book) => (
                <Link
                  key={book.bookId}
                  to={`/books/${book.bookId}`}
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{book.genre}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">4.5</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Top Authors</h2>
              <Link
                to="/authors"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topAuthors.map((author) => (
                <div key={author.id} className="card p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{author.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{author.books} books</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{author.rating} rating</span>
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full mt-4">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of readers and authors in our growing community. 
              Discover your next favorite book today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary bg-white text-primary-600 hover:bg-primary-50 inline-flex items-center space-x-2"
              >
                <span>Sign Up Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/subscription"
                className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
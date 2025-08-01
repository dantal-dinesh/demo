import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookService from '../../services/bookService';
import reviewService from '../../services/reviewService';
import { 
  BookOpen, 
  Star, 
  User, 
  Calendar, 
  Tag, 
  Download, 
  Play, 
  Heart,
  MessageCircle,
  ArrowLeft,
  Edit3
} from 'lucide-react';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useAuth();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        
        const [bookResult, reviewsResult] = await Promise.all([
          bookService.getBookById(id),
          reviewService.getBookReviews(id)
        ]);

        if (bookResult.success) {
          setBook(bookResult.data);
        } else {
          console.error('Failed to fetch book:', bookResult.error);
          navigate('/books');
        }

        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }

      } catch (error) {
        console.error('Error fetching book details:', error);
        navigate('/books');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        bookId: parseInt(id),
        userId: user.userId,
        rating: newReview.rating,
        comment: newReview.comment
      };

      const result = await reviewService.addReview(reviewData);
      
      if (result.success) {
        // Refresh reviews
        const reviewsResult = await reviewService.getBookReviews(id);
        if (reviewsResult.success) {
          setReviews(reviewsResult.data);
        }
        
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
      } else {
        alert('Failed to submit review: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const canUserRead = () => {
    if (!isAuthenticated) return false;
    if (role === 'Admin') return true;
    if (book?.authorId === user?.userId) return true; // Author can read their own book
    // Add subscription check here if needed
    return true; // For now, all authenticated users can read
  };

  const canUserDownload = () => {
    return canUserRead() && book?.allowDownload !== false;
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
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Link to="/books" className="btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Book Cover */}
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-primary-600" />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {canUserRead() && (
                    <Link
                      to={`/books/${id}/read`}
                      className="btn-primary w-full inline-flex items-center justify-center space-x-2"
                    >
                      <Play className="h-5 w-5" />
                      <span>Read Now</span>
                    </Link>
                  )}

                  {canUserDownload() && (
                    <button className="btn-secondary w-full inline-flex items-center justify-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </button>
                  )}

                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="btn-primary w-full inline-flex items-center justify-center space-x-2"
                    >
                      <span>Login to Read</span>
                    </Link>
                  )}

                  <button className="btn-secondary w-full inline-flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Add to Favorites</span>
                  </button>
                </div>

                {/* Book Stats */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">
                        {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                      </span>
                      <span className="text-gray-500">({reviews.length})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Genre</span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {book.genre}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.isApproved ? 'Published' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Info */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <User className="h-5 w-5" />
                    <span>By {book.authorName || 'Unknown Author'}</span>
                  </div>
                  
                  {book.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-5 w-5" />
                      <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    <Tag className="h-5 w-5" />
                    <span>{book.genre}</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Author Bio */}
            {book.authorBio && (
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{book.authorName}</h4>
                    <p className="text-gray-700">{book.authorBio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reviews ({reviews.length})
                </h3>
                
                {isAuthenticated && role === 'Reader' && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`p-1 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="input-field"
                      placeholder="Share your thoughts about this book..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="btn-primary"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                    <p className="text-gray-600">Be the first to review this book!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.reviewId} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{review.userName || 'Anonymous'}</h5>
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.reviewedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 ml-13">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
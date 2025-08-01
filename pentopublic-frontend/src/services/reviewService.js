import api from './api';

export const reviewService = {
  // Add review for a book
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/review/add', reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add review'
      };
    }
  },

  // Get reviews for a book
  getBookReviews: async (bookId) => {
    try {
      const response = await api.get(`/review/book/${bookId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reviews'
      };
    }
  },

  // Get user's reviews
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/review/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user reviews'
      };
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/review/${reviewId}`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update review'
      };
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/review/${reviewId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete review'
      };
    }
  }
};

export default reviewService;
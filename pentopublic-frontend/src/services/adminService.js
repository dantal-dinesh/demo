import api from './api';

export const adminService = {
  // Get pending books for approval
  getPendingBooks: async () => {
    try {
      const response = await api.get('/admin/pending-books');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch pending books'
      };
    }
  },

  // Approve or reject book
  reviewBook: async (bookId, action, reason = '') => {
    try {
      const response = await api.post(`/admin/review-book/${bookId}`, {
        action, // 'approve' or 'reject'
        reason
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to review book'
      };
    }
  },

  // Get pending author registrations
  getPendingAuthors: async () => {
    try {
      const response = await api.get('/admin/pending-authors');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch pending authors'
      };
    }
  },

  // Approve or reject author registration
  reviewAuthor: async (authorId, action, reason = '') => {
    try {
      const response = await api.post(`/admin/review-author/${authorId}`, {
        action, // 'approve' or 'reject'
        reason
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to review author'
      };
    }
  },

  // Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch platform stats'
      };
    }
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  // Get payment monitoring data
  getPaymentStats: async () => {
    try {
      const response = await api.get('/admin/payment-stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payment stats'
      };
    }
  },

  // Manage user (activate/deactivate)
  manageUser: async (userId, action) => {
    try {
      const response = await api.post(`/admin/manage-user/${userId}`, { action });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to manage user'
      };
    }
  },

  // Get platform reviews and reports
  getPlatformReviews: async () => {
    try {
      const response = await api.get('/admin/platform-reviews');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch platform reviews'
      };
    }
  }
};

export default adminService;
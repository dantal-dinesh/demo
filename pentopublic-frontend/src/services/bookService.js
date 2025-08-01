import api from './api';

export const bookService = {
  // Get all approved books
  getAllBooks: async (params = {}) => {
    try {
      const response = await api.get('/book/all', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch books'
      };
    }
  },

  // Get book by ID
  getBookById: async (bookId) => {
    try {
      const response = await api.get(`/book/${bookId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch book details'
      };
    }
  },

  // Upload new book (Author only)
  uploadBook: async (bookData) => {
    try {
      const formData = new FormData();
      Object.keys(bookData).forEach(key => {
        if (bookData[key] !== null && bookData[key] !== undefined) {
          formData.append(key, bookData[key]);
        }
      });

      const response = await api.post('/book/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload book'
      };
    }
  },

  // Get books by author
  getAuthorBooks: async (authorId) => {
    try {
      const response = await api.get(`/book/author/${authorId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch author books'
      };
    }
  },

  // Get featured books
  getFeaturedBooks: async () => {
    try {
      const response = await api.get('/book/featured');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch featured books'
      };
    }
  },

  // Get recent uploads
  getRecentBooks: async (limit = 10) => {
    try {
      const response = await api.get(`/book/recent?limit=${limit}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent books'
      };
    }
  },

  // Search books
  searchBooks: async (query, filters = {}) => {
    try {
      const params = { query, ...filters };
      const response = await api.get('/book/search', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Search failed'
      };
    }
  },

  // Update book (Author only)
  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.put(`/book/${bookId}`, bookData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update book'
      };
    }
  },

  // Delete book (Author only)
  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/book/${bookId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete book'
      };
    }
  }
};

export default bookService;
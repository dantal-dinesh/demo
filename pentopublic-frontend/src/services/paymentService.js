import api from './api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (planData) => {
    try {
      const response = await api.post('/payment/create-order', planData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create payment order'
      };
    }
  },

  // Confirm payment after Razorpay success
  confirmPayment: async (paymentData) => {
    try {
      const response = await api.post('/payment/confirm', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Payment confirmation failed'
      };
    }
  },

  // Get user's payment history
  getPaymentHistory: async (userId) => {
    try {
      const response = await api.get(`/payment/history/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch payment history'
      };
    }
  },

  // Get current subscription status
  getSubscriptionStatus: async (userId) => {
    try {
      const response = await api.get(`/payment/subscription/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch subscription status'
      };
    }
  },

  // Get available subscription plans
  getSubscriptionPlans: async () => {
    try {
      const response = await api.get('/payment/plans');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch subscription plans'
      };
    }
  },

  // Cancel subscription
  cancelSubscription: async (userId) => {
    try {
      const response = await api.post(`/payment/cancel-subscription/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel subscription'
      };
    }
  }
};

export default paymentService;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/analytics';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    const customError = {
      message: error.response?.data?.error?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500
    };
    return Promise.reject(customError);
  }
);

export const fetchSummary = () => apiClient.get('/summary');
export const fetchRevenueTrend = () => apiClient.get('/revenue-trend');
export const fetchCategoryPerformance = () => apiClient.get('/category-performance');
export const fetchRegionalPerformance = () => apiClient.get('/region-performance');
export const fetchTopProducts = (limit = 5) => apiClient.get(`/top-products?limit=${limit}`);
export const fetchRecentTransactions = (page = 1, limit = 8) => apiClient.get(`/recent-transactions?page=${page}&limit=${limit}`);
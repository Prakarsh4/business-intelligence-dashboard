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

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
};

export const fetchSummary = (params) => apiClient.get(`/summary${buildQueryString(params)}`);
export const fetchRevenueTrend = (params) => apiClient.get(`/revenue-trend${buildQueryString(params)}`);
export const fetchCategoryPerformance = (params) => apiClient.get(`/category-performance${buildQueryString(params)}`);
export const fetchRegionalPerformance = (params) => apiClient.get(`/region-performance${buildQueryString(params)}`);
export const fetchTopProducts = (params) => apiClient.get(`/top-products${buildQueryString(params)}`);
export const fetchBusinessInsights = (params) => apiClient.get(`/insights${buildQueryString(params)}`);
export const fetchRecentTransactions = (params) => apiClient.get(`/recent-transactions${buildQueryString(params)}`);
// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elsa-fashion-backend.onrender.com';

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

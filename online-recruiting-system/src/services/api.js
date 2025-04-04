import axios from 'axios';

// Set the base URL for the API
// Note: If you're using Create React App, you'll need to prefix it with REACT_APP_
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to add the token to every request
api.interceptors.request.use(
  config => {
    // Get the latest token (in case it changed since page load)
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    
    // For debugging
    console.log(`Making API request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
api.interceptors.response.use(
  response => {
    // For debugging
    console.log(`API response received for ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error);
    
    // Handle unauthorized errors (expired or invalid tokens)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access, redirecting to login');
      
      // Only redirect if we're not already on the login page or trying to log in
      // This check helps prevent infinite loops
      if (!window.location.pathname.includes('/login') && 
          !error.config.url.includes('/login')) {
        
        // Clear the token
        localStorage.removeItem('token');
        
        // Store the current URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Fetch monthly category report data
 * @param {Number} year - Year for the report
 * @param {Number} month - Month for the report (1-12)
 * @returns {Promise} - Promise resolving to report data
 */
export const getMonthlyCategoryReport = async (year, month) => {
  const response = await axios.get(`/api/reports/category/monthly/${year}/${month}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

/**
 * Fetch yearly category report data
 * @param {Number} year - Year for the report
 * @returns {Promise} - Promise resolving to report data
 */
export const getYearlyCategoryReport = async (year) => {
  const response = await axios.get(`/api/reports/category/yearly/${year}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

/**
 * Fetch monthly qualification report data
 * @param {Number} year - Year for the report
 * @param {Number} month - Month for the report (1-12)
 * @returns {Promise} - Promise resolving to report data
 */
export const getMonthlyQualificationReport = async (year, month) => {
  const response = await axios.get(`/api/reports/qualification/monthly/${year}/${month}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

/**
 * Fetch yearly qualification report data
 * @param {Number} year - Year for the report
 * @returns {Promise} - Promise resolving to report data
 */
export const getYearlyQualificationReport = async (year) => {
  const response = await axios.get(`/api/reports/qualification/yearly/${year}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export default api;
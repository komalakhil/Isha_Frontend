// Environment configuration
// Change this to 'production' when deploying to production
const ENVIRONMENT = 'production';

// API URLs for different environments
const API_URLS = {
  development: 'http://localhost:4000',
  production: 'https://isha-backend.onrender.com'
};

// Export the API URL based on current environment
export const apiUrl = API_URLS[ENVIRONMENT];

// Export environment for conditional logic if needed
export const isDevelopment = ENVIRONMENT === 'development';
export const isProduction = ENVIRONMENT === 'production';

// Helper function to get full API endpoint
export const getApiEndpoint = (path) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${apiUrl}/${cleanPath}`;
};

// Export environment variable for external access
export const currentEnvironment = ENVIRONMENT; 
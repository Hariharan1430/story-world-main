import axios from 'axios';

// Read the base URL from the environment variables
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Set up a base instance of axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptor to log requests
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request]: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Optional: Interceptor to log responses and handle errors
apiClient.interceptors.response.use(
  (response) => response.data, // Automatically return the `data` property of the response
  (error) => {
    console.error('[API Response Error]:', error.response?.data || error.message);
    return Promise.reject({
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status || 500,
    });
  }
);

// Service functions
export const apiService = {
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response; // Explicitly return the processed response
    } catch (error) {
      throw error; // Propagate the error to the caller
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData: {
    displayName: string;
    email: string;
    password: string;
    roleName?: string;
    avatarId: string;
  }) => {
    try {
      const response = await apiClient.post('/users', {
        displayName: userData.displayName,
        email: userData.email,
        password: userData.password,
        roleName: userData.roleName || 'User',
        avatarId: userData.avatarId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userData: {
    uid: string;
    displayName: string;
    avatarId: string;
  }) => {
    try {
      const response = await apiClient.put('/users', {
        uid: userData.uid,
        displayName: userData.displayName,
        avatarId: userData.avatarId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/signin', {
        email,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    try {
      const response = await apiClient.post('/auth/signout');
      return response;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

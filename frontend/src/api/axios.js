import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For local development: Use your machine's IP (e.g., 'http://192.168.1.5:5000/api/v1') 
// for testing on physical devices. For web/emulator, 'http://localhost:5000' works.
// For production: Replace with your deployed backend URL.
// Use your actual IP address for testing on physical devices
const DEV_URL = 'http://10.240.58.189:5000/api/v1';
const PROD_URL = 'https://birrwise-backend.onrender.com/api/v1'; 

const API_URL = __DEV__ ? DEV_URL : PROD_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
       console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Success] ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error(`[API Error] ${error.config?.url}:`, error.message);
      if (error.response) {
        console.error('Data:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

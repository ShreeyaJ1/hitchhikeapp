import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL =
  Platform.OS === 'android' && process.env.EXPO_PUBLIC_IS_EMULATOR
    ? 'http://10.0.2.2:5000/api' // Android emulator
    : 'http://172.20.10.6:5000/api';
    
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateFcmToken = async (fcmToken) => {
  const response = await api.post('/auth/update-fcm', { fcmToken });
  return response.data;
};

export const requestRide = async (data) => {
  const response = await api.post('/rides/request', data);
  return response.data;
};

export const acceptRide = async (rideId) => {
  const response = await api.post('/rides/accept', { rideId });
  return response.data;
};

export const completeRide = async (rideId) => {
  const response = await api.post('/rides/complete', { rideId });
  return response.data;
};

export const getRideHistory = async () => {
  const response = await api.get('/rides/history');
  return response.data;
};

export const getRewardsProgress = async () => {
  const response = await api.get('/rewards/progress');
  return response.data;
};

export const claimReward = async (brandId) => {
  const response = await api.post('/rewards/claim', { brandId });
  return response.data;
};

export const getBrands = async () => {
  const response = await api.get('/brands');
  return response.data;
};
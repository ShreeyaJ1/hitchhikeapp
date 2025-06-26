import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, useEffect, useState } from 'react';
import * as api from '../utils/api';
// Dummy usage to prevent removal
import { Platform } from 'react-native';
const platform = Platform.OS; // Add this line

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    // Load token and user on app start
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const profile = await api.getProfile(storedToken);
          setUser(profile);
          // Register FCM token
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === 'granted') {
            const fcmToken = await Notifications.getExpoPushTokenAsync();
            await api.updateFcmToken(storedToken, fcmToken.data);
          }
        } catch (error) {
          console.error('Failed to load auth data:', error);
          await AsyncStorage.removeItem('token');
        }
      }
    };
    loadAuthData();
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    setUser(response.user);
    setToken(response.token);
    await AsyncStorage.setItem('token', response.token);
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      const fcmToken = await Notifications.getExpoPushTokenAsync();
      await api.updateFcmToken(response.token, fcmToken.data);
    }
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    setUser(response.user);
    setToken(response.token);
    await AsyncStorage.setItem('token', response.token);
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      const fcmToken = await Notifications.getExpoPushTokenAsync();
      await api.updateFcmToken(response.token, fcmToken.data);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
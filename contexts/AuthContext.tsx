import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as api from '@/utils/api';

interface User {
  _id: string;
  email: string;
  role: 'hitchhiker' | 'pilot';
  profile: {
    name: string;
    avatar?: string;
  };
  rewards?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        const profile = await api.getProfile();
        setUser(profile);
        
        // Register FCM token for notifications
        if (Platform.OS !== 'web') {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === 'granted') {
            const fcmToken = await Notifications.getExpoPushTokenAsync();
            await api.updateFcmToken(fcmToken.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
      await AsyncStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.user);
    setToken(response.token);
    await AsyncStorage.setItem('token', response.token);
    
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const fcmToken = await Notifications.getExpoPushTokenAsync();
        await api.updateFcmToken(fcmToken.data);
      }
    }
  };

  const register = async (userData: any) => {
    const response = await api.register(userData);
    setUser(response.user);
    setToken(response.token);
    await AsyncStorage.setItem('token', response.token);
    
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const fcmToken = await Notifications.getExpoPushTokenAsync();
        await api.updateFcmToken(fcmToken.data);
      }
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
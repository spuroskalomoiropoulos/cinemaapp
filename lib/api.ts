// lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// θυμισου να ανοιγει ipconfig καθε restart sto pc 
export const api = axios.create({
  baseURL: 'http://192.168.1.44:4000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
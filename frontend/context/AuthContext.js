// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register as registerService, login as loginService, getProfile } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const data = await getProfile(token);
          setUser(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário', error);
      }
    };

    fetchUser();
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      const { token } = await registerService(name, email, password);
      await AsyncStorage.setItem('token', token);
      const data = await getProfile(token);
      setUser(data);
    } catch (error) {
      throw new Error('Erro ao registrar');
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { token } = await loginService(email, password);
      await AsyncStorage.setItem('token', token);
      const data = await getProfile(token);
      setUser(data);
    } catch (error) {
      throw new Error('Erro ao fazer login');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const data = await getProfile(token);
      setUser(data);
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

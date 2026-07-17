import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios authorization token default
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get(`${API_URL}/profile`);
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            setAuthToken(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data.success) {
        setAuthToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      if (res.data.success) {
        setAuthToken(res.data.token);
        setUser(res.data.user);
        return true;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, { email });
      return res.data; // contains resetToken for easy testing
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send reset link.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const resetPassword = async (token, password) => {
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/reset-password/${token}`, { password });
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to reset password.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/profile`, profileData);
      if (res.data.success) {
        setUser(res.data.user);
        return true;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

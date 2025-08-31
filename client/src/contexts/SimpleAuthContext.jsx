import { createContext, useContext, useEffect, useState } from 'react';

const SimpleAuthContext = createContext({});

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SimpleAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName: displayName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get stored token
  const getIdToken = async () => {
    return localStorage.getItem('authToken');
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update stored user data
      localStorage.setItem('userData', JSON.stringify(data.user));
      setCurrentUser(data.user);

      return data.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password (placeholder - would need backend implementation)
  const resetPassword = async (email) => {
    try {
      setError(null);
      // This would need to be implemented on the backend
      console.log('Password reset requested for:', email);
      // For now, just simulate success
      return Promise.resolve();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Placeholder functions for Firebase compatibility
  const signInWithGoogle = async () => {
    throw new Error('Google sign-in not available in simple auth mode');
  };

  const sendVerificationEmail = async () => {
    console.log('Email verification not implemented in simple auth mode');
  };

  const updateUserPassword = async () => {
    throw new Error('Password update not implemented in simple auth mode');
  };

  const reauthenticate = async () => {
    throw new Error('Reauthentication not implemented in simple auth mode');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    reauthenticate,
    sendVerificationEmail,
    getIdToken,
    clearError
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
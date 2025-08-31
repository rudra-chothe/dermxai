import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Get Firebase ID token for authentication
      const token = await getIdToken();
      
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      // Handle FormData (for file uploads)
      if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  const get = useCallback((endpoint, options = {}) => {
    return makeRequest(endpoint, { method: 'GET', ...options });
  }, [makeRequest]);

  const post = useCallback((endpoint, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return makeRequest(endpoint, { method: 'POST', body, ...options });
  }, [makeRequest]);

  const put = useCallback((endpoint, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return makeRequest(endpoint, { method: 'PUT', body, ...options });
  }, [makeRequest]);

  const del = useCallback((endpoint, options = {}) => {
    return makeRequest(endpoint, { method: 'DELETE', ...options });
  }, [makeRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError,
    makeRequest
  };
};
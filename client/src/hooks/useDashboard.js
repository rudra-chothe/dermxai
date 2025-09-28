import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = '/api/dashboard';

export const useDashboard = () => {
  const { currentUser, getIdToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalDiagnoses: 0,
      recentReports: 0,
      pendingAnalyses: 0,
      accuracyRate: 0,
      totalQuestions: 0,
      totalDocuments: 0
    },
    activities: [],
    insights: {
      skinHealthScore: 75,
      nextCheckup: 30,
      improvement: 0,
      riskFactors: [],
      recommendations: []
    }
  });

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get auth token
      const token = await getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      
      // Set fallback data on error
      setData({
        stats: {
          totalDiagnoses: 0,
          recentReports: 0,
          pendingAnalyses: 0,
          accuracyRate: 0,
          totalQuestions: 0,
          totalDocuments: 0
        },
        activities: [],
        insights: {
          skinHealthScore: 75,
          nextCheckup: 30,
          improvement: 0,
          riskFactors: [],
          recommendations: []
        }
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser, getIdToken]);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refreshData
  };
};

export default useDashboard;

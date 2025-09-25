import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import dashboardService from '../services/dashboardService.js';

const router = express.Router();

// Get dashboard statistics for a user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const stats = await dashboardService.getUserStats(userId);
    
    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve dashboard stats',
      message: 'Internal server error'
    });
  }
});

// Get recent activities for a user
router.get('/recent-activities', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 10 } = req.query;
    const activities = await dashboardService.getRecentActivities(userId, parseInt(limit));
    
    res.json({
      message: 'Recent activities retrieved successfully',
      activities
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      error: 'Failed to retrieve recent activities',
      message: 'Internal server error'
    });
  }
});

// Get health insights for a user
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const insights = await dashboardService.getHealthInsights(userId);
    
    res.json({
      message: 'Health insights retrieved successfully',
      insights
    });
  } catch (error) {
    console.error('Health insights error:', error);
    res.status(500).json({
      error: 'Failed to retrieve health insights',
      message: 'Internal server error'
    });
  }
});

// Get dashboard overview (all data in one request)
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const overview = await dashboardService.getDashboardOverview(userId);
    
    res.json({
      message: 'Dashboard overview retrieved successfully',
      ...overview
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      error: 'Failed to retrieve dashboard overview',
      message: 'Internal server error'
    });
  }
});

export default router;

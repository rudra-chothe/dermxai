import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import insightsService from '../services/insightsService.js';

const router = express.Router();

// Get all clinical insights with filtering and pagination
router.get('/', optionalAuth, (req, res) => {
  try {
    const result = insightsService.getAllInsights(req.query);
    
    res.json({
      message: 'Clinical insights retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Insights retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve insights',
      message: 'Internal server error'
    });
  }
});

// Get specific clinical insight
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const insight = insightsService.getInsightById(id);
    
    res.json({
      message: 'Clinical insight retrieved successfully',
      insight
    });
  } catch (error) {
    console.error('Insight retrieval error:', error);
    
    if (error.message === 'Insight not found') {
      return res.status(404).json({
        error: 'Insight not found',
        message: 'The requested clinical insight could not be found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve insight',
      message: 'Internal server error'
    });
  }
});

// Get insights by category
router.get('/category/:category', optionalAuth, (req, res) => {
  try {
    const { category } = req.params;
    const result = insightsService.getInsightsByCategory(category);
    
    res.json({
      message: `Insights for category '${category}' retrieved successfully`,
      ...result
    });
  } catch (error) {
    console.error('Category insights error:', error);
    
    if (error.message === 'Category not found') {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No insights found for the specified category'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve category insights',
      message: 'Internal server error'
    });
  }
});

// Get trending insights
router.get('/trending/popular', optionalAuth, (req, res) => {
  try {
    const insights = insightsService.getTrendingInsights();
    
    res.json({
      message: 'Trending insights retrieved successfully',
      insights
    });
  } catch (error) {
    console.error('Trending insights error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trending insights',
      message: 'Internal server error'
    });
  }
});

// Search insights
router.post('/search', optionalAuth, (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    const result = insightsService.searchInsights(query, filters);
    
    res.json({
      message: 'Search completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Search error:', error);
    
    if (error.message === 'Search query required') {
      return res.status(400).json({
        error: 'Search query required',
        message: 'Please provide a search query'
      });
    }
    
    res.status(500).json({
      error: 'Search failed',
      message: 'Internal server error'
    });
  }
});

export default router;
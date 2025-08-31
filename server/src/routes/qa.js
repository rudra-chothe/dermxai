import express from 'express';
import { body, validationResult } from 'express-validator';
import { optionalAuth } from '../middleware/auth.js';
import qaService from '../services/qaService.js';

const router = express.Router();

// Validation for ask question
const askQuestionValidation = [
  body('question').trim().isLength({ min: 10 }).withMessage('Question must be at least 10 characters long'),
  body('category').optional().trim().isLength({ min: 2 }).withMessage('Category must be at least 2 characters')
];

// Ask a question to the AI assistant
router.post('/ask', optionalAuth, askQuestionValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { question, category } = req.body;
    const response = await qaService.askQuestion(question, category, req.user?.userId);
    
    res.json({
      message: 'Question answered successfully',
      response
    });
  } catch (error) {
    console.error('Q&A error:', error);
    
    if (error.message === 'Question must be at least 10 characters long') {
      return res.status(400).json({
        error: 'Invalid question',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Failed to process question',
      message: 'Internal server error'
    });
  }
});

// Get frequently asked questions
router.get('/faq', optionalAuth, (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const result = qaService.getFAQ(category, limit);
    
    res.json({
      message: 'FAQ retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('FAQ error:', error);
    res.status(500).json({
      error: 'Failed to retrieve FAQ',
      message: 'Internal server error'
    });
  }
});

// Search Q&A database
router.get('/search', optionalAuth, (req, res) => {
  try {
    const { q: query, category } = req.query;
    const result = qaService.searchQA(query, category);
    
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

// Get Q&A by category
router.get('/category/:category', optionalAuth, (req, res) => {
  try {
    const { category } = req.params;
    const result = qaService.getQAByCategory(category);
    
    res.json({
      message: `Q&As for category '${category}' retrieved successfully`,
      ...result
    });
  } catch (error) {
    console.error('Category Q&A error:', error);
    
    if (error.message === 'Category not found') {
      return res.status(404).json({
        error: 'Category not found',
        message: 'No Q&As found for the specified category'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve category Q&As',
      message: 'Internal server error'
    });
  }
});

// Get specific Q&A by ID
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const qa = qaService.getQAById(id);
    
    res.json({
      message: 'Q&A retrieved successfully',
      qa
    });
  } catch (error) {
    console.error('Q&A retrieval error:', error);
    
    if (error.message === 'Q&A not found') {
      return res.status(404).json({
        error: 'Q&A not found',
        message: 'The requested Q&A could not be found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve Q&A',
      message: 'Internal server error'
    });
  }
});

// Get user's question history (requires authentication)
router.get('/user/history', optionalAuth, (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your question history'
      });
    }

    const history = qaService.getUserQuestionHistory(req.user.userId);
    
    res.json({
      message: 'Question history retrieved successfully',
      history
    });
  } catch (error) {
    console.error('History error:', error);
    
    if (error.message === 'User ID required') {
      return res.status(400).json({
        error: 'User ID required',
        message: 'User authentication is required'
      });
    }
    
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: 'Internal server error'
    });
  }
});

export default router;
import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import authService from '../services/authService.js';

const router = express.Router();

// Validation rules for profile updates
const profileUpdateValidation = [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender value'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('medicalHistory.allergies').optional().isArray().withMessage('Allergies must be an array'),
  body('medicalHistory.medications').optional().isArray().withMessage('Medications must be an array'),
  body('medicalHistory.conditions').optional().isArray().withMessage('Conditions must be an array'),
  body('medicalHistory.skinType').optional().isIn(['normal', 'dry', 'oily', 'combination', 'sensitive', 'unknown']).withMessage('Invalid skin type'),
  body('medicalHistory.skinConcerns').optional().isArray().withMessage('Skin concerns must be an array'),
  body('preferences.notifications.email').optional().isBoolean().withMessage('Email notifications must be a boolean'),
  body('preferences.notifications.push').optional().isBoolean().withMessage('Push notifications must be a boolean'),
  body('preferences.notifications.sms').optional().isBoolean().withMessage('SMS notifications must be a boolean'),
  body('preferences.language').optional().isLength({ min: 2, max: 5 }).withMessage('Language must be between 2 and 5 characters'),
  body('preferences.theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Invalid theme value')
];

// Get current user's full profile (including MongoDB data)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await authService.getUserProfile(req.user.uid);
    
    res.json({ 
      user: userProfile 
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }
    
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, profileUpdateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    console.log('📋 Updating profile for user:', req.user.uid);
    console.log('📋 Update data:', req.body);
    
    const updatedProfile = await authService.updateUserProfile(req.user.uid, req.body);
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedProfile
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    
    res.status(500).json({
      error: 'Profile update failed',
      message: error.message || 'Internal server error'
    });
  }
});

// Test endpoint to update user without validation (for testing)
router.put('/test-update/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('🧪 Test update for user:', uid);
    console.log('📋 Update data:', req.body);
    
    const updatedProfile = await authService.updateUserProfile(uid, req.body);
    
    res.json({
      message: 'Test update successful',
      user: updatedProfile
    });
  } catch (error) {
    console.error('❌ Test update error:', error);
    
    res.status(500).json({
      error: 'Test update failed',
      message: error.message || 'Internal server error'
    });
  }
});

// Get user by ID (admin only)
router.get('/:uid', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const { uid } = req.params;
    const userProfile = await authService.getUserProfile(uid);
    
    if (!userProfile) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }
    
    res.json({ 
      user: userProfile 
    });
  } catch (error) {
    console.error('User retrieval error:', error);
    
    res.status(500).json({
      error: 'User retrieval failed',
      message: 'Internal server error'
    });
  }
});

// Search users (admin only)
router.get('/search/:query', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const { query } = req.params;
    const { limit = 50 } = req.query;
    
    const users = await authService.searchUsers(query, parseInt(limit));
    
    res.json({
      message: 'Users found successfully',
      users,
      count: users.length,
      query
    });
  } catch (error) {
    console.error('User search error:', error);
    
    res.status(500).json({
      error: 'User search failed',
      message: 'Internal server error'
    });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const stats = await authService.getUserStats();
    
    res.json({
      message: 'User statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    
    res.status(500).json({
      error: 'User statistics retrieval failed',
      message: 'Internal server error'
    });
  }
});

// Get all users with pagination (admin only)
router.get('/admin/list', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const { maxResults = 100, pageToken } = req.query;
    const result = await authService.listUsers(parseInt(maxResults), pageToken);
    
    res.json({
      message: 'Users retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('List users error:', error);
    
    res.status(500).json({
      error: 'Failed to list users',
      message: 'Internal server error'
    });
  }
});

// Delete user account (user can delete their own account)
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    console.log('🗑️  Deleting user account:', req.user.uid);
    
    // Delete user from both Firebase and MongoDB
    const result = await authService.deleteUser(req.user.uid);
    
    res.json({
      message: 'Account deleted successfully',
      deletedUser: result
    });
  } catch (error) {
    console.error('❌ Account deletion error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }
    
    res.status(500).json({
      error: 'Account deletion failed',
      message: error.message || 'Internal server error'
    });
  }
});

// Delete user by ID (admin only)
router.delete('/:uid', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const { uid } = req.params;
    console.log('🗑️  Admin deleting user account:', uid);
    
    // Delete user from both Firebase and MongoDB
    const result = await authService.deleteUser(uid);
    
    res.json({
      message: 'User deleted successfully',
      deletedUser: result
    });
  } catch (error) {
    console.error('❌ Admin user deletion error:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }
    
    res.status(500).json({
      error: 'User deletion failed',
      message: error.message || 'Internal server error'
    });
  }
});

export default router;

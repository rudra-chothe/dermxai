import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import authService from '../services/authService.js';
import fallbackAuthService from '../services/fallbackAuthService.js';
import { isFirebaseAvailable } from '../config/firebase.js';
import userService from '../services/userService.js';

const router = express.Router();

// Validation rules
const profileUpdateValidation = [
  body('displayName').optional().trim().isLength({ min: 2 }).withMessage('Display name must be at least 2 characters'),
  body('phoneNumber').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const registerValidation = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Fallback registration endpoint (when Firebase is not available)
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (isFirebaseAvailable()) {
      return res.status(400).json({
        error: 'Use Firebase authentication',
        message: 'Please use Firebase authentication for registration'
      });
    }

    const result = await fallbackAuthService.registerUser(req.body);
    
    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error'
    });
  }
});

// Fallback login endpoint (when Firebase is not available)
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (isFirebaseAvailable()) {
      return res.status(400).json({
        error: 'Use Firebase authentication',
        message: 'Please use Firebase authentication for login'
      });
    }

    const result = await fallbackAuthService.loginUser(req.body);
    
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error'
    });
  }
});

// Verify Firebase ID token and get user profile
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        error: 'Token required',
        message: 'ID token is required'
      });
    }

    const decodedToken = await authService.verifyIdToken(idToken);
    const userProfile = await authService.getUserProfile(decodedToken.uid);
    
    res.json({
      valid: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    }
    
    res.status(500).json({
      error: 'Verification failed',
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = await authService.getUserProfile(req.user.uid);
    
    res.json({ 
      user: userProfile 
    });
  } catch (error) {
    console.error('Profile error:', error);
    
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
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const updatedProfile = await authService.updateUserProfile(req.user.uid, req.body);
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Internal server error'
    });
  }
});

// Create user profile (called after Firebase registration)
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { additionalData } = req.body;
    
    const userProfile = await authService.createUserProfile(req.user, additionalData);
    
    res.status(201).json({
      message: 'User profile created successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    
    res.status(500).json({
      error: 'Profile creation failed',
      message: 'Internal server error'
    });
  }
});

// Complete signup process (create MongoDB profile after Firebase registration)
router.post('/signup-complete', authenticateToken, async (req, res) => {
  try {
    const userData = req.body;
    
    console.log('📝 Completing signup for user:', req.user.uid);
    console.log('📝 User data:', userData);
    
    // Create user profile in MongoDB
    const userProfile = await authService.createUserProfile(req.user, userData);
    
    res.status(201).json({
      message: 'Signup completed successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Signup completion error:', error);
    
    res.status(500).json({
      error: 'Signup completion failed',
      message: error.message || 'Internal server error'
    });
  }
});

// Auto-create user profile when user first signs up
router.post('/signup-complete', authenticateToken, async (req, res) => {
  try {
    console.log('🚀 User signup complete, creating profile for:', req.user.uid);
    console.log('📋 User data from auth middleware:', req.user);
    console.log('📋 Request body:', req.body);
    
    // Check if user already exists in MongoDB
    const existingUser = await userService.getUserByFirebaseUid(req.user.uid);
    
    if (existingUser) {
      console.log('ℹ️  User already exists in MongoDB:', req.user.uid);
      return res.json({
        message: 'User profile already exists',
        user: existingUser
      });
    }
    
    // Create new user profile
    const userProfile = await authService.createUserProfile(req.user, req.body);
    
    res.status(201).json({
      message: 'User profile created successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Signup complete error:', error);
    
    res.status(500).json({
      error: 'Profile creation failed',
      message: 'Internal server error'
    });
  }
});

// Test endpoint to create user directly (for testing without Firebase)
router.post('/test-create-user', async (req, res) => {
  try {
    console.log('🧪 Test endpoint: Creating user directly');
    console.log('📋 Request body:', req.body);
    
    const { firebaseUid, email, displayName, firstName, lastName } = req.body;
    
    if (!firebaseUid || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'firebaseUid and email are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await userService.getUserByFirebaseUid(firebaseUid);
    
    if (existingUser) {
      console.log('ℹ️  User already exists in MongoDB:', firebaseUid);
      return res.json({
        message: 'User profile already exists',
        user: existingUser
      });
    }
    
    // Create user directly using userService
    const newUser = await userService.createUser({
      firebaseUid,
      email,
      displayName: displayName || email.split('@')[0],
      firstName: firstName || displayName?.split(' ')[0] || '',
      lastName: lastName || displayName?.split(' ').slice(1).join(' ') || '',
      signUpMethod: 'email'
    });
    
    if (newUser) {
      console.log('✅ Test user created successfully:', newUser._id);
      res.status(201).json({
        message: 'Test user created successfully',
        user: newUser
      });
    } else {
      res.status(500).json({
        error: 'User creation failed',
        message: 'Failed to create user in database'
      });
    }
  } catch (error) {
    console.error('Test user creation error:', error);
    res.status(500).json({
      error: 'Test user creation failed',
      message: error.message
    });
  }
});

// Test endpoint to simulate the actual signup-complete flow
router.post('/test-signup-complete', async (req, res) => {
  try {
    console.log('🧪 Test signup-complete endpoint: Simulating actual signup flow');
    console.log('📋 Request body:', req.body);
    
    // Simulate the user data that would come from Firebase auth
    const mockUser = {
      uid: req.body.firebaseUid || 'mock-uid-' + Date.now(),
      email: req.body.email,
      displayName: req.body.displayName,
      photoURL: req.body.photoURL || null,
      phoneNumber: req.body.phoneNumber || null,
      emailVerified: req.body.emailVerified || false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      }
    };
    
    console.log('📋 Mock user data:', mockUser);
    
    // Check if user already exists in MongoDB
    const existingUser = await userService.getUserByFirebaseUid(mockUser.uid);
    
    if (existingUser) {
      console.log('ℹ️  User already exists in MongoDB:', mockUser.uid);
      return res.json({
        message: 'User profile already exists',
        user: existingUser
      });
    }
    
    // Create new user profile using authService (same as real flow)
    const userProfile = await authService.createUserProfile(mockUser, req.body);
    
    console.log('✅ User profile created successfully via authService');
    res.status(201).json({
      message: 'User profile created successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Test signup-complete error:', error);
    res.status(500).json({
      error: 'Test signup-complete failed',
      message: error.message
    });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const result = await authService.deleteUser(req.user.uid);
    
    res.json({
      message: 'Account deleted successfully',
      ...result
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    
    res.status(500).json({
      error: 'Account deletion failed',
      message: 'Internal server error'
    });
  }
});

// Revoke refresh tokens (sign out from all devices)
router.post('/revoke-tokens', authenticateToken, async (req, res) => {
  try {
    const result = await authService.revokeRefreshTokens(req.user.uid);
    
    res.json({
      message: 'Refresh tokens revoked successfully',
      ...result
    });
  } catch (error) {
    console.error('Token revocation error:', error);
    
    res.status(500).json({
      error: 'Token revocation failed',
      message: 'Internal server error'
    });
  }
});

// Create custom token (for server-side authentication)
router.post('/custom-token', authenticateToken, async (req, res) => {
  try {
    const { additionalClaims } = req.body;
    
    const customToken = await authService.createCustomToken(req.user.uid, additionalClaims);
    
    res.json({
      message: 'Custom token created successfully',
      customToken
    });
  } catch (error) {
    console.error('Custom token creation error:', error);
    
    res.status(500).json({
      error: 'Custom token creation failed',
      message: 'Internal server error'
    });
  }
});

// Admin: List users (requires admin privileges)
router.get('/admin/users', authenticateToken, async (req, res) => {
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

// Admin: Set custom claims
router.post('/admin/claims/:uid', authenticateToken, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!req.user.customClaims?.admin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin privileges required'
      });
    }

    const { uid } = req.params;
    const { customClaims } = req.body;
    
    const result = await authService.setCustomClaims(uid, customClaims);
    
    res.json({
      message: 'Custom claims set successfully',
      ...result
    });
  } catch (error) {
    console.error('Set custom claims error:', error);
    
    res.status(500).json({
      error: 'Failed to set custom claims',
      message: 'Internal server error'
    });
  }
});

export default router;
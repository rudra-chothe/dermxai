import admin, { isFirebaseAvailable } from '../config/firebase.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided'
    });
  }

  try {
    // Check if it's a mock token (for simple auth testing)
    if (token.startsWith('mock-token-')) {
      const uid = token.replace('mock-token-', '');
      
      req.user = {
        uid: uid,
        email: 'test@example.com',
        emailVerified: true,
        displayName: 'Test User',
        photoURL: null,
        phoneNumber: null,
        customClaims: {},
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString()
      };
      
      next();
      return;
    }

    // Verify Firebase ID token if available
    if (isFirebaseAvailable()) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Get user data from Firebase
      const userRecord = await admin.auth().getUser(decodedToken.uid);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: userRecord.displayName || decodedToken.name,
        photoURL: userRecord.photoURL || decodedToken.picture,
        phoneNumber: userRecord.phoneNumber,
        customClaims: decodedToken.customClaims || {},
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime
      };
    } else {
      // Fallback for when Firebase is not available
      console.warn('⚠️  Firebase not available, using mock authentication');
      
      // Try to extract user info from the request body if available
      const requestBody = req.body || {};
      const firebaseUid = requestBody.firebaseUid || 'mock-user-' + Date.now();
      const email = requestBody.email || 'mock@example.com';
      const displayName = requestBody.displayName || 'Mock User';
      
      req.user = {
        uid: firebaseUid,
        email: email,
        emailVerified: true,
        displayName: displayName,
        photoURL: requestBody.photoURL || null,
        phoneNumber: requestBody.phoneNumber || null,
        customClaims: {},
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString()
      };
      
      console.log('📋 Created mock user from request body:', req.user);
    }
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please sign in again'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'Token revoked',
        message: 'Please sign in again'
      });
    }
    
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token is not valid'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      // Check if it's a mock token (for simple auth testing)
      if (token.startsWith('mock-token-')) {
        const parts = token.split('-');
        const uid = parts[2];
        
        req.user = {
          uid: uid,
          email: 'test@example.com',
          emailVerified: true,
          displayName: 'Test User',
          photoURL: null,
          phoneNumber: null,
          customClaims: {},
          createdAt: new Date().toISOString(),
          lastSignIn: new Date().toISOString()
        };
      } else if (isFirebaseAvailable()) {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          displayName: userRecord.displayName || decodedToken.name,
          photoURL: userRecord.photoURL || decodedToken.picture,
          phoneNumber: userRecord.phoneNumber,
          customClaims: decodedToken.customClaims || {},
          createdAt: userRecord.metadata.creationTime,
          lastSignIn: userRecord.metadata.lastSignInTime
        };
      } else {
        // Mock user when Firebase is not available
        req.user = {
          uid: 'mock-user-' + Date.now(),
          email: 'mock@example.com',
          emailVerified: true,
          displayName: 'Mock User',
          photoURL: null,
          phoneNumber: null,
          customClaims: {},
          createdAt: new Date().toISOString(),
          lastSignIn: new Date().toISOString()
        };
      }
    } catch (error) {
      // Token is invalid, but we continue without user
      req.user = null;
    }
  }
  
  next();
};
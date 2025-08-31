import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Check if required environment variables are set
      const requiredVars = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_CLIENT_ID'
      ];
      
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.warn('⚠️  Missing Firebase environment variables:', missingVars.join(', '));
        console.warn('📖 Please check FIREBASE_SETUP.md for configuration instructions.');
        
        // In development, we'll continue without Firebase
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️  Running in development mode without Firebase Admin SDK');
          return false;
        } else {
          throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
        }
      }

      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
      return true;
    }
    return true;
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    
    // For development, we'll continue without Firebase
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Running in development mode without Firebase Admin SDK');
      return false;
    } else {
      throw error;
    }
  }
};

// Initialize Firebase
const isFirebaseInitialized = initializeFirebase();

// Export a function to check if Firebase is available
export const isFirebaseAvailable = () => {
  try {
    // Check if Firebase is initialized and has valid credentials
    if (isFirebaseInitialized && admin.apps.length > 0) {
      // Try to verify that Firebase is actually working by checking if we can access the auth service
      const auth = admin.auth();
      return true;
    }
    return false;
  } catch (error) {
    console.warn('⚠️  Firebase availability check failed:', error.message);
    return false;
  }
};

export default admin;
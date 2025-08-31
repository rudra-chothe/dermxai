import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Default Firebase configuration (replace with your actual values)
const defaultConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
  measurementId: "demo-measurement-id"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

// Debug Firebase configuration
console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey !== defaultConfig.apiKey ? '✅ Set' : '❌ Using Demo',
  authDomain: firebaseConfig.authDomain !== defaultConfig.authDomain ? '✅ Set' : '❌ Using Demo',
  projectId: firebaseConfig.projectId !== defaultConfig.projectId ? '✅ Set' : '❌ Using Demo',
  storageBucket: firebaseConfig.storageBucket !== defaultConfig.storageBucket ? '✅ Set' : '❌ Using Demo',
  messagingSenderId: firebaseConfig.messagingSenderId !== defaultConfig.messagingSenderId ? '✅ Set' : '❌ Using Demo',
  appId: firebaseConfig.appId !== defaultConfig.appId ? '✅ Set' : '❌ Using Demo'
});

// Check if we're using demo config
const isUsingDemoConfig = firebaseConfig.apiKey === defaultConfig.apiKey;
if (isUsingDemoConfig) {
  console.warn('⚠️  Using demo Firebase configuration. Please set up your environment variables.');
  console.warn('📖 See FIREBASE_SETUP.md for configuration instructions.');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('🔥 Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Initialize Firebase Auth only
export const auth = getAuth(app);

// Connect to emulators in development (only if explicitly enabled)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  // Only connect to emulators if not already connected
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('🔧 Connected to Firebase Auth emulator');
  } catch (error) {
    // Emulator already connected or not available
    console.log('Firebase Auth emulator not connected:', error.message);
  }
} else {
  console.log('🔥 Using Firebase production services');
}

export default app;
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const verifySetup = async () => {
  console.log('🔍 Verifying DermX-AI Setup...\n');

  // Check Environment Variables
  console.log('📋 Environment Variables:');
  const requiredEnvVars = [
    'MONGODB_URI',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];

  const optionalEnvVars = [
    'PORT',
    'NODE_ENV',
    'CLIENT_URL',
    'JWT_SECRET'
  ];

  let envIssues = 0;

  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing (Required)`);
      envIssues++;
    }
  });

  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Set`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (Optional)`);
    }
  });

  // Check MongoDB Connection
  console.log('\n🗄️  MongoDB Connection:');
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dermx-ai';
    console.log(`   📍 URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(mongoURI);
    console.log('   ✅ Connection: Successful');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   ✅ Collections: ${collections.length} found`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.log('   ❌ Connection: Failed');
    console.log(`   📝 Error: ${error.message}`);
    envIssues++;
  }

  // Check Firebase Configuration
  console.log('\n🔥 Firebase Configuration:');
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log(`   ✅ Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
      console.log(`   ✅ Service Account: ${process.env.FIREBASE_CLIENT_EMAIL}`);
      
      if (process.env.FIREBASE_PRIVATE_KEY) {
        const keyLength = process.env.FIREBASE_PRIVATE_KEY.length;
        console.log(`   ✅ Private Key: ${keyLength} characters`);
      } else {
        console.log('   ❌ Private Key: Missing');
        envIssues++;
      }
    } else {
      console.log('   ❌ Firebase: Configuration incomplete');
      envIssues++;
    }
  } catch (error) {
    console.log('   ❌ Firebase: Configuration error');
    console.log(`   📝 Error: ${error.message}`);
    envIssues++;
  }

  // Summary
  console.log('\n📊 Setup Summary:');
  if (envIssues === 0) {
    console.log('   🎉 All checks passed! Ready to start the server.');
    console.log('\n🚀 Next steps:');
    console.log('   1. npm run dev (start development server)');
    console.log('   2. npm run test:integration (run integration tests)');
    console.log('   3. Open http://localhost:5000/health');
  } else {
    console.log(`   ⚠️  ${envIssues} issue(s) found. Please fix before starting.`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file exists and has correct values');
    console.log('   2. Ensure MongoDB is running (mongod)');
    console.log('   3. Verify Firebase service account credentials');
    console.log('   4. See FIREBASE_MONGODB_INTEGRATION.md for setup guide');
  }

  process.exit(envIssues > 0 ? 1 : 0);
};

verifySetup();
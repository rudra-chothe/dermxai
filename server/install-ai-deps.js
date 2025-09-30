#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🤖 Installing AI dependencies for DermX-AI...');

try {
  // Install Transformers.js
  console.log('📦 Installing @xenova/transformers...');
  execSync('npm install @xenova/transformers@^2.17.1', { stdio: 'inherit' });
  
  console.log('✅ AI dependencies installed successfully!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. The BioGPT model will be downloaded on first use');
  console.log('3. Initial model loading may take a few minutes');
  console.log('');
  console.log('⚠️  Note: The BioGPT model is large (~1.5GB)');
  console.log('   Make sure you have sufficient disk space and bandwidth');
  
} catch (error) {
  console.error('❌ Failed to install AI dependencies:', error.message);
  process.exit(1);
}
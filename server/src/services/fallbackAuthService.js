import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock user database for fallback authentication
const users = [];

class FallbackAuthService {
  async registerUser(userData) {
    const { fullName, email, password } = userData;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: Date.now().toString(),
      uid: `fallback_${Date.now()}`, // Firebase-like UID
      fullName,
      displayName: fullName,
      email,
      password: hashedPassword,
      emailVerified: false,
      photoURL: null,
      phoneNumber: null,
      createdAt: new Date().toISOString(),
      lastSignIn: new Date().toISOString()
    };

    users.push(user);

    // Generate JWT token
    const token = this.generateToken({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });

    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignIn
      }
    };
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last sign in
    user.lastSignIn = new Date().toISOString();

    // Generate JWT token
    const token = this.generateToken({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });

    return {
      token,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        lastSignIn: user.lastSignIn
      }
    };
  }

  getUserByUid(uid) {
    const user = users.find(user => user.uid === uid);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      lastSignIn: user.lastSignIn
    };
  }

  generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async updateUserProfile(uid, updateData) {
    const user = users.find(user => user.uid === uid);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user data
    if (updateData.displayName) user.displayName = updateData.displayName;
    if (updateData.photoURL) user.photoURL = updateData.photoURL;
    if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;

    return this.getUserByUid(uid);
  }

  async deleteUser(uid) {
    const userIndex = users.findIndex(user => user.uid === uid);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users.splice(userIndex, 1);
    return { success: true, message: 'User deleted successfully' };
  }
}

export default new FallbackAuthService();
import User from '../models/User.js';
import { isMongoDBAvailable, connectDB } from '../config/database.js';

class UserService {
  // Create a new user in MongoDB
  async createUser(userData) {
    try {
      console.log('🔍 Creating user with data:', JSON.stringify(userData, null, 2));
      
      // Ensure MongoDB connection is available; try to connect on demand
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, attempting to connect...');
        try {
          await connectDB();
        } catch (connError) {
          console.error('❌ Failed to connect to MongoDB on demand:', connError.message);
        }
        if (!isMongoDBAvailable()) {
          throw new Error('MongoDB not available');
        }
      }

      // Check if user already exists
      const existingUser = await User.findByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        console.log('ℹ️  User already exists in MongoDB:', userData.firebaseUid);
        return existingUser;
      }

      // Create new user document with proper defaults
      const newUser = new User({
        firebaseUid: userData.firebaseUid,
        email: userData.email,
        displayName: userData.displayName || userData.email.split('@')[0],
        photoURL: userData.photoURL || null,
        phoneNumber: userData.phoneNumber || null,
        emailVerified: userData.emailVerified || false,
        signUpMethod: userData.signUpMethod || 'email',
        // Extract first and last name from display name if available
        firstName: userData.firstName || this.extractFirstName(userData.displayName),
        lastName: userData.lastName || this.extractLastName(userData.displayName),
        // Initialize medical history with proper structure
        medicalHistory: {
          allergies: [],
          medications: [],
          conditions: [],
          skinType: 'unknown',
          skinConcerns: []
        },
        // Initialize preferences with defaults
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            reports: true
          },
          privacy: {
            shareDataForResearch: false,
            allowAnalytics: true
          },
          language: 'en',
          theme: 'auto',
          timezone: 'UTC'
        }
      });

      console.log('📝 User document created, attempting to save...');
      const savedUser = await newUser.save();
      console.log('✅ User created in MongoDB:', savedUser.firebaseUid);
      
      return savedUser;
    } catch (error) {
      console.error('❌ Error creating user in MongoDB:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      throw new Error(`Failed to create user in database: ${error.message}`);
    }
  }

  // Append a diagnosis result and increment totalDiagnoses
  async addDiagnosis(firebaseUid, diagnosisResult) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot add diagnosis');
        return null;
      }

      const user = await User.findByFirebaseUid(firebaseUid);
      if (!user) {
        throw new Error('User not found');
      }

      const mappedDiagnosis = {
        condition: diagnosisResult.condition,
        confidence: diagnosisResult.confidence,
        description: diagnosisResult.description,
        top3: Array.isArray(diagnosisResult.top3) ? diagnosisResult.top3.map(t => ({
          class: t.class,
          confidence: t.confidence
        })) : [],
        recommendations: Array.isArray(diagnosisResult.recommendations) ? diagnosisResult.recommendations : [],
        diagnosedAt: diagnosisResult.analyzedAt ? new Date(diagnosisResult.analyzedAt) : new Date()
      };

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $push: { diagnosedDiseases: mappedDiagnosis },
          $inc: { 'stats.totalDiagnoses': 1 },
          $set: { 'stats.lastActivity': new Date(), updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      );

      return updatedUser;
    } catch (error) {
      console.error('❌ Error appending diagnosis to user:', error);
      throw new Error('Failed to append diagnosis to user');
    }
  }

  // Get user by Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot fetch user');
        return null;
      }

      const user = await User.findByFirebaseUid(firebaseUid);
      return user;
    } catch (error) {
      console.error('❌ Error fetching user from MongoDB:', error);
      throw new Error('Failed to fetch user from database');
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot fetch user');
        return null;
      }

      const user = await User.findByEmail(email);
      return user;
    } catch (error) {
      console.error('❌ Error fetching user from MongoDB:', error);
      throw new Error('Failed to fetch user from database');
    }
  }

  // Update user profile
  async updateUser(firebaseUid, updateData) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot update user');
        return null;
      }

      const user = await User.findByFirebaseUid(firebaseUid);
      if (!user) {
        throw new Error('User not found');
      }

      // Update only allowed fields
      const allowedUpdates = [
        'displayName', 'photoURL', 'phoneNumber', 'firstName', 'lastName',
        'dateOfBirth', 'gender', 'medicalHistory', 'preferences'
      ];

      const filteredUpdates = {};
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updateData[key];
        }
      });

      // Handle nested medicalHistory updates properly
      if (updateData.medicalHistory) {
        // Merge existing medical history with new data
        const existingMedicalHistory = user.medicalHistory || {};
        filteredUpdates.medicalHistory = {
          ...existingMedicalHistory,
          ...updateData.medicalHistory
        };
      }

      // Handle nested preferences updates properly
      if (updateData.preferences) {
        // Merge existing preferences with new data
        const existingPreferences = user.preferences || {};
        filteredUpdates.preferences = {
          ...existingPreferences,
          ...updateData.preferences
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      console.log('✅ User updated in MongoDB:', firebaseUid);
      return updatedUser;
    } catch (error) {
      console.error('❌ Error updating user in MongoDB:', error);
      throw new Error('Failed to update user in database');
    }
  }

  // Update last sign in
  async updateLastSignIn(firebaseUid) {
    try {
      if (!isMongoDBAvailable()) {
        return null;
      }

      const user = await User.findByFirebaseUid(firebaseUid);
      if (user) {
        await user.updateLastSignIn();
        console.log('✅ Last sign in updated for user:', firebaseUid);
      }
    } catch (error) {
      console.error('❌ Error updating last sign in:', error);
    }
  }

  // Delete user
  async deleteUser(firebaseUid) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot delete user');
        return false;
      }

      const result = await User.deleteOne({ firebaseUid });
      if (result.deletedCount > 0) {
        console.log('✅ User deleted from MongoDB:', firebaseUid);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error deleting user from MongoDB:', error);
      throw new Error('Failed to delete user from database');
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers(limit = 100, skip = 0) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot fetch users');
        return [];
      }

      const users = await User.find({})
        .select('-__v')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      return users;
    } catch (error) {
      console.error('❌ Error fetching users from MongoDB:', error);
      throw new Error('Failed to fetch users from database');
    }
  }

  // Search users
  async searchUsers(query, limit = 50) {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot search users');
        return [];
      }

      const searchRegex = new RegExp(query, 'i');
      const users = await User.find({
        $or: [
          { displayName: searchRegex },
          { email: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex }
        ]
      })
      .select('-__v')
      .limit(limit)
      .sort({ createdAt: -1 });

      return users;
    } catch (error) {
      console.error('❌ Error searching users in MongoDB:', error);
      throw new Error('Failed to search users in database');
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      if (!isMongoDBAvailable()) {
        console.warn('⚠️  MongoDB not available, cannot fetch user stats');
        return null;
      }

      const stats = await User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            verifiedUsers: { $sum: { $cond: ['$emailVerified', 1, 0] } },
            activeUsers: { $sum: { $cond: [{ $gte: ['$lastSignIn', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }, 1, 0] } }
          }
        }
      ]);

      return stats[0] || { totalUsers: 0, verifiedUsers: 0, activeUsers: 0 };
    } catch (error) {
      console.error('❌ Error fetching user stats from MongoDB:', error);
      return null;
    }
  }

  // Helper methods for extracting names
  extractFirstName(displayName) {
    if (!displayName) return '';
    return displayName.split(' ')[0] || '';
  }

  extractLastName(displayName) {
    if (!displayName) return '';
    const parts = displayName.split(' ');
    return parts.slice(1).join(' ') || '';
  }
}

export default new UserService();

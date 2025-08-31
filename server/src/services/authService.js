import admin, { isFirebaseAvailable } from "../config/firebase.js";
import userService from "./userService.js";

// Mock user database for additional user data (replace with real database)
const userProfiles = new Map();

class AuthService {
  async createUserProfile(firebaseUser, additionalData = {}) {
    try {
      console.log("🔐 Creating user profile for:", firebaseUser.uid);

      const userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName ||
          additionalData.fullName ||
          firebaseUser.email?.split("@")[0] ||
          "User",
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        phoneNumber: firebaseUser.phoneNumber,
        createdAt:
          firebaseUser.metadata?.creationTime || new Date().toISOString(),
        lastSignIn: firebaseUser.metadata?.lastSignInTime,
        ...additionalData,
      };

      // Store additional profile data (in real app, this would be in a database)
      userProfiles.set(firebaseUser.uid, userProfile);

      // Create user in MongoDB (required)
      console.log("🗄️  Attempting to create user in MongoDB...");
      const mongoUser = await userService.createUser({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userProfile.displayName,
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber,
        emailVerified: firebaseUser.emailVerified,
        signUpMethod: additionalData.signUpMethod || "email",
        firstName:
          additionalData.firstName || userProfile.displayName?.split(" ")[0],
        lastName:
          additionalData.lastName ||
          userProfile.displayName?.split(" ").slice(1).join(" "),
      });

      if (!mongoUser) {
        throw new Error("MongoDB user creation returned null/undefined");
      }

      console.log("✅ User profile created in MongoDB:", mongoUser._id);
      // Update the local profile with MongoDB data
      Object.assign(userProfile, {
        _id: mongoUser._id,
        firstName: mongoUser.firstName,
        lastName: mongoUser.lastName,
        medicalHistory: mongoUser.medicalHistory,
        preferences: mongoUser.preferences,
      });

      return userProfile;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  }

  async getUserProfile(uid) {
    try {
      let firebaseUserData = null;
      let firebaseAvailable = isFirebaseAvailable();

      // Try to get user from Firebase if available
      if (firebaseAvailable) {
        try {
          const userRecord = await admin.auth().getUser(uid);
          firebaseUserData = {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            emailVerified: userRecord.emailVerified,
            phoneNumber: userRecord.phoneNumber,
            disabled: userRecord.disabled,
            createdAt: userRecord.metadata.creationTime,
            lastSignIn: userRecord.metadata.lastSignInTime,
            customClaims: userRecord.customClaims || {},
          };
        } catch (firebaseError) {
          if (firebaseError.code === 'auth/user-not-found') {
            console.log(`⚠️  User not found in Firebase: ${uid}`);
            // Continue with MongoDB data only
            firebaseUserData = null;
          } else {
            throw firebaseError;
          }
        }
      }

      // Get additional profile data from local cache
      const additionalData = userProfiles.get(uid) || {};

      // Build user profile starting with Firebase data or fallback
      const userProfile = firebaseUserData || {
        uid: uid,
        email: additionalData.email || "unknown@example.com",
        displayName: additionalData.displayName || "Unknown User",
        photoURL: additionalData.photoURL || null,
        emailVerified: additionalData.emailVerified || false,
        phoneNumber: additionalData.phoneNumber || null,
        disabled: false,
        createdAt: additionalData.createdAt || new Date().toISOString(),
        lastSignIn: additionalData.lastSignIn || new Date().toISOString(),
        customClaims: additionalData.customClaims || {},
      };

      // Merge additional data from local cache
      Object.assign(userProfile, additionalData);

      // Try to get additional data from MongoDB
      try {
        const mongoUser = await userService.getUserByFirebaseUid(uid);
        if (mongoUser) {
          // Merge MongoDB data with Firebase data
          Object.assign(userProfile, {
            firstName: mongoUser.firstName,
            lastName: mongoUser.lastName,
            dateOfBirth: mongoUser.dateOfBirth,
            gender: mongoUser.gender,
            medicalHistory: mongoUser.medicalHistory,
            preferences: mongoUser.preferences,
            stats: mongoUser.stats,
            role: mongoUser.role,
            isActive: mongoUser.isActive,
            isVerified: mongoUser.isVerified,
            signUpMethod: mongoUser.signUpMethod,
            subscription: mongoUser.subscription,
            lastSignIn: mongoUser.lastSignIn,
            lastLoginAt: mongoUser.lastLoginAt,
          });
          
          // If we don't have Firebase data but have MongoDB data, use MongoDB email
          if (!firebaseUserData && mongoUser.email) {
            userProfile.email = mongoUser.email;
          }
        }
      } catch (mongoError) {
        console.error(
          "⚠️  Failed to fetch user from MongoDB:",
          mongoError.message
        );
      }

      return userProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);

      if (error.code === "auth/user-not-found") {
        throw new Error("User not found");
      }

      throw new Error("Failed to get user profile");
    }
  }

  async updateUserProfile(uid, updateData) {
    try {
      // Update Firebase user if available
      if (isFirebaseAvailable()) {
        try {
          const updatePayload = {};
          if (updateData.displayName)
            updatePayload.displayName = updateData.displayName;
          if (updateData.photoURL) updatePayload.photoURL = updateData.photoURL;
          if (updateData.phoneNumber)
            updatePayload.phoneNumber = updateData.phoneNumber;
          if (updateData.emailVerified !== undefined)
            updatePayload.emailVerified = updateData.emailVerified;
          if (updateData.disabled !== undefined)
            updatePayload.disabled = updateData.disabled;

          if (Object.keys(updatePayload).length > 0) {
            await admin.auth().updateUser(uid, updatePayload);
            console.log("✅ Firebase user updated successfully");
          }
        } catch (firebaseError) {
          console.warn(
            "⚠️  Failed to update Firebase user:",
            firebaseError.message
          );
          // Continue with MongoDB update even if Firebase fails
        }
      }

      // Update additional profile data in local cache
      const existingProfile = userProfiles.get(uid) || {};
      const updatedProfile = {
        ...existingProfile,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      userProfiles.set(uid, updatedProfile);

      // Update user in MongoDB
      try {
        console.log("🗄️  Updating user in MongoDB:", uid);
        const mongoResult = await userService.updateUser(uid, updateData);
        console.log(
          "✅ MongoDB user updated successfully:",
          mongoResult ? mongoResult._id : "N/A"
        );
      } catch (mongoError) {
        console.error(
          "❌ Failed to update user in MongoDB:",
          mongoError.message
        );
        throw new Error(`MongoDB update failed: ${mongoError.message}`);
      }

      return await this.getUserProfile(uid);
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  async deleteUser(uid) {
    try {
      if (isFirebaseAvailable()) {
        try {
          // Delete from Firebase
          await admin.auth().deleteUser(uid);
          console.log("✅ Firebase user deleted successfully");
        } catch (firebaseError) {
          console.warn(
            "⚠️  Failed to delete Firebase user:",
            firebaseError.message
          );
          // Continue with MongoDB deletion even if Firebase fails
        }
      }

      // Remove additional profile data
      userProfiles.delete(uid);

      // Delete user from MongoDB
      try {
        await userService.deleteUser(uid);
        console.log("✅ MongoDB user deleted successfully");
      } catch (mongoError) {
        console.error(
          "⚠️  Failed to delete user from MongoDB:",
          mongoError.message
        );
      }

      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }

  async setCustomClaims(uid, customClaims) {
    try {
      if (isFirebaseAvailable()) {
        await admin.auth().setCustomUserClaims(uid, customClaims);
      }
      return { success: true, message: "Custom claims set successfully" };
    } catch (error) {
      console.error("Error setting custom claims:", error);
      throw new Error("Failed to set custom claims");
    }
  }

  async verifyIdToken(idToken) {
    try {
      if (isFirebaseAvailable()) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Update last sign in in MongoDB
        try {
          await userService.updateLastSignIn(decodedToken.uid);
        } catch (mongoError) {
          console.error(
            "⚠️  Failed to update last sign in in MongoDB:",
            mongoError.message
          );
        }

        return decodedToken;
      } else {
        // Mock token verification for development
        if (idToken.startsWith("mock-token-")) {
          const parts = idToken.split("-");
          const uid = parts[2];
          return {
            uid: uid,
            email: "user@example.com",
            email_verified: true,
            name: "Mock User",
            picture: null,
            custom_claims: {},
          };
        }
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw new Error("Invalid token");
    }
  }

  async createCustomToken(uid, additionalClaims = {}) {
    try {
      if (isFirebaseAvailable()) {
        const customToken = await admin
          .auth()
          .createCustomToken(uid, additionalClaims);
        return customToken;
      } else {
        // Mock custom token for development
        return `mock-custom-token-${uid}-${Date.now()}`;
      }
    } catch (error) {
      console.error("Error creating custom token:", error);
      throw new Error("Failed to create custom token");
    }
  }

  async listUsers(maxResults = 1000, pageToken = null) {
    try {
      if (isFirebaseAvailable()) {
        const listUsersResult = await admin
          .auth()
          .listUsers(maxResults, pageToken);

        const users = listUsersResult.users.map((userRecord) => ({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          createdAt: userRecord.metadata.creationTime,
          lastSignIn: userRecord.metadata.lastSignInTime,
        }));

        return {
          users,
          pageToken: listUsersResult.pageToken,
        };
      } else {
        // Return mock users when Firebase is not available
        const mockUsers = Array.from(userProfiles.values()).map((profile) => ({
          uid: profile.uid,
          email: profile.email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          emailVerified: profile.emailVerified,
          disabled: profile.disabled,
          createdAt: profile.createdAt,
          lastSignIn: profile.lastSignIn,
        }));

        return {
          users: mockUsers,
          pageToken: null,
        };
      }
    } catch (error) {
      console.error("Error listing users:", error);
      throw new Error("Failed to list users");
    }
  }

  async getUserByEmail(email) {
    try {
      if (isFirebaseAvailable()) {
        try {
          const userRecord = await admin.auth().getUserByEmail(email);
          return await this.getUserProfile(userRecord.uid);
        } catch (firebaseError) {
          if (firebaseError.code === 'auth/user-not-found') {
            // Try to find user in MongoDB by email
            const mongoUser = await userService.getUserByEmail(email);
            if (mongoUser) {
              return await this.getUserProfile(mongoUser.firebaseUid);
            }
          }
          throw firebaseError;
        }
      } else {
        // Find user in mock data
        const mockUser = Array.from(userProfiles.values()).find(
          (user) => user.email === email
        );
        if (mockUser) {
          return mockUser;
        }
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error getting user by email:", error);

      if (error.message === "User not found") {
        throw new Error("User not found");
      }

      throw new Error("Failed to get user");
    }
  }

  async revokeRefreshTokens(uid) {
    try {
      if (isFirebaseAvailable()) {
        await admin.auth().revokeRefreshTokens(uid);
      }
      return { success: true, message: "Refresh tokens revoked successfully" };
    } catch (error) {
      console.error("Error revoking refresh tokens:", error);
      throw new Error("Failed to revoke refresh tokens");
    }
  }

  // New method to get user statistics from MongoDB
  async getUserStats() {
    try {
      return await userService.getUserStats();
    } catch (error) {
      console.error("Error getting user stats:", error);
      return null;
    }
  }

  // New method to search users in MongoDB
  async searchUsers(query, limit = 50) {
    try {
      return await userService.searchUsers(query, limit);
    } catch (error) {
      console.error("Error searching users:", error);
      throw new Error("Failed to search users");
    }
  }
}

export default new AuthService();

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // // Send email verification
  // const sendVerificationEmail = async () => {
  //   try {
  //     setError(null);
  //     if (currentUser) {
  //       await sendEmailVerification(currentUser);
  //       console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Email verification sent");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //     throw error;
  //   }
  // };

  //! Send email verification (frontend)
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (currentUser) {
        // Get Firebase ID token to authenticate with backend
        const token = await currentUser.getIdToken();

        const response = await fetch(
          "http://localhost:5000/api/auth/send-verification-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: currentUser.email }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send verification email");
        }

        console.log("✅ Custom verification email requested via backend");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      console.log("🔥 Starting signup process...", { email, displayName });
      setError(null);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("🔥 User created successfully:", result.user.uid);

      // Update profile with display name
      if (displayName) {
        console.log("🔥 Updating profile with display name...");
        await updateProfile(result.user, { displayName });
      }

      // Send email verification
      // console.log("🔥 Sending email verification...");
      // await sendVerificationEmail();
      // ! await sendEmailVerification(result.user);

      // Create user profile in MongoDB
      try {
        console.log("🗄️  Creating user profile in MongoDB...");

        // Try to get Firebase ID token, fallback to mock token if Firebase is not available
        let authToken;
        try {
          if (
            result.user.getIdToken &&
            typeof result.user.getIdToken === "function"
          ) {
            authToken = await result.user.getIdToken();
          } else {
            throw new Error("getIdToken method not available");
          }
        } catch (tokenError) {
          console.warn("⚠️  Firebase token not available, using mock token");
          authToken = `mock-token-${result.user.uid}`;
        }

        const response = await fetch("/api/auth/signup-complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            firebaseUid: result.user.uid,
            email: result.user.email,
            displayName: displayName,
            firstName: displayName?.split(" ")[0] || "",
            lastName: displayName?.split(" ").slice(1).join(" ") || "",
            signUpMethod: "email",
          }),
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log("✅ User profile created in MongoDB:", profileData);
        } else {
          console.warn(
            "⚠️  Failed to create user profile in MongoDB:",
            response.statusText
          );
        }
      } catch (profileError) {
        console.warn(
          "⚠️  Error creating user profile in MongoDB:",
          profileError
        );
        // Don't fail the signup if profile creation fails
      }

      console.log("🔥 Signup process completed successfully");
      return result;
    } catch (error) {
      console.error("🔥 Signup error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      console.log("🔥 Starting login process...", { email });
      setError(null);

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("🔥 Login successful:", result.user.uid);

      return result;
    } catch (error) {
      console.error("🔥 Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);

      // Create user profile in MongoDB for new Google users
      try {
        console.log("🗄️  Checking if Google user profile exists in MongoDB...");

        // Try to get Firebase ID token, fallback to mock token if Firebase is not available
        let authToken;
        try {
          authToken = await result.user.getIdToken();
        } catch (tokenError) {
          console.warn("⚠️  Firebase token not available, using mock token");
          authToken = `mock-token-${result.user.uid}`;
        }

        const response = await fetch("/api/auth/signup-complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            firebaseUid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            firstName: result.user.displayName?.split(" ")[0] || "",
            lastName:
              result.user.displayName?.split(" ").slice(1).join(" ") || "",
            signUpMethod: "google",
            photoURL: result.user.photoURL,
          }),
        });

        if (response.ok) {
          const profileData = await response.json();
          console.log(
            "✅ Google user profile created/verified in MongoDB:",
            profileData
          );
        } else {
          console.warn(
            "⚠️  Failed to create/verify Google user profile in MongoDB:",
            response.statusText
          );
        }
      } catch (profileError) {
        console.warn(
          "⚠️  Error handling Google user profile in MongoDB:",
          profileError
        );
        // Don't fail the signin if profile creation fails
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password using backend API
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const response = await fetch("/api/send-reset-password-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send reset email");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (currentUser) {
        // Remove empty string fields that fail server validation
        const sanitize = (obj) => {
          if (obj == null) return obj;
          if (Array.isArray(obj)) return obj; // keep arrays as-is
          if (typeof obj !== "object") return obj;
          const result = {};
          Object.entries(obj).forEach(([key, value]) => {
            if (value === "" || value === null || value === undefined) {
              return; // skip empty values
            }
            if (typeof value === "object" && !Array.isArray(value)) {
              const nested = sanitize(value);
              // only assign nested if it has keys
              if (nested && Object.keys(nested).length > 0) {
                result[key] = nested;
              }
            } else {
              result[key] = value;
            }
          });
          return result;
        };

        const sanitizedUpdates = sanitize(updates);
        // Update Firebase profile (only if it's a valid Firebase user)
        if (
          currentUser.getIdToken &&
          typeof currentUser.getIdToken === "function"
        ) {
          try {
            await updateProfile(currentUser, updates);
          } catch (firebaseError) {
            // Continue with MongoDB update even if Firebase fails
          }
        }

        // Update MongoDB profile
        try {
          // Try to get Firebase ID token, fallback to mock token if Firebase is not available
          let authToken;
          try {
            if (
              currentUser.getIdToken &&
              typeof currentUser.getIdToken === "function"
            ) {
              authToken = await currentUser.getIdToken();
            } else {
              throw new Error("getIdToken method not available");
            }
          } catch (tokenError) {
            authToken = `mock-token-${currentUser.uid}`;
          }

          const response = await fetch("/api/users/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(sanitizedUpdates),
          });

          if (response.ok) {
            const profileData = await response.json();

            // Update the current user with new data
            const updatedUser = Object.assign(currentUser, updates);
            setCurrentUser(updatedUser);
          } else {
            throw new Error("Failed to update profile in database");
          }
        } catch (profileError) {
          throw new Error("Failed to update profile: " + profileError.message);
        }
      } else {
        throw new Error("No user is currently signed in");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update password
  const updateUserPassword = async (newPassword) => {
    try {
      setError(null);
      if (currentUser) {
        await updatePassword(currentUser, newPassword);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reauthenticate user
  const reauthenticate = async (password) => {
    try {
      setError(null);
      if (currentUser && currentUser.email) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          password
        );
        await reauthenticateWithCredential(currentUser, credential);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get Firebase ID token
  const getIdToken = async (forceRefresh = false) => {
    try {
      if (
        currentUser &&
        currentUser.getIdToken &&
        typeof currentUser.getIdToken === "function"
      ) {
        return await currentUser.getIdToken(forceRefresh);
      }
      return null;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete user account
  const deleteUserAccount = async (password = null) => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error("No user is currently signed in");
      }

      // Try to get Firebase ID token, fallback to mock token if Firebase is not available
      let authToken;
      try {
        if (
          currentUser.getIdToken &&
          typeof currentUser.getIdToken === "function"
        ) {
          authToken = await currentUser.getIdToken();
        } else {
          throw new Error("getIdToken method not available");
        }
      } catch (tokenError) {
        authToken = `mock-token-${currentUser.uid}`;
      }

      // Delete user from backend (which handles both Firebase and MongoDB)
      const response = await fetch("/api/users/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Sign out the user after successful deletion
        await signOut(auth);

        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Upload and update profile photo
  const uploadProfilePhoto = async (file) => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error("No user is currently signed in");
      }

      // Acquire auth token or fallback to mock
      let authToken;
      try {
        if (
          currentUser.getIdToken &&
          typeof currentUser.getIdToken === "function"
        ) {
          authToken = await currentUser.getIdToken();
        } else {
          throw new Error("getIdToken method not available");
        }
      } catch (tokenError) {
        authToken = `mock-token-${currentUser.uid}`;
      }

      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/users/profile/photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to upload photo");
      }

      const data = await response.json();
      const newUrl = data.photoURL;

      // Best-effort update on Firebase profile
      try {
        await updateProfile(currentUser, { photoURL: newUrl });
      } catch (_) {}

      // Update MongoDB profile and local state
      await updateUserProfile({ photoURL: newUrl });
      setCurrentUser(Object.assign(currentUser, { photoURL: newUrl }));

      return newUrl;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    console.log("🔥 Setting up Firebase auth state listener...");

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log(
          "🔥 Auth state changed:",
          user ? `User: ${user.email}` : "No user"
        );

        if (user) {
          // Get user profile from MongoDB
          try {
            console.log("🗄️  Fetching user profile from MongoDB...");

            // Try to get Firebase ID token, fallback to mock token if Firebase is not available
            let authToken;
            try {
              if (user.getIdToken && typeof user.getIdToken === "function") {
                authToken = await user.getIdToken();
              } else {
                throw new Error("getIdToken method not available");
              }
            } catch (tokenError) {
              console.warn(
                "⚠️  Firebase token not available, using mock token"
              );
              authToken = `mock-token-${user.uid}`;
            }

            const response = await fetch("/api/users/profile", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });

            if (response.ok) {
              const profileData = await response.json();
              console.log("✅ User profile loaded from MongoDB:", profileData);

              // Merge MongoDB profile data with Firebase user data
              // Preserve the original Firebase user object and its methods
              const enhancedUser = Object.assign(user, {
                ...profileData.user,
                // Ensure Firebase data takes precedence
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL || profileData.user?.photoURL || null,
              });

              setCurrentUser(enhancedUser);
            } else {
              console.warn(
                "⚠️  Failed to load user profile from MongoDB:",
                response.statusText
              );
              setCurrentUser(user);
            }
          } catch (profileError) {
            console.warn(
              "⚠️  Error loading user profile from MongoDB:",
              profileError
            );
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("🔥 Auth state change error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
    reauthenticate,
    sendVerificationEmail,
    deleteUserAccount,
    getIdToken,
    uploadProfilePhoto,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

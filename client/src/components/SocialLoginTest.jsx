import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { SocialButton } from "./base/buttons/social-button";
import { toast } from "sonner";

const SocialLoginTest = () => {
  const { signInWithGoogle, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider, loginFunction) => {
    setIsLoading(true);
    try {
      await loginFunction();
      toast.success(`Successfully signed in with ${provider}!`);
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      toast.error(`Failed to sign in with ${provider}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Social Login Test</h2>

      {currentUser ? (
        <div className="text-center mb-4">
          <p className="text-green-600 font-medium">✅ Signed in as:</p>
          <p className="text-gray-700">{currentUser.email}</p>
          <p className="text-sm text-gray-500">
            Provider: {currentUser.providerData?.[0]?.providerId || "Unknown"}
          </p>
        </div>
      ) : (
        <p className="text-center mb-4 text-gray-600">Not signed in</p>
      )}

      <SocialButton
        social="google"
        onClick={() => handleSocialLogin("Google", signInWithGoogle)}
        disabled={isLoading}
      >
        Test Google Sign In
      </SocialButton>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-dermx-teal"></div>
          <p className="text-sm text-gray-600 mt-2">Processing...</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click any social login button to test</li>
          <li>• Check browser console for detailed logs</li>
          <li>• Verify user profile is created in MongoDB</li>
          <li>• Test error handling with invalid credentials</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialLoginTest;

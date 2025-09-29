import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../contexts/AuthContext";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

const AuthTestPage = () => {
  const { currentUser, getIdToken } = useAuth();
  const { get, post, loading, error } = useApi();
  const [testResults, setTestResults] = useState([]);
  const [tokenInfo, setTokenInfo] = useState(null);

  const addTestResult = (test, success, message, data = null) => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        test,
        success,
        message,
        data,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testGetToken = async () => {
    try {
      const token = await getIdToken();
      if (token) {
        setTokenInfo({
          token: token.substring(0, 50) + "...",
          length: token.length,
        });
        addTestResult(
          "Get ID Token",
          true,
          "Successfully retrieved Firebase ID token"
        );
      } else {
        addTestResult("Get ID Token", false, "No token available");
      }
    } catch (error) {
      addTestResult("Get ID Token", false, error.message);
    }
  };

  const testVerifyToken = async () => {
    try {
      const response = await post("/api/auth/verify", {
        idToken: await getIdToken(),
      });
      addTestResult(
        "Verify Token",
        true,
        "Token verified successfully",
        response
      );
    } catch (error) {
      addTestResult("Verify Token", false, error.message);
    }
  };

  const testGetProfile = async () => {
    try {
      const response = await get("/api/auth/profile");
      addTestResult(
        "Get Profile",
        true,
        "Profile retrieved successfully",
        response
      );
    } catch (error) {
      addTestResult("Get Profile", false, error.message);
    }
  };

  const testProtectedRoute = async () => {
    try {
      const response = await get("/api/diagnosis/history");
      addTestResult(
        "Protected Route",
        true,
        "Accessed protected route successfully",
        response
      );
    } catch (error) {
      addTestResult("Protected Route", false, error.message);
    }
  };

  const testPublicRoute = async () => {
    try {
      const response = await get("/api/insights?limit=1");
      addTestResult(
        "Public Route",
        true,
        "Accessed public route successfully",
        response
      );
    } catch (error) {
      addTestResult("Public Route", false, error.message);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    toast.info("Running authentication tests...");

    await testGetToken();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testVerifyToken();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testGetProfile();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testProtectedRoute();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testPublicRoute();

    toast.success("All tests completed!");
  };

  const clearResults = () => {
    setTestResults([]);
    setTokenInfo(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authentication Test Page</h1>
          <p className="text-gray-600">
            Test Firebase authentication integration and API connectivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current User</CardTitle>
              <CardDescription>Firebase authentication status</CardDescription>
            </CardHeader>
            <CardContent>
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="success"
                      className="bg-green-100 text-green-800"
                    >
                      Authenticated
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">UID:</span>
                      <span className="ml-2 font-mono text-xs">
                        {currentUser.uid}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{currentUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium">Display Name:</span>
                      <span className="ml-2">
                        {currentUser.displayName || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Email Verified:</span>
                      <Badge
                        variant={
                          currentUser.emailVerified ? "success" : "destructive"
                        }
                        className={`ml-2 ${
                          currentUser.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {currentUser.emailVerified ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>

                  {tokenInfo && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">
                        Current Token
                      </h4>
                      <p className="text-xs font-mono break-all">
                        {tokenInfo.token}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Length: {tokenInfo.length} characters
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800"
                  >
                    Not Authenticated
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Please sign in to test authentication
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>
                Run authentication and API tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testGetToken}
                  disabled={!currentUser || loading}
                  variant="outline"
                  size="sm"
                >
                  Get Token
                </Button>
                <Button
                  onClick={testVerifyToken}
                  disabled={!currentUser || loading}
                  variant="outline"
                  size="sm"
                >
                  Verify Token
                </Button>
                <Button
                  onClick={testGetProfile}
                  disabled={!currentUser || loading}
                  variant="outline"
                  size="sm"
                >
                  Get Profile
                </Button>
                <Button
                  onClick={testProtectedRoute}
                  disabled={!currentUser || loading}
                  variant="outline"
                  size="sm"
                >
                  Protected Route
                </Button>
              </div>

              <Button
                onClick={testPublicRoute}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test Public Route
              </Button>

              <div className="flex space-x-2">
                <Button
                  onClick={runAllTests}
                  disabled={!currentUser || loading}
                  className="flex-1 bg-dermx-teal hover:bg-dermx-teal/90"
                >
                  {loading ? "Running..." : "Run All Tests"}
                </Button>
                <Button onClick={clearResults} variant="outline">
                  Clear
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from authentication and API tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg border ${
                      result.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={result.success ? "success" : "destructive"}
                          className={
                            result.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {result.test}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {result.timestamp}
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          result.success ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-sm ${
                        result.success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.message}
                    </p>

                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer">
                          View Response Data
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">API URL:</span>
                <span className="ml-2">
                  {import.meta.env.VITE_API_URL || "http://localhost:5000"}
                </span>
              </div>
              <div>
                <span className="font-medium">Firebase Project:</span>
                <span className="ml-2">
                  {import.meta.env.VITE_FIREBASE_PROJECT_ID}
                </span>
              </div>
              <div>
                <span className="font-medium">Auth Domain:</span>
                <span className="ml-2">
                  {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}
                </span>
              </div>
              <div>
                <span className="font-medium">Use Firebase Auth:</span>
                <span className="ml-2">
                  {import.meta.env.VITE_USE_FIREBASE_AUTH || "true"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthTestPage;

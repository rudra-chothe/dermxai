import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { LogOut, AlertTriangle } from "lucide-react";

// Mobile Logout Confirmation Dialog Component
const MobileLogoutConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          You will be redirected to the login page and will need to sign in
          again to access your account.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { currentUser, sendVerificationEmail, resetPassword, logout } = useAuth();
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState(false);
  const [showMobileLogoutConfirm, setShowMobileLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    try {
      await sendVerificationEmail();
      toast.success("Verification email sent!");
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email");
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSendResetPasswordEmail = async () => {
    if (!currentUser?.email) {
      toast.error("No email address found");
      return;
    }

    setIsSendingResetEmail(true);
    try {
      await resetPassword(currentUser.email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const handleMobileLogoutClick = () => {
    setShowMobileLogoutConfirm(true);
  };

  const handleMobileLogoutConfirm = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/");
      setShowMobileLogoutConfirm(false);
    } catch (error) {
      toast.error("Failed to log out");
      setShowMobileLogoutConfirm(false);
    }
  };

  const handleMobileLogoutCancel = () => {
    setShowMobileLogoutConfirm(false);
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile.
          </p>
          <Link to="/login">
            <Button className="bg-dermx-teal hover:bg-dermx-teal/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link to="/profile/edit">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-dermx-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser.displayName?.charAt(0) ||
                      currentUser.email?.charAt(0) ||
                      "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentUser.displayName || "No display name set"}
                  </h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <p className="text-gray-900">
                    {currentUser.displayName || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900">{currentUser.email}</p>
                    {currentUser.emailVerified ? (
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800"
                      >
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {currentUser.phoneNumber || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {currentUser.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>

                {currentUser.firstName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <p className="text-gray-900">{currentUser.firstName}</p>
                  </div>
                )}

                {currentUser.lastName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900">{currentUser.lastName}</p>
                  </div>
                )}
              </div>

              {/* Email Verification */}
              {!currentUser.emailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Email Verification Required
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please verify your email address to access all features.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      {isResendingVerification ? "Sending..." : "Resend"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/profile/edit" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {isResendingVerification ? "Sending..." : "Send Verification Email"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSendResetPasswordEmail}
                  disabled={isSendingResetEmail}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {isSendingResetEmail ? "Sending..." : "Reset Password"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Privacy Settings
                </Button>

                {/* Mobile-only Logout Button */}
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    onClick={handleMobileLogoutClick}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Diagnoses</span>
                  <span className="font-medium">
                    {currentUser.stats?.totalDiagnoses || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Reports Generated
                  </span>
                  <span className="font-medium">
                    {currentUser.stats?.totalReports || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Documents Analyzed
                  </span>
                  <span className="font-medium">
                    {currentUser.stats?.totalDocuments || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Questions Asked</span>
                  <span className="font-medium">
                    {currentUser.stats?.totalQuestions || 0}
                  </span>
                </div>
                {currentUser.stats?.lastActivity && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Activity</span>
                    <span className="font-medium text-xs">
                      {new Date(
                        currentUser.stats.lastActivity
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Logout Confirmation Dialog */}
        <MobileLogoutConfirmationDialog
          isOpen={showMobileLogoutConfirm}
          onConfirm={handleMobileLogoutConfirm}
          onCancel={handleMobileLogoutCancel}
        />
      </div>
    </div>
  );
};

export default UserProfile;

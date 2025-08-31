import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, X } from "lucide-react";

const SimpleDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete Account",
  description = "Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data from both Firebase and MongoDB.",
  confirmText = "Delete Account",
  cancelText = "Cancel",
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirmationText === "DELETE") {
      onConfirm();
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmationText(""); // Reset confirmation text when closing
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-600">{title}</h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-2">Warning:</p>
                <p>{description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              What will be deleted:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your personal information and profile</li>
              <li>• Medical history and preferences</li>
              <li>• All associated data and settings</li>
              <li>• Authentication credentials</li>
            </ul>
          </div>

          {/* Confirmation Text Input */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmation"
              className="text-sm font-medium text-gray-900"
            >
              Type "DELETE" to confirm account deletion
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE"
              className="border-red-200 focus:border-red-400"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmationText !== "DELETE" || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleDeleteDialog;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false,
  title = "Delete Account",
  description = "Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data from both Firebase and MongoDB.",
  confirmText = "Delete Account",
  cancelText = "Cancel"
}) => {
  const handleConfirm = () => {
    try {
      onConfirm();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  };

  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      console.error('Error closing dialog:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl text-red-600">{title}</DialogTitle>
              <DialogDescription className="text-gray-600">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
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
            <h4 className="text-sm font-medium text-gray-900 mb-2">What will be deleted:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your personal information and profile</li>
              <li>• Medical history and preferences</li>
              <li>• All associated data and settings</li>
              <li>• Authentication credentials</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex gap-3">
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
            disabled={isLoading}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;

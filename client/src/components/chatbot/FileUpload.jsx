import { useRef, useState } from "react";
import { Paperclip, X, FileText, Image, File } from "lucide-react";
import { cls } from "./utils";

const ALLOWED_FILE_TYPES = {
  'application/pdf': { ext: 'pdf', icon: FileText, color: 'text-red-500' },
  'image/png': { ext: 'png', icon: Image, color: 'text-green-500' },
  'image/jpeg': { ext: 'jpg', icon: Image, color: 'text-green-500' },
  'image/jpg': { ext: 'jpg', icon: Image, color: 'text-green-500' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', icon: FileText, color: 'text-blue-500' },
  'application/msword': { ext: 'doc', icon: FileText, color: 'text-blue-500' }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onFilesSelected, selectedFiles = [], onRemoveFile }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      // Check file type
      if (!ALLOWED_FILE_TYPES[file.type]) {
        errors.push(`${file.name}: File type not supported. Only PDF, PNG, JPG, and DOCX files are allowed.`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
        return;
      }

      // Check if file already selected
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name}: File already selected.`);
        return;
      }

      validFiles.push({
        file,
        id: Math.random().toString(36).slice(2),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: null
      });
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      // Create previews for images
      validFiles.forEach(fileObj => {
        if (fileObj.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileObj.preview = e.target.result;
            onFilesSelected([...selectedFiles, ...validFiles]);
          };
          reader.readAsDataURL(fileObj.file);
        } else {
          onFilesSelected([...selectedFiles, ...validFiles]);
        }
      });

      if (!validFiles.some(f => f.type.startsWith('image/'))) {
        onFilesSelected([...selectedFiles, ...validFiles]);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    const fileInfo = ALLOWED_FILE_TYPES[type];
    if (!fileInfo) return File;
    return fileInfo.icon;
  };

  const getFileColor = (type) => {
    const fileInfo = ALLOWED_FILE_TYPES[type];
    if (!fileInfo) return 'text-gray-500';
    return fileInfo.color;
  };

  return (
    <>
      {/* File Input Button - Inline */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 inline-flex items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
        title="Attach files (PDF, PNG, JPG, DOCX)"
      >
        <Paperclip className="h-4 w-4" />
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.docx,.doc"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="rounded-2xl border-2 border-dashed border-dermx-teal bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
            <Paperclip className="mx-auto h-12 w-12 text-dermx-teal mb-4" />
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              Drop files here
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              PDF, PNG, JPG, DOCX files only (max 10MB)
            </p>
          </div>
        </div>
      )}

      {/* Global drag handlers */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      />
    </>
  );
}
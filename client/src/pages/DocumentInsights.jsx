import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DocumentInsights = () => {
  const { getIdToken, currentUser } = useAuth();
  const { toast } = useToast();
  const chatEndRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResponse, setQueryResponse] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [ragFiles, setRagFiles] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());


  const clearChat = () => {
    setChatHistory([]);
  };

  const toggleDocumentSelection = (fileId) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(new Set(ragFiles.map(file => file._id))); // _id is the fileId from aggregation
  };

  const clearDocumentSelection = () => {
    setSelectedDocuments(new Set());
  };



  // Load user documents on component mount
  useEffect(() => {
    if (currentUser) {
      loadUserDocuments();
      loadRagFiles();
    }
  }, [currentUser]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const loadUserDocuments = async () => {
    try {
      const token = await getIdToken();
      const response = await fetch("/api/documents/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  const loadRagFiles = async () => {
    try {
      if (!currentUser?.uid) return;

      const token = await getIdToken();
      const response = await fetch(
        `/api/documents/rag/upload/files/${currentUser.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRagFiles(data.files || []);
      }
    } catch (error) {
      console.error("Failed to load RAG files:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - for RAG, we'll focus on PDFs for now
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Only PDF files are supported for RAG processing",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (10MB limit for RAG)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      handleRagUpload(file);
    }
  };

  const handleRagUpload = async (file) => {
    if (!currentUser?.uid) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive",
      });
      return;
    }

    console.log("🔄 Starting RAG upload for user:", currentUser.uid);
    setIsUploading(true);

    try {
      const token = await getIdToken();
      const formData = new FormData();
      formData.append("file", file);
      // Note: userId is set on server side from authenticated user

      console.log("📤 Sending upload request...");
      const response = await fetch("/api/documents/rag/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📥 Upload response status:", response.status);
      const data = await response.json();
      console.log("📥 Upload response data:", data);

      if (response.ok && data.success) {
        toast({
          title: "Upload successful",
          description: `File processed successfully! Created ${data.chunksCreated} chunks.`,
        });

        // Reload RAG files
        loadRagFiles();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("RAG Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!currentUser?.uid) {
      toast({
        title: "Authentication required",
        description: "Please log in to ask questions",
        variant: "destructive",
      });
      return;
    }

    if (ragFiles.length === 0) {
      toast({
        title: "No documents available",
        description:
          "Please upload and process documents before asking questions",
        variant: "destructive",
      });
      return;
    }

    if (selectedDocuments.size === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to chat with",
        variant: "destructive",
      });
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: query.trim(),
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    const currentQuery = query.trim();
    setQuery("");
    setIsQuerying(true);

    try {
      const token = await getIdToken();
      console.log("💬 Sending question:", currentQuery);
      const response = await fetch("/api/documents/rag/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: currentQuery,
          fileId: selectedDocuments.size > 0 ? Array.from(selectedDocuments)[0] : null, // For now, use first selected document
          selectedDocuments: Array.from(selectedDocuments), // Send all selected documents
        }),
      });

      console.log("📥 Ask response status:", response.status);
      const data = await response.json();
      console.log("📥 Ask response data:", data);

      if (response.ok && data.success) {
        // Parse the answer to check if it contains thinking process
        let parsedAnswer;
        try {
          parsedAnswer = JSON.parse(data.answer);
        } catch (e) {
          // If not JSON, treat as regular string and clean any remaining think tags
          let cleanAnswer = data.answer;
          
          // Additional client-side cleaning as backup
          cleanAnswer = cleanAnswer
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/\<think\>[\s\S]*?\<\/think\>/gi, '')
            .trim();
          
          parsedAnswer = {
            thinking: null,
            answer: cleanAnswer,
            hasThinking: false
          };
        }
        
        // Additional safety check - clean the answer even if it came from JSON
        if (parsedAnswer.answer) {
          parsedAnswer.answer = parsedAnswer.answer
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .replace(/\<think\>[\s\S]*?\<\/think\>/gi, '')
            .trim();
        }

        // Add AI response to chat
        const aiMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: parsedAnswer.answer,
          sources: data.sources,
          relevantChunks: data.relevantChunks,
          timestamp: new Date(),
        };

        setChatHistory((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || "Query failed");
      }
    } catch (error) {
      console.error("Query error:", error);

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: error.message || "Failed to process your question",
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      const token = await getIdToken();
      const response = await fetch(`/api/documents/files/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        toast({
          title: "Document deleted",
          description: "Document has been successfully deleted",
        });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-full mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Document Insights</h1>
        <p className="text-gray-600 mb-8">
          Upload medical documents and extract insights with our AI-powered RAG
          system
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Upload and Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-dermx-soft-purple rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-dermx-purple"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold mb-2">Upload Documents</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Upload PDF files up to 10MB for RAG processing
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="document-upload"
                  className="block cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-500 mb-1 text-sm">
                    Drop PDF here or click to browse
                  </p>
                  <p className="text-gray-400 text-xs">Max file size: 10MB</p>
                </label>
              </div>

              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-sm">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-dermx-teal"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing document...
                  </div>
                </div>
              )}
            </div>

            {/* RAG Documents List */}
            {ragFiles.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Documents</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {selectedDocuments.size} of {ragFiles.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectedDocuments.size === ragFiles.length ? clearDocumentSelection : selectAllDocuments}
                      className="text-xs"
                    >
                      {selectedDocuments.size === ragFiles.length ? "Clear All" : "Select All"}
                    </Button>
                  </div>
                </div>
                
                {selectedDocuments.size > 0 && (
                  <div className="mb-4 p-3 bg-dermx-soft-teal rounded-lg">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-dermx-teal mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-dermx-teal font-medium">
                        Chat will use {selectedDocuments.size} selected document{selectedDocuments.size > 1 ? 's' : ''} as context
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ragFiles.map((file) => {
                    const isSelected = selectedDocuments.has(file._id);
                    return (
                      <div
                        key={file._id}
                        className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                          isSelected 
                            ? 'border-dermx-teal bg-dermx-soft-teal/30' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                            isSelected ? 'bg-dermx-teal' : 'bg-dermx-soft-blue'
                          }`}>
                            {isSelected ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">
                              {file.filename}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {file.chunkCount} chunks ·{" "}
                              {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ready
                          </span>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleDocumentSelection(file._id)}
                            className={`text-xs ${
                              isSelected 
                                ? 'bg-dermx-teal hover:bg-dermx-teal/90 text-white' 
                                : 'border-dermx-teal text-dermx-teal hover:bg-dermx-teal hover:text-white'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No documents message */}
            {ragFiles.length === 0 && !isUploading && (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  No documents uploaded
                </h3>
                <p className="text-gray-600 text-sm">
                  Upload your first PDF document to start asking questions!
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-3 space-y-6">
            {ragFiles.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full min-h-[600px] flex flex-col">
                <div className="bg-gradient-to-r from-dermx-teal to-dermx-purple p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-1">
                        Chat with Your Documents
                      </h2>
                      <p className="text-white/80 text-xs">
                        {selectedDocuments.size > 0 
                          ? `Using ${selectedDocuments.size} selected document${selectedDocuments.size > 1 ? 's' : ''} as context`
                          : 'Ask questions about your uploaded documents'
                        }
                      </p>
                    </div>
                    {chatHistory.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                      >
                        Clear Chat
                      </Button>
                    )}
                  </div>
                  
                  {selectedDocuments.size > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ragFiles
                        .filter(file => selectedDocuments.has(file._id))
                        .map(file => (
                          <span 
                            key={file._id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/20 text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {file.filename.length > 20 ? file.filename.substring(0, 20) + '...' : file.filename}
                          </span>
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-dermx-soft-purple rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-dermx-purple"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">
                        {selectedDocuments.size > 0 ? 'Start a conversation' : 'Select documents to chat'}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {selectedDocuments.size > 0 
                          ? `Ask questions about your ${selectedDocuments.size} selected document${selectedDocuments.size > 1 ? 's' : ''}`
                          : 'Select one or more documents from the left panel to start chatting'
                        }
                      </p>

                      {/* Sample question buttons */}
                      {selectedDocuments.size > 0 && (
                        <div className="space-y-2">
                          <button
                            onClick={() =>
                              setQuery(
                                "What are the latest treatments for psoriasis?"
                              )
                            }
                            className="block w-full text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-2 rounded-lg hover:bg-dermx-purple hover:text-white transition-colors"
                          >
                            What are the latest treatments for psoriasis?
                          </button>
                          <button
                            onClick={() =>
                              setQuery("Summarize the efficacy of biologic drugs")
                            }
                            className="block w-full text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-2 rounded-lg hover:bg-dermx-purple hover:text-white transition-colors"
                          >
                            Summarize the efficacy of biologic drugs
                          </button>
                          <button
                            onClick={() =>
                              setQuery(
                                "What side effects are mentioned for JAK inhibitors?"
                              )
                            }
                            className="block w-full text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-2 rounded-lg hover:bg-dermx-purple hover:text-white transition-colors"
                          >
                            What side effects are mentioned for JAK inhibitors?
                          </button>
                        </div>
                      )}
                      
                      {selectedDocuments.size === 0 && (
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <p className="text-xs text-gray-400">Select documents to enable chat</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {chatHistory.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-sm lg:max-w-lg ${
                              message.type === "user"
                                ? "bg-dermx-teal text-white"
                                : message.type === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            } rounded-lg p-3`}
                          >
                            <div className="flex items-start space-x-2">
                              {message.type !== "user" && (
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    message.type === "error"
                                      ? "bg-red-200"
                                      : "bg-dermx-soft-purple"
                                  }`}
                                >
                                  {message.type === "error" ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-red-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-dermx-purple"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="leading-relaxed text-sm">
                                  {message.content}
                                </p>

                                {/* Sources for AI messages */}
                                {/* {message.type === "ai" &&
                                  message.sources &&
                                  message.sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <p className="text-xs text-gray-600 mb-1">
                                        Sources ({message.relevantChunks} chunks
                                        found):
                                      </p>
                                      <div className="space-y-1">
                                        {message.sources.map(
                                          (source, index) => (
                                            <div
                                              key={index}
                                              className="text-xs bg-white/50 p-1 rounded"
                                            >
                                              <span className="font-medium">
                                                {source.filename}
                                              </span>
                                              <span className="text-gray-600">
                                                {" "}
                                                · Chunk {source.chunkIndex + 1}
                                              </span>
                                              {source.score && (
                                                <span className="text-gray-500">
                                                  {" "}
                                                  ·{" "}
                                                  {Math.round(
                                                    source.score * 100
                                                  )}
                                                  % match
                                                </span>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )} */}

                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {isQuerying && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-dermx-soft-purple rounded-full flex items-center justify-center">
                                <svg
                                  className="animate-spin h-3 w-3 text-dermx-purple"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </div>
                              <span className="text-gray-600 text-sm">
                                Thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleQuery} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={selectedDocuments.size > 0 ? "Ask something about your documents..." : "Select documents first..."}
                      className="flex-1 text-sm"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={isQuerying || selectedDocuments.size === 0}
                    />
                    <Button
                      type="submit"
                      className="bg-dermx-teal hover:bg-dermx-teal/90 px-3"
                      disabled={isQuerying || !query.trim() || selectedDocuments.size === 0}
                    >
                      {isQuerying ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Chat Ready
                </h3>
                <p className="text-gray-600 text-sm">
                  Upload documents to start chatting with your files
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentInsights;

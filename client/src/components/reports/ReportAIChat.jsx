import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, Bot, User, FileText, Calendar, TrendingUp } from "lucide-react";
import qaApi from "@/services/qaApi";
import Loader from "@/components/ui/Loader";

const ReportAIChat = ({ report, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message and report context
    const welcomeMessage = {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm here to help you understand your analysis report for ${report.condition || 'your condition'}. I have access to your report details including the diagnosis, confidence level, and summary. What would you like to know about your report?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [report]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await qaApi.askAboutReport(inputValue, report);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer || response.response || "I apologize, but I couldn't process your question about this report. Please try rephrasing your question.",
        confidence: response.confidence,
        sources: response.sources,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble processing your question right now. Please try again in a moment.",
        error: true,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What does this diagnosis mean?",
    "How serious is this condition?",
    "What are the treatment options?",
    "Should I see a dermatologist?",
    "What lifestyle changes should I consider?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-dermx-lavender/10 rounded-lg">
              <Bot className="w-6 h-6 text-dermx-lavender" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI Assistant - Report Discussion
              </h2>
              <p className="text-sm text-gray-600">
                Discussing: {report.condition || 'Your Analysis Report'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Report Summary Card */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{report.condition || 'Unknown Condition'}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>{report.confidence}% confidence</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="p-2 bg-dermx-lavender/10 rounded-full">
                  <Bot className="w-4 h-4 text-dermx-lavender" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-dermx-teal text-white"
                    : message.error
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.confidence && (
                  <p className="text-xs mt-2 opacity-70">
                    Confidence: {message.confidence}%
                  </p>
                )}
              </div>
              {message.role === "user" && (
                <div className="p-2 bg-dermx-teal/10 rounded-full">
                  <User className="w-4 h-4 text-dermx-teal" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="p-2 bg-dermx-lavender/10 rounded-full">
                <Bot className="w-4 h-4 text-dermx-lavender" />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Loader size="small" />
                  <span className="text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your report..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-dermx-teal focus:border-transparent"
              rows="2"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-dermx-teal hover:bg-dermx-teal/90 px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAIChat;
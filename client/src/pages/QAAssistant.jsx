import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QAAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your DermX-AI assistant. How can I help you with your dermatology questions today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      let responseContent = "";

      // Simple response logic based on user input
      const lowercaseInput = inputValue.toLowerCase();
      if (lowercaseInput.includes("eczema")) {
        responseContent =
          "Eczema is a condition that causes your skin to become itchy, red, dry and cracked. It's common in children but can occur at any age. Typical treatments include regular use of moisturizers, topical corticosteroids to reduce inflammation, and identifying and avoiding triggers. Would you like more specific information about eczema treatment or management?";
      } else if (lowercaseInput.includes("psoriasis")) {
        responseContent =
          "Psoriasis is a chronic autoimmune condition that causes the rapid buildup of skin cells, resulting in scaling on the skin's surface. Treatment options include topical treatments (corticosteroids, vitamin D analogs), phototherapy, and systemic medications including biologics for more severe cases. Would you like more information about a specific psoriasis treatment?";
      } else if (lowercaseInput.includes("acne")) {
        responseContent =
          "Acne is a skin condition that occurs when hair follicles become plugged with oil and dead skin cells. Common treatments include topical retinoids, benzoyl peroxide, salicylic acid, and for more severe cases, oral antibiotics or isotretinoin. A consistent skincare routine is also important for management. Can I provide more details about specific acne treatments?";
      } else if (
        lowercaseInput.includes("treatment") ||
        lowercaseInput.includes("medicine")
      ) {
        responseContent =
          "When considering treatments for skin conditions, it's important to consult with a healthcare professional for personalized advice. Generally, treatments can include topical medications, oral medications, phototherapy, or lifestyle modifications depending on the specific condition. Would you like information about treatments for a specific skin condition?";
      } else {
        responseContent =
          "Thank you for your question. I'd be happy to help with information about various skin conditions, treatments, and general dermatological advice. Could you provide more details about your specific concern so I can give you more relevant information?";
      }

      const assistantMessage = {
        id: messages.length + 2,
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dermatology Q&A Assistant</h1>
        <p className="text-gray-600 mb-8">
          Get answers to your dermatology questions from our AI-powered
          assistant
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden h-[70vh] flex flex-col">
          {/* Chat Header */}
          <div className="bg-dermx-teal p-4 text-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">DermX-AI Assistant</h2>
                <p className="text-xs opacity-80">
                  Powered by advanced dermatology AI
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-dermx-soft-purple/30">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl p-3 ${
                      message.type === "user"
                        ? "bg-dermx-teal text-white rounded-tr-none"
                        : "bg-white shadow rounded-tl-none"
                    }`}
                  >
                    <p
                      className={
                        message.type === "user" ? "text-white" : "text-gray-800"
                      }
                    >
                      {message.content}
                    </p>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* AI typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl rounded-tl-none shadow p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-dermx-teal animate-pulse"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-dermx-teal animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-dermx-teal animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your question here..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-dermx-teal hover:bg-dermx-teal/90"
                disabled={!inputValue.trim() || isTyping}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </form>

            {/* Suggested questions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setInputValue("What causes eczema flare-ups?")}
                className="text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
              >
                What causes eczema flare-ups?
              </button>
              <button
                onClick={() =>
                  setInputValue("How do I know if I have psoriasis?")
                }
                className="text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
              >
                How do I know if I have psoriasis?
              </button>
              <button
                onClick={() =>
                  setInputValue("Best treatments for hormonal acne?")
                }
                className="text-xs bg-dermx-soft-purple text-dermx-purple px-3 py-1 rounded-full"
              >
                Best treatments for hormonal acne?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAAssistant;

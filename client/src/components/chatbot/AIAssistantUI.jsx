import { useRef, useState } from "react";
import ChatPane from "./ChatPane";
import qaApi from "../../services/qaApi";
import DebugPanel from "./DebugPanel";

export default function AIAssistantUI() {
  const [conversation, setConversation] = useState({
    id: "main",
    title: "DermX-AI Assistant",
    updatedAt: new Date().toISOString(),
    messageCount: 1,
    preview: "Hello! I'm your DermX-AI assistant...",
    pinned: false,
    folder: "Main",
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your DermX-AI assistant. How can I help you with your dermatology questions today?",
        createdAt: new Date().toISOString(),
      },
    ],
  });

  const [isThinking, setIsThinking] = useState(false);
  const composerRef = useRef(null);

  async function sendMessage(content, files = []) {
    if (!content.trim() && files.length === 0) return;

    const now = new Date().toISOString();
    const userMsg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content:
        content || (files.length > 0 ? `Uploaded ${files.length} file(s)` : ""),
      files: files,
      createdAt: now,
    };

    // Add user message
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      updatedAt: now,
      messageCount: prev.messages.length + 1,
      preview: content.slice(0, 80),
    }));

    // Start thinking
    setIsThinking(true);

    try {
      // Handle file uploads with context
      let questionWithContext = content;
      if (files && files.length > 0) {
        const fileTypes = files.map((f) => {
          if (f.type.startsWith("image/")) return "image";
          if (f.type === "application/pdf") return "PDF document";
          if (f.type.includes("word")) return "Word document";
          return "document";
        });

        questionWithContext = `I have uploaded ${
          files.length
        } file(s): ${fileTypes.join(", ")}. ${content}`;
      }

      // Call the real API
      const response = await qaApi.askQuestion(questionWithContext);

      const asstMsg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: response.answer,
        confidence: response.confidence,
        sources: response.sources,
        relatedQuestions: response.relatedQuestions,
        createdAt: new Date().toISOString(),
      };

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, asstMsg],
        updatedAt: new Date().toISOString(),
        messageCount: prev.messages.length + 1,
        preview: asstMsg.content.slice(0, 80),
      }));
    } catch (error) {
      console.error("Failed to get AI response:", error);

      // Fallback response on error
      const errorMsg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your question right now. Please try again in a moment. If the issue persists, you may want to consult with a dermatologist directly for medical advice.",
        error: true,
        createdAt: new Date().toISOString(),
      };

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
        updatedAt: new Date().toISOString(),
        messageCount: prev.messages.length + 1,
        preview: errorMsg.content.slice(0, 80),
      }));
    } finally {
      setIsThinking(false);
    }
  }

  function editMessage(messageId, newContent) {
    const now = new Date().toISOString();
    setConversation((prev) => ({
      ...prev,
      messages: prev.messages.map((m) =>
        m.id === messageId ? { ...m, content: newContent, editedAt: now } : m
      ),
    }));
  }

  function resendMessage(messageId) {
    const msg = conversation.messages.find((m) => m.id === messageId);
    if (!msg) return;
    sendMessage(msg.content);
  }

  function pauseThinking() {
    setIsThinking(false);
  }

  return (
    <div className="h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <ChatPane
        ref={composerRef}
        conversation={conversation}
        onSend={sendMessage}
        onEditMessage={editMessage}
        onResendMessage={resendMessage}
        isThinking={isThinking}
        onPauseThinking={pauseThinking}
      />
      {/* Debug panel for development */}
      {/* {import.meta.env.DEV && <DebugPanel />} */}
    </div>
  );
}

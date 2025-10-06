import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { Pencil, RefreshCw, Check, X, Square } from "lucide-react";
import Message from "./Message";
import Composer from "./Composer";
import { cls } from "./utils";

function ThinkingMessage({ onPause }) {
  return (
    <Message role="assistant">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-dermx-teal [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-dermx-teal [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-dermx-teal"></div>
        </div>
        <span className="text-sm text-zinc-500">DermX-AI is thinking...</span>
        <button
          onClick={onPause}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Square className="h-3 w-3" /> Pause
        </button>
      </div>
    </Message>
  );
}

const ChatPane = forwardRef(function ChatPane(
  {
    conversation,
    onSend,
    onEditMessage,
    onResendMessage,
    isThinking,
    onPauseThinking,
  },
  ref
) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const composerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent);
      },
    }),
    []
  );

  if (!conversation) return null;

  const tags = ["Dermatology", "AI-Powered", "Evidence-Based", "Personalized"];
  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
    : [];

  // Check if scrolling is needed and auto-scroll to bottom when new messages are added
  useEffect(() => {
    const checkScrollNeeded = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        const isScrollNeeded = scrollHeight > clientHeight + 5; // Add small buffer
        setNeedsScroll(isScrollNeeded);
      }
    };

    // Check scroll needed on mount and when messages change
    const timeoutId = setTimeout(checkScrollNeeded, 50);

    // Auto-scroll to bottom when new messages are added
    if (messages.length > 1 && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }

    // Add resize observer to check scroll needed when container size changes
    const resizeObserver = new ResizeObserver(checkScrollNeeded);
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [messages, isThinking]);

  function startEdit(m) {
    setEditingId(m.id);
    setDraft(m.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
  }

  function saveEdit() {
    if (!editingId) return;
    onEditMessage?.(editingId, draft);
    cancelEdit();
  }

  function saveAndResend() {
    if (!editingId) return;
    onEditMessage?.(editingId, draft);
    onResendMessage?.(editingId);
    cancelEdit();
  }

  return (
    <>
      {/* Chat Content - Scrollable area with conditional scrollbar and bottom padding for input */}
      <div
        ref={scrollContainerRef}
        className={`h-full overflow-y-auto pb-32 md:pb-24 chat-scrollbar ${
          !needsScroll ? "no-scroll" : ""
        }`}
      >
        {/* Welcome Section - Only show when there's just the welcome message */}
        {messages.length <= 1 && (
          <div className="min-h-full flex items-center justify-center p-4 md:p-6">
            <div className="text-center max-w-2xl w-full">
              <div className="mb-6">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-dermx-teal to-dermx-purple rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8 text-white"
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
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  DermX-AI Assistant
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-base md:text-lg">
                  Get expert dermatology advice powered by AI
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-dermx-soft-purple text-dermx-purple px-2 py-1 md:px-3 text-xs md:text-sm font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Suggested Questions */}
              <div>
                <h3 className="text-base md:text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-3 md:mb-4">
                  Try asking about:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {[
                    "What causes eczema flare-ups?",
                    "How do I know if I have psoriasis?",
                    "Best treatments for hormonal acne?",
                    "Signs of skin cancer to watch for?",
                    "How to treat dry, itchy skin?",
                    "When should I see a dermatologist?",
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => onSend?.(question)}
                      className="text-left p-3 md:p-4 rounded-xl border border-zinc-200 hover:border-dermx-teal hover:bg-dermx-soft-purple/50 transition-colors dark:border-zinc-700 dark:hover:border-dermx-teal"
                    >
                      <span className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
                        {question}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages - Only show when there are actual conversations */}
        {messages.length > 1 && (
          <div className="px-3 max-w-6xl mx-auto md:px-4 py-4 md:py-6 space-y-6 md:space-y-6">
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-6">
              {messages.slice(1).map((m) => (
                <div key={m.id} className="space-y-2">
                  {editingId === m.id ? (
                    <div
                      className={cls(
                        "rounded-2xl border p-3 md:p-4 bg-white dark:bg-zinc-900",
                        "border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="w-full resize-y rounded-xl bg-transparent p-2 text-sm outline-none border border-zinc-200 dark:border-zinc-700"
                        rows={3}
                      />
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <button
                          onClick={saveEdit}
                          className="inline-flex items-center gap-1 rounded-full bg-dermx-teal px-3 py-1.5 text-xs text-white hover:bg-dermx-teal/90"
                        >
                          <Check className="h-3.5 w-3.5" /> Save
                        </button>
                        <button
                          onClick={saveAndResend}
                          className="inline-flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Save & Resend
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                        >
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <Message
                        role={m.role}
                        files={m.files}
                        confidence={m.confidence}
                        sources={m.sources}
                        relatedQuestions={m.relatedQuestions}
                        error={m.error}
                        onRelatedQuestionClick={(question) => {
                          if (onSend) {
                            onSend(question, []);
                          }
                        }}
                      >
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </Message>
                      {m.role === "user" && (
                        <div className="flex justify-end max-w-4xl mx-auto">
                          <div className="flex gap-3 text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 mr-10 md:mr-12">
                            <button
                              className="inline-flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                              onClick={() => startEdit(m)}
                            >
                              <Pencil className="h-3 w-3" /> Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                              onClick={() => onResendMessage?.(m.id)}
                            >
                              <RefreshCw className="h-3 w-3" /> Resend
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Input Bar at Bottom of Viewport - Respects sidebar on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:left-16 pb-16 md:pb-0 z-40 rounded-3xl">
        <Composer
          ref={composerRef}
          onSend={async (text, files) => {
            if (!text.trim() && (!files || files.length === 0)) return;
            setBusy(true);
            await onSend?.(text, files);
            setBusy(false);
          }}
          busy={busy}
        />
      </div>
    </>
  );
});

export default ChatPane;

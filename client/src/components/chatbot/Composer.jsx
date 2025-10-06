import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Send, Loader2, Mic } from "lucide-react";
import { cls } from "./utils";
import FileUpload from "./FileUpload";

const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current;
      const lineHeight = 20;
      const minHeight = 40;

      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const calculatedLines = Math.max(
        1,
        Math.floor((scrollHeight - 16) / lineHeight)
      );
      setLineCount(calculatedLines);

      if (calculatedLines <= 12) {
        textarea.style.height = `${Math.max(minHeight, scrollHeight)}px`;
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.height = `${minHeight + 11 * lineHeight}px`;
        textarea.style.overflowY = "auto";
      }
    }
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev
            ? `${prev}\n\n${templateContent}`
            : templateContent;
          setTimeout(() => {
            inputRef.current?.focus();
            const length = newValue.length;
            inputRef.current?.setSelectionRange(length, length);
          }, 0);
          return newValue;
        });
      },
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    []
  );

  async function handleSend() {
    if ((!value.trim() && selectedFiles.length === 0) || sending) return;
    setSending(true);
    try {
      await onSend?.(value, selectedFiles);
      setValue("");
      setSelectedFiles([]);
      inputRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type === "application/pdf") return "📄";
    if (type.includes("word")) return "📝";
    return "📎";
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl m-2">
        <div
          className={cls(
            "rounded-3xl border shadow-lg transition-all duration-200 mx-2",
            "border-zinc-200 dark:border-zinc-700 p-2.5 md:p-4",
            isFocused && "ring-2 ring-dermx-teal/20 border-dermx-teal"
          )}
        >
          {/* File Preview Section - Above Input */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-start gap-3">
                <div className="relative group">
                  {selectedFiles[0].preview ? (
                    <div className="relative">
                      <img
                        src={selectedFiles[0].preview}
                        alt={selectedFiles[0].name}
                        className="h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      />
                      <button
                        onClick={() => handleRemoveFile(selectedFiles[0].id)}
                        className="absolute -top-2 -right-2 rounded-full p-1.5 bg-zinc-900/80 text-white hover:bg-zinc-900 transition-colors shadow-lg"
                        title="Remove file"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center relative">
                      <span className="text-3xl">
                        {getFileIcon(selectedFiles[0].type)}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(selectedFiles[0].id)}
                        className="absolute -top-2 -right-2 rounded-full p-1.5 bg-zinc-900/80 text-white hover:bg-zinc-900 transition-colors shadow-lg"
                        title="Remove file"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {selectedFiles.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.slice(1).map((fileObj) => (
                      <div key={fileObj.id} className="relative group">
                        {fileObj.preview ? (
                          <div className="relative">
                            <img
                              src={fileObj.preview}
                              alt={fileObj.name}
                              className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                            />
                            <button
                              onClick={() => handleRemoveFile(fileObj.id)}
                              className="absolute -top-2 -right-2 rounded-full p-1 bg-zinc-900/80 text-white hover:bg-zinc-900 transition-colors shadow-lg"
                              title="Remove file"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center relative">
                            <span className="text-2xl">
                              {getFileIcon(fileObj.type)}
                            </span>
                            <button
                              onClick={() => handleRemoveFile(fileObj.id)}
                              className="absolute -top-2 -right-2 rounded-full p-1 bg-zinc-900/80 text-white hover:bg-zinc-900 transition-colors shadow-lg"
                              title="Remove file"
                            >
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-2">
            {/* File Upload Button */}
            <FileUpload
              className="self-center"
              onFilesSelected={handleFilesSelected}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
            />

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask me about any dermatology concerns..."
                rows={1}
                className={cls(
                  "w-full resize-none bg-transparent text-sm md:text-base outline-none placeholder:text-zinc-400 transition-all duration-200",
                  "px-0 py-1 min-h-[24px]"
                )}
                style={{
                  height: "auto",
                  overflowY: lineCount > 6 ? "auto" : "hidden",
                  maxHeight: "120px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                className="hidden md:inline-flex items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                onClick={handleSend}
                disabled={
                  sending ||
                  busy ||
                  (!value.trim() && selectedFiles.length === 0)
                }
                className={cls(
                  "inline-flex items-center justify-center rounded-full bg-dermx-teal p-2.5 md:p-2 text-white shadow-md transition hover:bg-dermx-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dermx-teal/50",
                  (sending ||
                    busy ||
                    (!value.trim() && selectedFiles.length === 0)) &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {sending || busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center py-1">
          DermX-AI can make mistakes. Check important info.
        </p>
      </div>
      {/* <div className="w-full h-1 bg-zinc-50 dark:bg-zinc-800 text-center py-2"></div> */}
    </div>
  );
});

export default Composer;

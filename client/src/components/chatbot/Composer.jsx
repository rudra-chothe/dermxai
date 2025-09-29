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

  return (
    <div className="p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((fileObj) => {
              const getFileIcon = (type) => {
                if (type.startsWith("image/")) return "🖼️";
                if (type === "application/pdf") return "📄";
                if (type.includes("word")) return "📝";
                return "📎";
              };

              const formatFileSize = (bytes) => {
                if (bytes === 0) return "0 Bytes";
                const k = 1024;
                const sizes = ["Bytes", "KB", "MB", "GB"];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                return (
                  parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
                  " " +
                  sizes[i]
                );
              };

              return (
                <div
                  key={fileObj.id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <span className="text-lg">{getFileIcon(fileObj.type)}</span>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatFileSize(fileObj.size)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveFile(fileObj.id)}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div
          className={cls(
            "flex items-end gap-2 md:gap-3 rounded-2xl border bg-white shadow-sm dark:bg-zinc-950 transition-all duration-200",
            "border-zinc-300 dark:border-zinc-700 p-3 md:p-4",
            isFocused && "ring-2 ring-dermx-teal/20 border-dermx-teal"
          )}
        >
          {/* File Upload Button */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
          />

          {/* Text Input */}
          <div className="flex-1 min-w-0 p">
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask me about any dermatology concerns..."
              rows={1}
              className={cls(
                "w-full resize-none bg-transparent text-sm outline-none placeholder:text-zinc-400 transition-all duration-200",
                "px-0 py-0 min-h-[24px]"
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
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button
              className="hidden md:inline-flex items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
              title="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              onClick={handleSend}
              disabled={
                sending || busy || (!value.trim() && selectedFiles.length === 0)
              }
              className={cls(
                "inline-flex items-center justify-center rounded-full bg-dermx-teal p-2 text-white shadow-sm transition hover:bg-dermx-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dermx-teal/50",
                (sending ||
                  busy ||
                  (!value.trim() && selectedFiles.length === 0)) &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {sending || busy ? (
                <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
              )}
            </button>
          </div>
        </div>

        {/* <div className="mt-2 text-center text-[10px] md:text-[11px] text-zinc-500 dark:text-zinc-400 hidden md:block">
          Press{" "}
          <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[9px] md:text-[10px] dark:border-zinc-600 dark:bg-zinc-800">
            Enter
          </kbd>{" "}
          to send ·{" "}
          <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-[9px] md:text-[10px] dark:border-zinc-600 dark:bg-zinc-800">
            Shift + Enter
          </kbd>{" "}
          for new line
        </div> */}
      </div>
    </div>
  );
});

export default Composer;

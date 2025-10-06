import { cls } from "./utils";
import { FileText, Image, Download } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Message({
  role,
  children,
  files = [],
  confidence,
  sources,
  relatedQuestions,
  error,
  onRelatedQuestionClick,
}) {
  const isUser = role === "user";

  // Extract text content from children
  let textContent = "";
  if (children?.props?.children && typeof children.props.children === "string") {
    textContent = children.props.children;
  } else if (typeof children === "string") {
    textContent = children;
  }

  const isMarkdown = !isUser && textContent && typeof textContent === "string";

  // Debug log
  if (!isUser && typeof textContent === "string" && textContent.length > 0) {
    console.log("🔍 Message Debug:", {
      isMarkdown,
      textContentLength: textContent.length,
      textContentPreview: textContent.substring(0, 100),
    });
  }

  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) return Image;
    return FileText;
  };

  const formatFileSize = (bytes = 0) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div
      className={cls(
        "flex gap-10 md:gap-4 max-w-4xl mx-auto",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-dermx-teal to-dermx-purple flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 md:h-4 md:w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cls(
          "rounded-2xl px-3 py-2 md:px-5 md:py-4 text-base max-w-[85%] md:max-w-[80%] shadow-sm",
          isUser
            ? "bg-dermx-teal text-white rounded-br-md"
            : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-md dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
        )}
      >
        {/* Files Section */}
        {files?.length > 0 && (
          <div className="mb-3 space-y-2">
            {files.map((fileObj) => {
              const IconComponent = getFileIcon(fileObj.type);
              return (
                <div
                  key={fileObj.id}
                  className={cls(
                    "flex items-center gap-3 rounded-lg p-2 border",
                    isUser
                      ? "bg-white/10 border-white/20"
                      : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="h-10 w-10 rounded object-cover cursor-pointer"
                      onClick={() => window.open(fileObj.preview, "_blank")}
                    />
                  ) : (
                    <IconComponent
                      className={cls(
                        "h-5 w-5",
                        isUser
                          ? "text-white/80"
                          : "text-zinc-500 dark:text-zinc-400"
                      )}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className={cls(
                        "truncate text-sm font-medium",
                        isUser
                          ? "text-white"
                          : "text-zinc-900 dark:text-zinc-100"
                      )}
                    >
                      {fileObj.name}
                    </p>
                    <p
                      className={cls(
                        "text-xs",
                        isUser
                          ? "text-white/70"
                          : "text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      {formatFileSize(fileObj.size)}
                    </p>
                  </div>

                  {/* Download Button */}
                  {fileObj.preview && (
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = fileObj.preview;
                        link.download = fileObj.name;
                        link.click();
                      }}
                      className={cls(
                        "rounded-full p-1 transition-colors",
                        isUser
                          ? "text-white/70 hover:text-white hover:bg-white/10"
                          : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                      )}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Message Content */}
        {isMarkdown ? (
          <MarkdownRenderer content={textContent} />
        ) : (
          children
        )}

        {/* Error message */}
        {!isUser && error && (
          <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mb-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Response may be limited due to technical issues
            </div>
          </div>
        )}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-zinc-400 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 md:h-4 md:w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

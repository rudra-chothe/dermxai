import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Enhanced Markdown renderer for DermX-AI
 * Improves readability for long-form medical answers:
 * - Better spacing
 * - Section separation
 * - Highlighted blockquotes
 * - Styled lists & tables
 */
export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-content text-base leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headers
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 first:mt-0"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-semibold text-dermx-purple mt-8 mb-4 border-b pb-1 border-gray-200 dark:border-gray-700 first:mt-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-semibold text-dermx-teal mt-6 mb-3 first:mt-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-base font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-2 first:mt-0"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-7 text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),

          // Emphasis
          strong: ({ node, ...props }) => (
            <strong
              className="font-bold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          em: ({ node, ...props }) => (
            <em
              className="italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),

          // Code
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-dermx-teal border border-gray-200 dark:border-gray-700"
                {...props}
              />
            ) : (
              <code
                className="block text-sm font-mono text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 my-3 overflow-x-auto border border-gray-200 dark:border-gray-700"
                {...props}
              />
            ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-dermx-teal hover:text-dermx-purple underline font-medium transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // Blockquotes (for remedies/tips)
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-dermx-teal bg-dermx-soft-purple/40 px-4 py-3 my-4 rounded-md text-gray-800 dark:text-gray-200"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-t border-gray-300 dark:border-gray-700"
              {...props}
            />
          ),

          // Tables (with GFM support)
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          tbody: ({ node, ...props }) => (
            <tbody
              className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => <tr {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider border border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

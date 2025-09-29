import {
  PanelLeftClose,
  PanelLeftOpen,
  SearchIcon,
  Plus,
  Star,
  Clock,
  FolderIcon,
  FileText,
  Settings,
} from "lucide-react";
import SidebarSection from "./SidebarSection";
import ConversationRow from "./ConversationRow";
import { cls } from "./utils";
import { useState } from "react";

export default function ChatbotSidebar({
  open,
  onClose,
  collapsed,
  setCollapsed,
  conversations,
  pinned,
  recent,
  folders,
  folderCounts,
  selectedId,
  onSelect,
  togglePin,
  query,
  setQuery,
  searchRef,
  createFolder,
  createNewChat,
  templates = [],
  setTemplates = () => {},
  onUseTemplate = () => {},
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
}) {
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);

  const getConversationsByFolder = (folderName) => {
    return conversations.filter((conv) => conv.folder === folderName);
  };

  if (sidebarCollapsed) {
    return (
      <aside className="z-50 flex h-full w-16 shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-center border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={createNewChat}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </button>
          
          <button
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            title="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          
          <button
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            title="Folders"
          >
            <FolderIcon className="h-5 w-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity duration-200"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cls(
          "z-50 flex h-full w-80 shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-transform duration-200",
          "fixed inset-y-0 left-0 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      <div className="flex items-center gap-2 border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-dermx-teal to-dermx-purple text-white shadow-sm">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div className="text-sm font-semibold tracking-tight">DermX-AI Assistant</div>
        </div>
        
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="hidden md:block rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
          
          <button
            onClick={onClose}
            className="md:hidden rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label="Close sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-3 pt-3">
        <label htmlFor="search" className="sr-only">
          Search conversations
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            id="search"
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-dermx-teal focus:ring-2 focus:ring-dermx-teal/20 dark:border-zinc-800 dark:bg-zinc-950/50"
          />
        </div>
      </div>

      <div className="px-3 pt-3">
        <button
          onClick={createNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-dermx-teal px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-dermx-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="New Chat"
        >
          <Plus className="h-4 w-4" /> Start New Chat
        </button>
      </div>

      <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
        <SidebarSection
          icon={<Star className="h-4 w-4" />}
          title="PINNED CHATS"
          collapsed={collapsed.pinned}
          onToggle={() => setCollapsed((s) => ({ ...s, pinned: !s.pinned }))}
        >
          {pinned.length === 0 ? (
            <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Pin important conversations for quick access.
            </div>
          ) : (
            pinned.map((c) => (
              <ConversationRow
                key={c.id}
                data={c}
                active={c.id === selectedId}
                onSelect={() => onSelect(c.id)}
                onTogglePin={() => togglePin(c.id)}
              />
            ))
          )}
        </SidebarSection>

        <SidebarSection
          icon={<Clock className="h-4 w-4" />}
          title="RECENT"
          collapsed={collapsed.recent}
          onToggle={() => setCollapsed((s) => ({ ...s, recent: !s.recent }))}
        >
          {recent.length === 0 ? (
            <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              No conversations yet. Start a new one!
            </div>
          ) : (
            recent.map((c) => (
              <ConversationRow
                key={c.id}
                data={c}
                active={c.id === selectedId}
                onSelect={() => onSelect(c.id)}
                onTogglePin={() => togglePin(c.id)}
                showMeta
              />
            ))
          )}
        </SidebarSection>

        <SidebarSection
          icon={<FolderIcon className="h-4 w-4" />}
          title="FOLDERS"
          collapsed={collapsed.folders}
          onToggle={() => setCollapsed((s) => ({ ...s, folders: !s.folders }))}
        >
          <div className="-mx-1">
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" /> Create folder
            </button>
            {folders.map((f) => (
              <div key={f.id} className="rounded-lg px-2 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <FolderIcon className="h-4 w-4 text-zinc-400" />
                  <span className="flex-1">{f.name}</span>
                  <span className="text-xs text-zinc-400">{folderCounts[f.name] || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection
          icon={<FileText className="h-4 w-4" />}
          title="TEMPLATES"
          collapsed={collapsed.templates}
          onToggle={() => setCollapsed((s) => ({ ...s, templates: !s.templates }))}
        >
          <div className="-mx-1">
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" /> Create template
            </button>
            {(Array.isArray(templates) ? templates : []).map((template) => (
              <div key={template.id} className="rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <button
                  onClick={() => onUseTemplate(template)}
                  className="w-full text-left"
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{template.snippet}</div>
                </button>
              </div>
            ))}
            {(!templates || templates.length === 0) && (
              <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                No templates yet. Create your first prompt template.
              </div>
            )}
          </div>
        </SidebarSection>
      </nav>

      <div className="mt-auto border-t border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2 rounded-xl bg-dermx-soft-purple p-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-dermx-teal text-xs font-bold text-white">
            U
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">DermX User</div>
            <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">Premium Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
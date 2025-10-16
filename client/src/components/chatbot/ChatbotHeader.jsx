import { MoreHorizontal, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ChatbotHeader({ createNewChat, sidebarCollapsed, setSidebarOpen }) {
  const [selectedBot, setSelectedBot] = useState("DermX-AI");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chatbots = [
    { name: "DermX-AI", icon: "🩺" },
    { name: "General AI", icon: "🤖" },
    { name: "Specialist", icon: "👨‍⚕️" },
  ];

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur">
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="hidden md:flex relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="text-sm">
            {chatbots.find((bot) => bot.name === selectedBot)?.icon}
          </span>
          {selectedBot}
          <ChevronDown className="h-4 w-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg z-50">
            {chatbots.map((bot) => (
              <button
                key={bot.name}
                onClick={() => {
                  setSelectedBot(bot.name);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-zinc-100 first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-sm">{bot.icon}</span>
                {bot.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
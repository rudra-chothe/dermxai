import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "./ui/navbar";
import { Footer } from "./ui/footer";
import MuiStyleSidebar from "./MuiStyleSidebar";
import MuiStyleToggle from "./MuiStyleToggle";
import MobileNavigation from "./MobileNavigation";

const MuiStyleLayout = ({ children }) => {
  const { currentUser } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const sidebarRef = useRef(null);

  // Handle outside click to collapse sidebar when expanded
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle outside clicks when sidebar is expanded (not collapsed)
      if (
        !isSidebarCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        // Don't collapse if clicking on account menu or other dropdowns
        if (
          !event.target.closest(".account-container") &&
          !event.target.closest("[data-sidebar-ignore]")
        ) {
          setIsSidebarCollapsed(true);
        }
      }
    };

    // Only add event listener when sidebar is expanded
    if (!isSidebarCollapsed) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSidebarCollapsed]);

  // If user is not authenticated, show navbar and footer
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </div>
    );
  }

  // If user is authenticated, show MUI-style sidebar layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* MUI-Style Sidebar - Hidden on mobile */}
      <div className="hidden md:block" ref={sidebarRef}>
        <MuiStyleSidebar
          isOpen={!isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isCollapsed={isSidebarCollapsed}
          // Pass a prop to indicate we want circular highlight for collapsed state
          circularHighlight={true}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top App Bar */}
        <header className="bg-transparent border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center space-x-4">
              <img
                src="/image.png"
                alt="DermX AI"
                className="w-8 h-8 mr-2 flex-shrink-0"
              />
              <h1 className="text-xl font-semibold text-gray-900">DermX-AI</h1>
            </div>

            {/* User info in header */}
            <div className="flex items-center space-x-2">
              <div className="text-sm mr-20 border-b-2 border-gray-200 text-center text-gray-900 hover:scale-105 transition-all duration-300">
                Welcome, {currentUser?.displayName || "User"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Navigation - Only visible on mobile */}
      <MobileNavigation />
    </div>
  );
};

export default MuiStyleLayout;

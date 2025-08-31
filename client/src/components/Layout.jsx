import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import BurgerMenu from "./BurgerMenu";

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If user is not authenticated, show navbar and footer
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-14 sm:pt-16">{children}</main>
        <Footer />
      </div>
    );
  }

  // If user is authenticated, show sidebar layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Logo outside sidebar */}
      <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-50 lg:left-4">
        <div className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg shadow-md px-2 sm:px-3 py-1 sm:py-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-dermx-teal to-dermx-purple rounded-md flex items-center justify-center">
            <LayoutDashboard className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-sm sm:text-lg font-bold text-gray-900">DermX-AI</span>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with toggle button - Hidden on mobile since sidebar is hidden */}
        <div className="hidden md:flex bg-white border-b px-3 sm:px-4 py-2 sm:py-3 items-center justify-between">
          <BurgerMenu 
            isOpen={isSidebarOpen} 
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="flex-1" />
        </div>
        
        <main className="flex-1 overflow-y-auto pt-12 sm:pt-16 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Only visible on mobile */}
      <MobileNavigation />
    </div>
  );
};

export default Layout;

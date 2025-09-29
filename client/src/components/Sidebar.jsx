import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  Upload,
  BookOpen,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import BurgerMenu from "./BurgerMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = ({ isOpen = true, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State for user account menu
  const [accountMenuAnchor, setAccountMenuAnchor] = React.useState(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);

  const primaryActions = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/dashboard",
      description: "Overview and analytics",
    },
    {
      name: "New Analysis",
      icon: <Upload className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/diagnose",
      description: "Start new skin analysis",
    },
    {
      name: "Search Reports",
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/reports",
      description: "Search your reports",
    },
  ];

  const appsSection = [
    {
      name: "Q&A Assistant",
      icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/qa",
      description: "Ask medical questions",
    },
    {
      name: "Documents",
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/documents",
      description: "Document analysis",
    },
    {
      name: "Clinical Insights",
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      path: "/insights",
      description: "Medical insights",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/");
      // Close account menu
      setAccountMenuAnchor(null);
      setIsAccountMenuOpen(false);
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
    setIsAccountMenuOpen(true);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
    setIsAccountMenuOpen(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isAccountMenuOpen &&
        !event.target.closest(".account-menu-container")
      ) {
        handleAccountMenuClose();
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isAccountMenuOpen]);

  const handleProfileClick = () => {
    navigate("/profile");
    handleAccountMenuClose();
  };

  const handleSettingsClick = () => {
    navigate("/profile/edit");
    handleAccountMenuClose();
  };

  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  if (!currentUser) {
    return null; // Don't show sidebar for non-authenticated users
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    return (
      currentUser.displayName || currentUser.email?.split("@")[0] || "User"
    );
  };

  return (
    <TooltipProvider>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={` 
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-12 sm:w-16" : "w-56 sm:w-64"} 
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:block
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="w-full flex items-center justify-center">
            <BurgerMenu isOpen={!isCollapsed} onToggle={toggleSidebar} />
          </div>
        </div>

        {/* Primary Actions */}
        <div className="p-2">
          <div className="space-y-1">
            {primaryActions.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-dermx-teal text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  title={isCollapsed ? item.description : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-2 sm:ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Apps Section */}
        <div className="px-2 sm:px-3 py-2">
          <div className="space-y-1">
            {appsSection.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-dermx-teal text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                  title={isCollapsed ? item.description : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-2 sm:ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Account Section */}
        <div className="mt-auto p-3 sm:p-4 border-t">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Avatar with Menu */}
            <div className="relative account-menu-container">
              <button
                onClick={handleAccountMenuOpen}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-dermx-teal focus:ring-offset-2"
                aria-label="User account menu"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="true"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAccountMenuOpen(e);
                  }
                }}
              >
                <div className="w-8 h-8 bg-dermx-teal rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer transition-transform hover:scale-105">
                  {getUserInitials()}
                </div>
                {!isCollapsed && (
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      isAccountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Account Menu */}
              {isAccountMenuOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  style={{ minWidth: "200px" }}
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {getUserDisplayName()}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {currentUser.email}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentUser.emailVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      {currentUser.photoURL && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Photo
                        </span>
                      )}
                      {currentUser.displayName && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Custom Name
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>

                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-gray-500 font-medium">
                        Quick Actions
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/diagnose");
                        handleAccountMenuClose();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-3" />
                      New Analysis
                    </button>
                    <button
                      onClick={() => {
                        navigate("/reports");
                        handleAccountMenuClose();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 mr-3" />
                      View Reports
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Info (visible when not collapsed) */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {getUserDisplayName()}
                  </p>
                  {currentUser.emailVerified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {currentUser.emailVerified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                  {currentUser.photoURL && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Photo
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout Button */}
        <div className="p-3 sm:p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            {!isCollapsed && <span className="ml-2 sm:ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;

import React from "react";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  MessageSquare,
  FileText,
  BookOpen,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// Logout Confirmation Dialog Component
const LogoutConfirmationDialog = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          You will be redirected to the login page and will need to sign in
          again to access your account.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Account Preview Component (similar to Toolpad's AccountPreview)
const AccountPreview = ({ variant, handleClick, open, mini }) => {
  const { currentUser } = useAuth();

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    return (
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"
    );
  };

  if (variant === "condensed" || mini) {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          className="w-10 h-8 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-sm font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:scale-105 cursor-pointer"
          aria-label="User account menu"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {getUserInitials()}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      aria-label="User account menu"
      aria-expanded={open}
      aria-haspopup="true"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
        <div className="ml-3 min-w-0 flex-1 text-left">
          <p className="text-sm font-medium text-gray-900 truncate">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
        </div>
      </div>
      <ChevronDown
        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

// Account Popover Content Component
const AccountPopoverContent = ({ onProfileClick, onLogout }) => {
  const { currentUser } = useAuth();

  const getUserInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    return (
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"
    );
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200">
      {/* User Info Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {getUserDisplayName()}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* User Status Badges */}
        <div className="flex flex-wrap gap-1 mt-3">
          {currentUser?.emailVerified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          )}
          {currentUser?.photoURL && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Photo
            </span>
          )}
          {currentUser?.displayName && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Custom Name
            </span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={onProfileClick}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <User className="w-4 h-4 mr-3" />
          Profile
        </button>
      </div>

      {/* Sign Out */}
      <div className="border-t border-gray-200 py-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Main Account Component (similar to Toolpad's Account)
const AccountComponent = ({ mini = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsOpen(false); // Close the account menu
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/");
      setShowLogoutConfirm(false);
    } catch (error) {
      toast.error("Failed to log out");
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".account-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative account-container">
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={isOpen}
        mini={mini}
      />

      {isOpen && (
        <div
          className={`fixed ${mini ? "left-20 bottom-4" : "left-4 bottom-20"}`}
          style={{ zIndex: 9999 }}
        >
          <AccountPopoverContent
            onProfileClick={handleProfileClick}
            onLogout={handleLogoutClick}
          />
        </div>
      )}

      {/* Tooltip for mini version */}
      {mini && !isOpen && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
          style={{ zIndex: 9998 }}
        >
          Account menu
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

const MuiStyleSidebar = ({
  isOpen,
  onToggle,
  isCollapsed = false,
  circularHighlight = false,
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      description: "Overview and analytics",
    },
    {
      name: "New Analysis",
      icon: <Upload size={20} />,
      path: "/diagnose",
      description: "Start new skin analysis",
    },
    {
      name: "Search Reports",
      icon: <BarChart3 size={20} />,
      path: "/reports",
      description: "Search your reports",
    },
    {
      name: "Q&A Assistant",
      icon: <MessageSquare size={20} />,
      path: "/qa",
      description: "Ask medical questions",
    },
    {
      name: "Documents",
      icon: <FileText size={20} />,
      path: "/documents",
      description: "Document analysis",
    },
    {
      name: "Clinical Insights",
      icon: <BookOpen size={20} />,
      path: "/insights",
      description: "Medical insights",
    },
  ];

  // Sidebar width classes and minWidth for collapsed/expanded
  const drawerWidth = isCollapsed ? "w-16" : "w-64";
  const minWidth = isCollapsed ? "4rem" : "16rem";

  return (
    <div
      className={`${drawerWidth} h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative`}
      style={{ minWidth }}
    >
      {/* Header */}
      <div className="h-14 flex items-center border-b border-gray-200 px-4">
        <button
          onClick={onToggle}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        <div
          className={`ml-4 text-lg font-medium text-gray-700 truncate select-none flex items-center transition-all duration-300 ease-in-out ${
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          }`}
        >
          {/* <img
            src="/image.png"
            alt="DermX AI"
            className="w-8 h-8 mr-2 flex-shrink-0"
          /> */}
          {/* <span>DermX-AI</span> */}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="relative">
                <div className="group">
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center transition-all duration-300 ease-in-out text-sm font-medium
                          ${
                            isCollapsed
                              ? "justify-center w-10 h-10 mx-auto"
                              : "w-full h-10 px-3"
                          }
                          ${
                            isActive
                              ? isCollapsed && circularHighlight
                                ? "bg-blue-600 text-white shadow-sm rounded-full"
                                : "bg-blue-600 text-white shadow-sm rounded-lg"
                              : isCollapsed
                              ? "text-gray-700 hover:bg-gray-100 rounded-full"
                              : "text-gray-700 hover:bg-gray-100 rounded-lg"
                          }
                        `}
                  >
                    <span
                      className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
                        isCollapsed ? "" : "mr-3"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`truncate transition-all duration-300 ease-in-out ${
                        isCollapsed
                          ? "opacity-0 w-0 overflow-hidden"
                          : "opacity-100 w-auto"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                      style={{ zIndex: 9997 }}
                    >
                      {item.name}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Account Section - Toolpad Style */}
      <div className="border-t border-gray-200 px-4 py-4 group">
        <AccountComponent mini={isCollapsed} />
      </div>
    </div>
  );
};

export default MuiStyleSidebar;

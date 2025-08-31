import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  MessageSquare,
  User,
} from "lucide-react";

const MobileNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Safety check for location
  if (!location) {
    return null;
  }

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
      path: "/dashboard",
    },
    {
      name: "Diagnose",
      icon: <Upload className="w-6 h-6" />,
      path: "/diagnose",
    },
    {
      name: "Reports",
      icon: <BarChart3 className="w-6 h-6" />,
      path: "/reports",
    },
    {
      name: "Q&A",
      icon: <MessageSquare className="w-6 h-6" />,
      path: "/qa",
    },
    {
      name: "Profile",
      icon: <User className="w-6 h-6" />,
      path: "/profile",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-[9999]">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? "text-white" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Home indicator line */}
      <div className="w-32 h-1 bg-gray-600 rounded-full mx-auto mb-1"></div>
    </div>
  );
};

export default MobileNavigation;

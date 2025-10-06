"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { ChevronDown, User, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", public: true },
  { name: "Features", path: "/features", public: true },
  // { name: "Mission", path: "/mission", public: true },
  // { name: "How It Works", path: "/how-it-works", public: true },
  { name: "Diagnose", path: "/diagnose", protected: true },
  { name: "Reports", path: "/reports", protected: true },
  { name: "Clinical Insights", path: "/clinical-insights", requireAuth: true },
  { name: "Document Insights", path: "/document-insights", protected: true },
  { name: "Q&A Assistant", path: "/qa-assistant", requireAuth: true },
  { name: "About", path: "/about", public: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/");
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsUserMenuOpen(false);
  };

  // Filter nav items based on authentication and requirements
  const visibleNavItems = navItems.filter((item) => {
    // If user is logged in, only show protected routes (hide public routes)
    if (currentUser) {
      return item.protected || item.requireAuth;
    }
    // If user is not logged in, only show public routes
    return item.public;
  });

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[99999] transition-all duration-700 ease-out",
        isScrolled ? "iphone-glass-nav navbar-fluid-effects" : ""
      )}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        // Always transparent, even when scrolled
        background: "transparent",
        border: "none",
        borderBottom: "none",
        boxShadow: "none",
        // If scrolled, apply the background and effects as before, but using a pseudo-element
      }}
    >
      {/* Overlay for background, border, and shadow when scrolled */}
      {isScrolled && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `rgba(255,255,255,0.95)`,
            border: `1px solid rgba(255,255,255,0.6)`,
            borderBottom: `1px solid rgba(0,0,0,0.08)`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.1)`,
            pointerEvents: "none",
            borderRadius: 0,
          }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={currentUser ? "/dashboard" : "/"}
              className="flex items-center gap-1 sm:gap-2"
            >
              <div
                className="text-xl sm:text-2xl font-bold text-teal-600 hover:scale-110 transition-all duration-300 cursor-pointer hover:text-teal-500 magnetic-hover flex items-center gap-1 sm:gap-2 rounded-full"
                style={{
                  textShadow: isScrolled ? `0 2px 4px rgba(0,0,0,0.1)` : "none",
                }}
              >
                <img
                  src="/image.png"
                  alt="DermX-AI"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <span className="font-bold bg-gradient-to-r from-dermx-teal to-dermx-lavender bg-clip-text text-transparent text-xl sm:text-2xl lg:text-3xl">
                  DermX AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-bold text-sm lg:text-base">
            {visibleNavItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-teal-600 transition-all duration-0 relative group hover:scale-105 font-bold text-sm lg:text-base"
                style={{
                  textShadow: isScrolled ? `0 1px 2px rgba(0,0,0,0.1)` : "none",
                }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:animate-pulse"></span>
              </Link>
            ))}
          </div>

          {/* Desktop Authentication Section */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {currentUser ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-dermx-soft-purple transition-colors navbar-glass-button"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-7 h-7 lg:w-8 lg:h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-medium">
                      {currentUser.displayName?.charAt(0) ||
                        currentUser.email?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                  <span className="text-xs lg:text-sm font-medium text-gray-700 hidden lg:block">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 lg:h-4 lg:w-4 text-gray-500 transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 lg:w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-dermx-soft-purple transition-colors"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-dermx-soft-purple transition-colors disabled:opacity-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      {isLoggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 lg:px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300 bg-transparent hover:shadow-lg font-medium text-sm lg:text-base"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 lg:px-6 py-2 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-500/25 font-medium text-sm lg:text-base">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-teal-600 transition-all duration-300 hover:scale-110"
              style={{
                background: "transparent",
                border: "none",
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden rounded-lg mt-2 p-4 shadow-lg animate-fade-in-up bg-white border border-gray-200">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-teal-600 transition-colors text-left font-medium text-sm sm:text-base py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Authentication Section */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {currentUser.displayName?.charAt(0) ||
                            currentUser.email?.charAt(0) ||
                            "U"}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {currentUser.displayName || currentUser.email}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="block w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full text-sm">
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-sm"
                    >
                      {isLoggingOut ? "Signing out..." : "Sign Out"}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button
                        variant="outline"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-medium bg-transparent w-full text-sm"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium w-full text-sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

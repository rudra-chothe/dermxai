
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Diagnose", path: "/diagnose" },
  { name: "Reports", path: "/reports" },
  { name: "Clinical Insights", path: "/clinical-insights" },
  { name: "Document Insights", path: "/document-insights" },
  { name: "Q&A Assistant", path: "/qa-assistant" },
  { name: "About", path: "/about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3",
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-dermx-teal to-dermx-lavender w-8 h-8 rounded-md"></div>
          <span className="text-xl font-semibold bg-gradient-to-r from-dermx-teal to-dermx-lavender bg-clip-text text-transparent">
            DermX-AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-dermx-soft-purple transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/login">
            <Button variant="outline" className="text-dermx-purple border-dermx-purple hover:bg-dermx-purple-light">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-dermx-teal hover:bg-dermx-teal/90">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block py-3 px-4 text-sm font-medium text-gray-700 hover:bg-dermx-soft-purple rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex space-x-2 mt-4 mb-2 px-4">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button className="w-full bg-dermx-teal hover:bg-dermx-teal/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

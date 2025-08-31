import React from "react";
import { Menu, X } from "lucide-react";

const MuiStyleToggle = ({ isOpen, onToggle, size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12",
  };

  return (
    <button
      onClick={onToggle}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-gray-900`}
      title={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
};

export default MuiStyleToggle;

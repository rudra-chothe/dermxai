import React from "react";

const BurgerMenu = ({ isOpen, onToggle }) => {
  return (
    <div className="flex items-center justify-center">
      <label className="relative w-10 h-8 bg-transparent cursor-pointer block">
        <input
          type="checkbox"
          className="hidden"
          checked={isOpen}
          onChange={onToggle}
        />
        <span
          className={`block absolute h-1 w-full bg-gray-700 rounded-lg opacity-100 left-0 transition-all duration-250 ease-in-out ${
            isOpen ? "rotate-45 top-0 left-1" : "rotate-0 top-0"
          }`}
          style={{ transformOrigin: "left center" }}
        />
        <span
          className={`block absolute h-1 w-full bg-gray-700 rounded-lg opacity-100 left-0 transition-all duration-250 ease-in-out ${
            isOpen ? "w-0 opacity-0" : "w-full opacity-100"
          }`}
          style={{
            top: "50%",
            transform: isOpen ? "translateY(-50%)" : "translateY(-50%)",
            transformOrigin: "left center",
          }}
        />
        <span
          className={`block absolute h-1 w-full bg-gray-700 rounded-lg opacity-100 left-0 transition-all duration-250 ease-in-out ${
            isOpen ? "-rotate-45 top-7 left-1" : "rotate-0 top-7"
          }`}
          style={{ transformOrigin: "left center" }}
        />
      </label>
    </div>
  );
};

export default BurgerMenu;

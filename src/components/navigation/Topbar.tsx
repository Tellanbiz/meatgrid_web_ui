import React from "react";
import { FiBell, FiMessageSquare, FiSearch } from "react-icons/fi";

const Topbar: React.FC = () => {
  return (
    <header className="bg-primary-800 text-white shadow-md fixed top-0 left-0 right-0 h-16 flex items-center px-6 z-50">
      <div className="w-64 flex items-center">
        <img src="/images/tellan-logo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      <div className="flex-1 flex items-center justify-between">
        <FiSearch className="text-xl cursor-pointer" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-2 pr-4 py-2 rounded bg-transparent text-white placeholder-gray-400 outline-none focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-6">
        <FiMessageSquare className="text-xl cursor-pointer hover:text-gray-300 mx-2" />

        <FiBell className="text-xl cursor-pointer hover:text-gray-300 mx-2" />
        {/* User Dropdown */}
        <div className="relative">
          <div className="flex items-center space-x-2 px-4 py-2 rounded text-white cursor-pointer">
            <span className="mx-2">Samwel Njuguna</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded shadow-lg hidden group-hover:block">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Settings
            </a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
              Logout
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

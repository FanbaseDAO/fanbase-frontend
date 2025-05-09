// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

const DropdownItem = ({ label, to, onClick }) => {
  return (
    <Link 
      to={to || "#"} 
      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

const Header = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock logout function - would be replaced with actual Firebase auth logout
  const handleLogout = () => {
    console.log('Logging out');
    // auth.signOut() would go here with Firebase
  };
  
  return (
    <header className="p-4 flex items-center justify-between border-b border-gray-800">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search for anything on Fanbase" 
          className="bg-gray-800 w-full pl-10 pr-4 py-2 rounded-md text-gray-200"
        />
      </div>
      
      {/* Profile Section */}
      <div className="relative ml-4" ref={dropdownRef}>
        <button 
          className="flex items-center"
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
        >
          <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">R</span>
          </div>
        </button>
        
        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">R</span>
                </div>
                <div>
                  <h3 className="font-medium">Retro</h3>
                  <p className="text-xs text-gray-400">0x5cc...7ae3</p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-300">Base</p>
                <div className="flex items-center justify-between mt-1">
                  <span>0 ETH</span>
                  <ChevronDown size={16} />
                </div>
              </div>
              <button className="mt-3 w-full bg-white text-black rounded-full py-1 text-sm font-medium">
                Send
              </button>
            </div>
            <div className="py-1">
              <DropdownItem label="My Earnings" to="/earnings" />
              <DropdownItem label="Settings" to="/settings" />
              <DropdownItem label="For Artists" to="/for-artists" />
              <DropdownItem label="Logout" onClick={handleLogout} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
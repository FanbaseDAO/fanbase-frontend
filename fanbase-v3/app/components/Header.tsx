"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import {
  useUser,
  useAuthModal,
  useLogout,
  useSignerStatus,
} from "@account-kit/react";

function DropdownItem({
  label,
  to,
  onClick,
}: {
  label: string;
  to?: string;
  onClick?: () => void;
}) {
  if (to) {
    return (
      <Link
        href={to}
        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
        prefetch={false}
      >
        {label}
      </Link>
    );
  }
  return (
    <button
      className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
      onClick={(e) => {
        // Prevent default and stop propagation to ensure the event doesn't bubble
        e.preventDefault();
        e.stopPropagation();
        
        // Delay the onClick to ensure the event doesn't get swallowed
        if (onClick) {
          setTimeout(() => {
            onClick();
          }, 10);
        }
      }}
    >
      {label}
    </button>
  );
}

export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();

  const handleLoginClick = () => {
    console.log("login button clicked");
    // First close the dropdown
    setShowProfileDropdown(false);
    
    // Important: Add a delay before opening the modal on mobile
    if (isMobile) {
      setTimeout(() => {
        openAuthModal();
      }, 100);
    } else {
      openAuthModal();
    }
  };

  // Add a standalone login button for mobile view
  const MobileLoginOption = () => {
    if (user) return null;
    
    return (
      <div className="px-4 pb-4">
        <button
          className="w-full bg-purple-600 text-white rounded-md py-2 font-medium"
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>
    );
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      {/* Mobile Header - Only on small screens */}
      <div className="md:hidden flex flex-col w-full">
        {/* Logo and Title Row */}
        <div className="flex items-center justify-center p-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/fanbase_logo.png"
              alt="Fanbase Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="font-bold text-xl">Fanbase</span>
          </Link>
        </div>

        {/* Profile Icon Above Search Bar */}
        <div className="flex justify-end px-4 pb-2">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center"
              onClick={() => setShowProfileDropdown((v) => !v)}
            >
              <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.email ? user.email[0].toUpperCase() : "?"}
                </span>
              </div>
            </button>

            {/* Profile Dropdown (mobile) */}
            {showProfileDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50"
                // Stop click propagation at the container level
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">
                        {user?.email ? user.email[0].toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user?.email ?? "User"}</h3>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">
                        {user?.address ?? "0x..."}
                      </p>
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
                  {user ? (
                    <DropdownItem label="Logout" onClick={logout} />
                  ) : (
                    <div>
                      {/* Custom inline login button handling for mobile */}
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowProfileDropdown(false);
                          setTimeout(() => {
                            console.log("Direct login click from mobile dropdown");
                            openAuthModal();
                          }, 100);
                        }}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="px-4 pb-4 w-full">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for anything on Fanbase"
              className="bg-gray-800 w-full pl-10 pr-4 py-2 rounded-md text-gray-200"
            />
          </div>
        </div>
        
        {/* Additional standalone login button for mobile */}
        <MobileLoginOption />
      </div>

      {/* Desktop Header - Normal layout for larger screens */}
      <div className="hidden md:flex items-center justify-between p-4">
        {/* Search Bar for desktop */}
        <div className="relative flex-1 max-w-2xl mx-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for anything on Fanbase"
            className="bg-gray-800 w-full pl-10 pr-4 py-2 rounded-md text-gray-200"
          />
        </div>

        {/* Profile Section - Desktop */}
        <div className="relative ml-auto" ref={dropdownRef}>
          <button
            className="flex items-center"
            onClick={() => setShowProfileDropdown((v) => !v)}
          >
            <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user?.email ? user.email[0].toUpperCase() : "?"}
              </span>
            </div>
          </button>

          {/* Profile Dropdown - Desktop */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-40">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="bg-purple-600 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">
                      {user?.email ? user.email[0].toUpperCase() : "?"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.email ?? "User"}</h3>
                    <p className="text-xs text-gray-400 truncate max-w-[180px]">
                      {user?.address ?? "0x..."}
                    </p>
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
                {user ? (
                  <DropdownItem label="Logout" onClick={logout} />
                ) : (
                  <DropdownItem label="Login" onClick={handleLoginClick} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
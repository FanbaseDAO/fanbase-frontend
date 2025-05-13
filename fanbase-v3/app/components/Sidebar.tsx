// components/Sidebar.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Compass, Bell, User, Plus, Menu, X } from "lucide-react";

function NavItem({ icon, label, to, closeMobileSidebar }: { 
  icon: React.ReactNode; 
  label: string; 
  to: string;
  closeMobileSidebar?: () => void;
}) {
  return (
    <Link
      href={to}
      className="flex items-center px-6 py-3 text-lg hover:bg-gray-800 text-gray-400"
      prefetch={false}
      onClick={closeMobileSidebar}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggle = document.getElementById("sidebar-toggle");
      if (
        isMobile &&
        isOpen &&
        sidebar &&
        toggle &&
        !sidebar.contains(event.target as Node) &&
        !toggle.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen]);

  const closeMobileSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  const sidebarClasses = `
    border-r border-gray-800 flex flex-col h-full bg-black
    ${isMobile ? "fixed top-0 left-0 z-50 transition-transform duration-300 w-64" : "w-64"}
    ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
  `;

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          id="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-10 left-4 z-50 p-2 rounded-md bg-gray-800 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div id="sidebar" className={sidebarClasses}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/fanbase_logo.png"
              alt="Fanbase Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-2xl tracking-wide">Fanbase</span>
          </Link>
        </div>
        <nav className="flex-1">
          <NavItem icon={<Home size={20} />} label="Home" to="/" closeMobileSidebar={closeMobileSidebar} />
          <NavItem icon={<Compass size={20} />} label="Discover" to="/discover" closeMobileSidebar={closeMobileSidebar} />
          <NavItem icon={<Bell size={20} />} label="Notifications" to="/notifications" closeMobileSidebar={closeMobileSidebar} />
          <NavItem icon={<User size={20} />} label="Profile" to="/profile" closeMobileSidebar={closeMobileSidebar} />
        </nav>
        <div className="p-4 mb-6">
          <Link href="/create" onClick={closeMobileSidebar}>
            <button className="w-full bg-white text-black rounded-full py-2 px-4 font-medium flex items-center justify-center">
              <Plus size={20} className="mr-2" /> Create
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

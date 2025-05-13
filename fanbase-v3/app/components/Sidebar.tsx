"use client";
import React from "react";
import Link from "next/link";
import { Home, Compass, Bell, User, Plus, Album } from "lucide-react";

function NavItem({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  // For highlighting active, you could use usePathname from next/navigation if needed
  return (
    <Link
      href={to}
      className="flex items-center px-6 py-3 text-lg hover:bg-gray-800 text-gray-400"
      prefetch={false}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/fanbase_logo.png" alt="Fanbase Logo" className="h-10 w-10 object-contain" />
          <span className="font-bold text-2xl tracking-wide">Fanbase</span>
        </Link>
      </div>
      {/* Navigation Items */}
      <nav className="flex-1">
        <NavItem icon={<Home size={20} />} label="Home" to="/" />
        <NavItem icon={<Album size={20} />} label="Artists" to="/artists" />
        <NavItem icon={<Bell size={20} />} label="Notifications" to="/notifications" />
        <NavItem icon={<User size={20} />} label="Profile" to="/profile" />
      </nav>
      {/* Create Button */}
      <div className="p-4 mb-6">
        <Link href="/create">
          <button className="w-full bg-white text-black rounded-full py-2 px-4 font-medium flex items-center justify-center">
            <Plus size={20} className="mr-2" /> Create
          </button>
        </Link>
      </div>
    </div>
  );
}

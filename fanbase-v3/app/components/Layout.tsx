"use client";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 font-bold text-xl tracking-wide">Fanbase</div>
        <nav className="flex-1 flex flex-col gap-2 px-2">
          <a href="/" className="px-4 py-2 rounded hover:bg-gray-800">Home</a>
          <a href="/explore" className="px-4 py-2 rounded hover:bg-gray-800">Explore</a>
          <a href="/notifications" className="px-4 py-2 rounded hover:bg-gray-800">Notifications</a>
          <a href="/profile" className="px-4 py-2 rounded hover:bg-gray-800">Profile</a>
        </nav>
        <div className="p-4">
          <a href="/create">
            <button className="w-full bg-white text-black rounded-full py-2 px-4 font-medium">Create</button>
          </a>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

import {
  useUser,
  useAuthModal,
  useLogout,
  useSignerStatus,
} from "@account-kit/react";

function Header() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const signerStatus = useSignerStatus();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
      <div className="font-bold text-lg">Fanbase</div>
      <div>
        {signerStatus.isInitializing ? (
          <span className="text-gray-400">Loading...</span>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email ?? "anon"}</span>
            <button className="btn btn-primary" onClick={logout}>
              Log out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={openAuthModal}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}


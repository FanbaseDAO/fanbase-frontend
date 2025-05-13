"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      {/* Sidebar - on mobile it's absolutely positioned and toggled via its internal state */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* For mobile only - the Sidebar is rendered twice, but this one is only visible on mobile */}
      <div className="md:hidden">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
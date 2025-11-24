"use client";
import { useAuth } from "@/context/authProvider";
import { useProtectedRoute } from "@/context/useProtected";
import { Menu, X, Bell, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { Toaster } from "sonner";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  useProtectedRoute();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-black overflow-hidden">
      {/* --- Mobile Sidebar Overlay --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider">
            <Image
              alt="BMW LOGO"
              src="/bmwtt.webp"
              height={40}
              width={40}
              className="w-10"
            />
            <span className="text-blue-500">BMW</span>ADMIN
          </div>
        </div>

        {/* Menu Items */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <SideMenu />
        </div>
      </aside>

      {/* --- Main Content Wrapper --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white focus:outline-none lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Optional Search Bar */}
            {/* <div className="hidden md:flex items-center bg-gray-800 rounded-md px-3 py-1.5 border border-gray-700">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-64"
              />
            </div> */}
          </div>

          {/* User Profile Right Side */}
          <div className="flex items-center gap-4">
            {/* <button className="relative text-gray-400 hover:text-white transition">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button> */}

            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">
                  Hi, {user?.firstName || "Admin"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || "admin@gmail.com"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full border border-gray-700 bg-gray-800 overflow-hidden p-1">
                <Image
                  src="/bmwtt.webp"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-950 p-6">
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  );
};

export default DashboardLayout;

"use client";
import { useAuth } from "@/context/authProvider";
import { useProtectedRoute } from "@/context/useProtected";
import { Menu } from "lucide-react";
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

  console.log(user);
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  return (
    <div className="w-full h-screen flex bg-gray-900 max-h-screen overflow-hidden">
      <div
        className={`${
          sideMenuOpen ? "w-[17%]" : "w-0"
        } border-r-gray-300  border-r-2`}
      >
        {sideMenuOpen && (
          <div className="w-full  flex items-center justify-center px-5 py-5 border-b-gray-300 border-b-2">
            <Image
              alt="BMW LOGO"
              src="/bmwtt.webp"
              height={520}
              width={520}
              className="w-[78px] cursor-pointer"
            />
          </div>
        )}

        <div className=" text-white text-sm font-semibold">
          {sideMenuOpen && <SideMenu />}
        </div>
      </div>
      <div
        className={`${
          sideMenuOpen ? "w-[83%]" : "w-full"
        } border-r-gray-300  border-r-2 transition-all duration-300 ease-in-out`}
      >
        <div className="w-full border-b-2 border-b-gray-300 flex items-center justify-between px-15 py-5">
          <div onClick={() => setSideMenuOpen(!sideMenuOpen)}>
            <Menu className="text-white cursor-pointer" />
          </div>
          <div className=" flex items-center gap-3">
            <div className="w-[60px] p-1 border-2 border-gray-300 rounded-full py-2 ">
              <Image
                src="/bmwtt.webp"
                alt="adminImg"
                width={520}
                height={520}
                className="p-1 rounded-full w-[100px] cursor-pointer "
              />
            </div>
            <div className="text-white text-sm">
              <h1 className="cursor-pointer ">Hi, Admin</h1>
              <h2 className="cursor-pointer ">admmin@gmail.com</h2>
            </div>
          </div>
        </div>
        <div className="h-screen">{children}</div>
      </div>

      {/* toast  */}

      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default DashboardLayout;

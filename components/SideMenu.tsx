"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/authProvider";

const menuStyles =
  "py-2 px-2 lg:px-10 hover:bg-primary transition duration-300 ease-in-out  cursor-pointer";

const SideMenu = () => {
  const [v_menuClicked, setV_MenuClicked] = useState(false);
  const [t_menuClicked, setT_MenuClicked] = useState(false);
  const [f_menuClicked, setF_MenuClicked] = useState(false);

  const { logoutUser } = useAuth();
  return (
    <div className="w-full flex flex-col gap-2  py-10">
      <Link href="/dashboard" className={`${menuStyles}`}>
        Dashboard
      </Link>
      <div
        className={`${menuStyles} flex items-center justify-between`}
        onClick={() => {
          setV_MenuClicked(!v_menuClicked);
          setT_MenuClicked(false);
          setF_MenuClicked(false);
        }}
      >
        <h1>Vehicle Management</h1>
        <ChevronRight
          size={20}
          className={`${
            v_menuClicked ? "rotate-90" : "rotate-0"
          } transition-transform duration-300 ease-in-out  `}
        />
      </div>
      {/* Dropdown Menu */}
      {v_menuClicked && (
        <div
          className={`overflow-hidden w-full flex flex-col gap-2  text-start bg-gray-600 transition-transform duration-300 ease-in-out  ${
            v_menuClicked ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Link
            href="/dashboard/vehicle/manage-vehicle"
            className={`${menuStyles} `}
          >
            Manage Vehicle
          </Link>
          <Link
            href="/dashboard/vehicle/maintanance"
            className={`${menuStyles} `}
          >
            Vehicle Maintanince
          </Link>
          <Link
            href="/dashboard/vehicle/manage-trips"
            className={`${menuStyles} `}
          >
            Manage Trips
          </Link>
          {/* <Link
            href="/dashboard/vehicle/manage-quotations"
            className={`${menuStyles} `}
          >
            Manage Quotations
          </Link> */}
        </div>
      )}

      {/* ticket menu */}

      <div
        className={`${menuStyles} flex items-center justify-between`}
        onClick={() => {
          setV_MenuClicked(false);
          setT_MenuClicked(!t_menuClicked);
          setF_MenuClicked(false);
        }}
      >
        <h1>Ticket Management</h1>
        <ChevronRight
          size={20}
          className={`${
            t_menuClicked ? "rotate-90" : "rotate-0"
          } transition-transform duration-300 ease-in-out  `}
        />
      </div>

      {/* Dropdown Menu */}
      {t_menuClicked && (
        <div className="w-full flex flex-col gap-2  text-start bg-gray-600 transition-transform duration-300 ease-in-out">
          <Link href="/dashboard/vehicle/add" className={`${menuStyles} `}>
            Add Ticlet amount
          </Link>
          <Link href="/dashboard/vehicle/add" className={`${menuStyles} `}>
            Add Ticket Sale
          </Link>
          <Link
            href="/dashboard/vehicle/maintance"
            className={`${menuStyles} `}
          >
            Unpaid Payments
          </Link>
          <Link
            href="/dashboard/vehicle/maintance"
            className={`${menuStyles} `}
          >
            Ticket Sales Report
          </Link>
        </div>
      )}

      {/* finance menu */}

      <div
        className={`${menuStyles} flex items-center justify-between`}
        onClick={() => {
          setV_MenuClicked(false);
          setT_MenuClicked(false);
          setF_MenuClicked(!f_menuClicked);
        }}
      >
        <h1>Finance & Expenses</h1>
        <ChevronRight
          size={20}
          className={`${
            f_menuClicked ? "rotate-90" : "rotate-0"
          } transition-transform duration-300 ease-in-out  `}
        />
      </div>

      {/* Dropdown Menu */}
      {f_menuClicked && (
        <div className="w-full flex flex-col gap-2  text-start bg-gray-600 transition-transform duration-300 ease-in-out">
          <Link href="/dashboard/vehicle/add" className={`${menuStyles} `}>
            Manage Invoices
          </Link>
          <Link href="/dashboard/vehicle/add" className={`${menuStyles} `}>
            Manage Staff Salaries
          </Link>
          <Link
            href="/dashboard/vehicle/maintance"
            className={`${menuStyles} `}
          >
            Unpaid Payments
          </Link>
          <Link
            href="/dashboard/vehicle/maintance"
            className={`${menuStyles} `}
          >
            Total Profit and Loss Report
          </Link>
        </div>
      )}

      <Link
        href="/dashboard/clients/manage-clients"
        className={`${menuStyles}`}
      >
        Manage Clients
      </Link>
      <Link href="/support" className={`${menuStyles}`}>
        Support
      </Link>

      <Link href="/dashboard" className={`${menuStyles}`}>
        Settings
      </Link>

      <button
        className={`${menuStyles} w-full flex justify-start`}
        onClick={logoutUser}
      >
        Logout
      </button>
    </div>
  );
};

export default SideMenu;

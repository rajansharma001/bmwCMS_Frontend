"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/authProvider";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Ticket,
  Globe,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// --- Menu Configuration ---
const MENU_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vehicle Management",
    icon: Car,
    key: "vehicle", // Unique key for state management
    submenu: [
      { title: "Manage Vehicle", href: "/dashboard/vehicle/manage-vehicle" },
      { title: "Maintenance", href: "/dashboard/vehicle/maintanance" },
      { title: "Manage Trips", href: "/dashboard/vehicle/manage-trips" },
    ],
  },
  {
    title: "Ticket Management",
    icon: Ticket,
    key: "ticket",
    submenu: [
      { title: "Manage Funds", href: "/dashboard/tickets/manage-funds" },
      { title: "Manage Tickets", href: "/dashboard/tickets/manage-tickets" },
    ],
  },
  {
    title: "Web Management",
    icon: Globe,
    key: "web",
    submenu: [
      { title: "Manage Brand", href: "/dashboard/web/manage-brand" },
      { title: "Manage Slider", href: "/dashboard/web/manage-slider" },
      { title: "Manage Counter", href: "/dashboard/web/manage-counter" },
      { title: "Manage About", href: "/dashboard/web/manage-about" },
      { title: "Manage Services", href: "/dashboard/web/manage-services" },
      {
        title: "Manage WhyChooseUs",
        href: "/dashboard/web/manage-whychooseus",
      },
      { title: "Manage Gallery", href: "/dashboard/web/manage-gallery" },
      { title: "Manage FAQs", href: "/dashboard/web/manage-faq" },
      {
        title: "Manage Testimonials",
        href: "/dashboard/web/manage-testimonial",
      },
      {
        title: "Manage Packages",
        href: "/dashboard/web/manage-package",
      },
    ],
  },
  {
    title: "Clients",
    href: "/dashboard/clients/manage-clients",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const SideMenu = () => {
  const { logoutUser } = useAuth();
  const pathname = usePathname();
  // Instead of multiple booleans, we use one string to track which menu is open
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const toggleMenu = (key: string) => {
    setOpenMenuKey(openMenuKey === key ? null : key);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex flex-col gap-1 p-4">
      {MENU_ITEMS.map((item, index) => {
        const Icon = item.icon;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isMenuOpen = openMenuKey === item.key;

        // Check if any child is active to highlight parent
        const isChildActive =
          hasSubmenu && item.submenu?.some((sub) => sub.href === pathname);

        return (
          <div key={index}>
            {hasSubmenu ? (
              /* --- Parent Item with Dropdown --- */
              <button
                onClick={() => toggleMenu(item.key!)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 group ${
                  isChildActive || isMenuOpen
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {isMenuOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              /* --- Single Link Item --- */
              <Link
                href={item.href || "#"}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.href!)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            )}

            {
              /* --- Submenu Rendering --- */
              hasSubmenu && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 pl-4 border-l border-gray-700 flex flex-col space-y-1 ">
                    {item.submenu!.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                          isActive(subItem.href)
                            ? "text-blue-400 font-semibold bg-gray-800/50"
                            : "text-gray-500 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </div>
        );
      })}

      {/* --- Logout Button --- */}
      <div className="mt-8 pt-4 border-t border-gray-800">
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default SideMenu;

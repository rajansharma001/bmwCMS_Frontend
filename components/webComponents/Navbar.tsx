"use client";
import { useAuth } from "@/context/authProvider";
import { Menu, Mountain, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// 🎯 Make menu dynamic
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href={"/"}>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`h-12 w-12 flex items-center justify-center rounded-lg overflow-hidden  ${
                  scrolled ? "bg-blue-50" : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <Image
                  alt="logo"
                  src={
                    "https://bmwtoursandtravels.com/wp-content/uploads/2024/08/bmwtt.webp"
                  }
                  width={250}
                  height={250}
                />
              </div>
              <div>
                <h1
                  className={`text-2xl font-extrabold tracking-tight leading-none ${
                    scrolled ? "text-blue-900" : "text-white"
                  }`}
                >
                  BEST MID WEST
                </h1>
                <p
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                    scrolled ? "text-red-600" : "text-gray-200"
                  }`}
                >
                  Tours & Travels Pvt. Ltd.
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`text-sm font-bold uppercase tracking-wider hover:text-red-500 transition-colors cursor-pointer ${
                  scrolled ? "text-gray-700" : "text-gray-100"
                }`}
              >
                {label}
              </a>
            ))}

            <a
              href="/contact"
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Book Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none cursor-pointer ${
                scrolled ? "text-blue-900" : "text-white"
              }`}
            >
              {isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-blue-900/98 backdrop-blur-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden flex flex-col justify-center items-center space-y-8`}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-white hover:text-red-400 transition-colors cursor-pointer"
          >
            {label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={() => setIsOpen(false)}
          className="mt-8 bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition cursor-pointer shadow-xl"
        >
          Inquire Now
        </a>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white p-2 cursor-pointer hover:bg-white/10 rounded-full"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

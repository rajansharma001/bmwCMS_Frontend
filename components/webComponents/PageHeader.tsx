"use client";
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

// Default background if none is provided
const DEFAULT_BG =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

const PageHeader = ({ title, breadcrumb, backgroundImage = DEFAULT_BG }) => {
  return (
    <section className="relative h-[40vh] min-h-[350px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Brand Overlay (Navy Blue with transparency) */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-blue-900/90" />

      {/* Decorative Bottom Curve (Optional - matches your modern aesthetic) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L1440 120L1440 0C1440 0 1082.5 97.5 720 97.5C357.5 97.5 0 0 0 0L0 120Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight">
          {title}
        </h1>

        {/* Breadcrumb Navigation */}
        <nav className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-xl hover:bg-white/20 transition-colors duration-300">
          <Link
            href="/"
            className="flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase tracking-wider"
          >
            <Home className="w-4 h-4 mr-2 mb-0.5" />
            Home
          </Link>

          <ChevronRight className="w-4 h-4 text-red-500" />

          <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
            {breadcrumb || title}
          </span>
        </nav>
      </div>
    </section>
  );
};

export default PageHeader;

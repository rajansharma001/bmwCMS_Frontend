"use client";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Mountain,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-blue-900 text-white pt-20 pb-10 border-t border-blue-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Best Mid West</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Tours & Travels Pvt. Ltd.
              </p>
            </div>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed text-sm">
            Your trusted partner for Vehicle Rental, Air Ticketing & Courier
            Services in Western Nepal.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-white border-b border-blue-700 pb-2 inline-block">
            Company
          </h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <a
                href="#home"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2 text-red-500" /> Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2 text-red-500" /> About Us
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2 text-red-500" /> Services
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2 text-red-500" /> Gallery
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2 text-red-500" /> Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-white border-b border-blue-700 pb-2 inline-block">
            Our Services
          </h4>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>
              <a
                href="#"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <span className="text-red-500 mr-2">›</span> Vehicle Rental
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <span className="text-red-500 mr-2">›</span> Air Ticketing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <span className="text-red-500 mr-2">›</span> Courier Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-red-400 transition flex items-center cursor-pointer"
              >
                <span className="text-red-500 mr-2">›</span> Hotel Booking
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-white border-b border-blue-700 pb-2 inline-block">
            Contact Info
          </h4>
          <ul className="space-y-4 text-gray-300 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span>
                Kohalpur-11, New Road Chwok,
                <br />
                Banke, Nepal
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p>+977 9858020127</p>
                <p>+977 9825541127</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span>bmwtt127@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © 2025 Best Mid West Tours and Travels Pvt. Ltd. | All Rights Reserved
        </p>
        <div className="text-gray-400 text-sm flex gap-1">
          Designed & Developed By
          <a
            href="https://rajansharma.info.np"
            target="_blank"
            className="hover:text-red-400 transition"
          >
            Rajan Sharma
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

"use client";
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Package,
  Phone,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
const SocialIcon = ({ Icon }) => (
  <a
    href="#"
    className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 cursor-pointer"
  >
    <Icon className="w-5 h-5" />
  </a>
);
// --- CONTACT FORM SECTION ---
const ContactSection = () => (
  <section id="contact" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <FadeIn>
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            Get in Touch
          </span>
          <h2 className="text-4xl font-extrabold text-blue-900 mt-2 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Need a vehicle or flight ticket? Fill out the form or call us
            directly. We are available to assist you.
          </p>

          <div className="space-y-8">
            <div className="flex items-start group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  Visit our office
                </h4>
                <p className="text-gray-600">
                  Kohalpur-11, New Road Chwok,
                  <br />
                  Banke, Nepal
                </p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  Call Us
                </h4>
                <p className="text-gray-600">+977 9858020127</p>
                <p className="text-gray-600">+977 9825541127</p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-5 flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                <Mail className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  Message Us
                </h4>
                <p className="text-gray-600">bmwtt127@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <SocialIcon Icon={Facebook} />
            <SocialIcon Icon={Instagram} />
            <SocialIcon Icon={Twitter} />
            <SocialIcon Icon={Globe} />
          </div>
        </FadeIn>

        {/* Contact Form */}
        <FadeIn
          delay={200}
          className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-6">
            Send us a Message
          </h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+977..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
              ></textarea>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2">
              <Package className="w-5 h-5" /> Send Message
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default ContactSection;

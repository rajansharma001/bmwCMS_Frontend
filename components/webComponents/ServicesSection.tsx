"use client";
import { ArrowRight, Car, Package, Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SmileIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" x2="9.01" y1="9" y2="9" />
    <line x1="15" x2="15.01" y1="9" y2="9" />
  </svg>
);

const ServiceCard = ({ icon: Icon, title, desc, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group relative overflow-hidden cursor-pointer h-full flex flex-col">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`}
    ></div>
    <div
      className={`relative z-10 w-16 h-16 bg-${color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${color}-600 transition-colors duration-300 flex-shrink-0`}
    >
      <Icon
        className={`h-8 w-8 text-${color}-600 group-hover:text-white transition-colors duration-300`}
      />
    </div>
    <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-3">
      {title}
    </h3>
    <p className="relative z-10 text-gray-600 leading-relaxed mb-6 grow">
      {desc}
    </p>
    <span
      className={`relative z-10 inline-flex items-center text-${color}-600 font-bold group-hover:underline mt-auto`}
    >
      Book Now <ArrowRight className="ml-1 w-4 h-4" />
    </span>
  </div>
);
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
const ServicesSection = () => (
  <section id="services" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <FadeIn>
          <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
            Our Services
          </span>
          <h2 className="text-4xl font-extrabold text-blue-900 mt-2 mb-4">
            All-Inclusive Travel Solutions
          </h2>
          <p className="text-gray-600 text-lg">
            We don`t just get you from point A to point B; we make sure your
            entire journey is smooth, efficient, and enjoyable.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FadeIn delay={0}>
          <ServiceCard
            icon={Car}
            title="Vehicle Hire"
            desc="Choose from our extensive fleet including Scorpios, Cars, Pickups, and Hiace vans. Well-maintained vehicles for safe travel across Nepal."
            color="blue"
          />
        </FadeIn>
        <FadeIn delay={100}>
          <ServiceCard
            icon={Plane}
            title="Air Ticketing"
            desc="Domestic and International flight tickets at competitive prices. We help you reach your destination without breaking the bank."
            color="red"
          />
        </FadeIn>
        <FadeIn delay={200}>
          <ServiceCard
            icon={Package}
            title="Courier Service"
            desc="Reliable courier services ensuring your parcels are delivered promptly and safely to their destinations."
            color="indigo"
          />
        </FadeIn>
      </div>
    </div>
  </section>
);

export default ServicesSection;

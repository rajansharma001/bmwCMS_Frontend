"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import * as LucideIcons from "lucide-react";

const ServiceCard = ({ icon: Icon, title, desc, color, link }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group relative overflow-hidden cursor-pointer h-full flex flex-col">
    <div
      className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500`}
    ></div>
    <div
      className={`relative z-10 w-16 h-16 bg-${color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${color}-600 transition-colors duration-300 shrink-0`}
    >
      <Icon
        className={`h-8 w-8 text-${color}-600 group-hover:text-white transition-colors duration-300`}
      />
    </div>
    <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-3">
      {title}
    </h3>
    <div
      className="relative z-10 text-gray-600 leading-relaxed mb-6 grow"
      dangerouslySetInnerHTML={{
        __html: desc,
      }}
    />

    <Link href={link}>
      <span
        className={`relative z-10 inline-flex items-center text-${color}-600 font-bold group-hover:underline mt-auto`}
      >
        Book Now <ArrowRight className="ml-1 w-4 h-4" />
      </span>
    </Link>
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
const ServicesSection = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/get-service`,
          { method: "GET", credentials: "include" }
        );
        const result = await res.json();
        if (res.ok && isMounted) setServices(result.getServices);
        else if (isMounted) console.log(result.error);
      } catch (error) {
        console.log("API Error!", error);
      }
    };
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const serviceDetails = services[0];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <FadeIn>
            <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
              {serviceDetails?.heading}
            </span>
            <h2 className="text-4xl font-extrabold text-blue-900 mt-2 mb-4">
              {serviceDetails?.title}
            </h2>
            <div
              className="text-gray-600 text-lg"
              dangerouslySetInnerHTML={{
                __html: serviceDetails?.shortDescription,
              }}
            />
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceDetails?.items.map((service, index) => {
            const IconComponent = LucideIcons[service.icon];
            if (!IconComponent) return null;
            return (
              <FadeIn key={index} delay={0}>
                <ServiceCard
                  icon={IconComponent}
                  title={service?.title}
                  desc={service?.paragraph}
                  link={service?.link}
                  color="blue"
                />
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

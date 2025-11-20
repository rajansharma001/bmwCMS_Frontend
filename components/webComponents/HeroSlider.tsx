"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSlider = () => {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      subtitle: "Plan your trip now",
      title: "Save More with Our Travel & Car Rentals!",
      desc: "To contribute to positive change and achieve our sustainability goals with many extraordinary trips.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      subtitle: "Premium Fleet",
      title: "Reliable Vehicle Hire Services",
      desc: "Scorpio, Jeep, Car, or Hiace - We have the perfect ride for your journey across Nepal.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      subtitle: "Global Connectivity",
      title: "Domestic & Int'l Air Ticketing",
      desc: "Best deals on flights from Nepalgunj & Kathmandu to anywhere in the world.",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((current - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden" id="home">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[10000ms]"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === current ? "scale(110%)" : "scale(100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-black/40 to-black/70" />

          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div
              className={`max-w-5xl transition-all duration-1000 delay-300 transform ${
                index === current
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="inline-block py-2 px-4 rounded-full bg-red-600 text-white text-sm font-bold tracking-widest uppercase mb-6 shadow-lg border border-red-400/50">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-gray-100 mb-10 font-light max-w-3xl mx-auto drop-shadow-lg">
                {slide.desc}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20 hidden md:block group cursor-pointer z-20"
      >
        <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20 hidden md:block group cursor-pointer z-20"
      >
        <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default HeroSlider;

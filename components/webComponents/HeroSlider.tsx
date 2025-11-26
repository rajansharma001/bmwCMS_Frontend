"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sliders/get-slider`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await res.json();
        if (!res.ok) {
          if (isMounted) {
            console.log(result.error);
          }
        } else {
          if (isMounted) {
            setSlides(result.getSlider);
          }
        }
      } catch (error) {
        console.log("API Error!", error);
      }
    };
    handleFetch();
    return () => {
      isMounted = false;
    };
  }, []);

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
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image with smooth scale animation */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-12000 ease-in-out`}
            style={{
              backgroundImage: `url(${slide.slideImg})`,
              transform: index === current ? "scale(1.1)" : "scale(1)",
            }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-900/70 via-black/40 to-black/70" />

          {/* Slide Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div
              className={`max-w-5xl transition-all duration-1000 delay-300 transform ${
                index === current
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <span className="inline-block py-2 px-4 rounded-full bg-red-600 text-white text-sm font-bold tracking-widest uppercase mb-6 shadow-lg border border-red-400/50 animate-pulse">
                {slide.heading}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl animate-fadeInUp">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-gray-100 mb-10 font-light max-w-3xl mx-auto drop-shadow-lg animate-fadeInUp delay-200">
                {slide.paragraph}
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

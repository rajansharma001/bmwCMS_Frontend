"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
// FadeIn Component for Scroll Animations
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

const AboutSection = () => {
  const [about, setAbout] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const handleFetch = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/abouts/get-about`,
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
            setAbout(result.getAbout);
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

  const aboutDetails = about[0];

  return (
    <section id="about" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-100 rounded-full z-40"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full z-40"></div>
            {aboutDetails?.aboutImage && (
              <Image
                src={aboutDetails.aboutImage}
                alt="About Us"
                height={500}
                width={720}
                className="relative z-10 rounded-2xl shadow-2xl w-full h-[550px] object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            )}
            <div className="absolute bottom-10 -left-6 bg-white p-8 rounded-xl shadow-xl z-20 max-w-xs hidden md:block border-l-4 border-blue-900">
              <p className="text-4xl font-bold text-blue-900 mb-1">2070 BS</p>
              <p className="text-gray-600 font-medium text-sm">Established</p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <span className="text-red-600 font-bold tracking-wider uppercase text-sm">
              {aboutDetails?.heading}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 mb-6 leading-tight text-justify">
              <span className="text-blue-900">{aboutDetails?.title}</span>
            </h2>

            <div
              className="text-gray-600 text-lg mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: aboutDetails?.paragraph }}
            />
            <a
              href="/about"
              className="group inline-flex items-center bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all cursor-pointer shadow-lg"
            >
              Learn More
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

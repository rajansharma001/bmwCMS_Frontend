"use client";

import HeroSlider from "@/components/webComponents/HeroSlider";
import ProcessSection from "@/components/webComponents/ProcessSection";
import CounterSection from "@/components/webComponents/CounterSection";
import AboutSection from "@/components/webComponents/AboutSection";
import FaqSection from "@/components/webComponents/FaqSection";
import ServicesSection from "@/components/webComponents/ServicesSection";
import WhyChooseUs from "@/components/webComponents/WhyChooseUs";
import TestimonialsSection from "@/components/webComponents/TestimonialsSection";
import ContactSection from "@/components/webComponents/ContactSection";
import GallerySection from "@/components/webComponents/GallerySection";

// --- MAIN LAYOUT ---

export default function HomePage() {
  return (
    <div className="font-sans bg-white text-gray-900 scroll-smooth">
      <HeroSlider />
      <ProcessSection />
      <CounterSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <GallerySection />
      <FaqSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}

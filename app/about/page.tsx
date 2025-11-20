"use client";
import AboutSection from "@/components/webComponents/AboutSection";
import CounterSection from "@/components/webComponents/CounterSection";
import PageHeader from "@/components/webComponents/PageHeader";
import WhyChooseUs from "@/components/webComponents/WhyChooseUs";
import React from "react";

const About = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"about"} title={"About Us"} />
      <AboutSection />
      <CounterSection />
      <WhyChooseUs />
    </div>
  );
};

export default About;

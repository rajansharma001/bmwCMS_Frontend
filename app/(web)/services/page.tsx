"use client";
import PageHeader from "@/components/webComponents/PageHeader";
import ProcessSection from "@/components/webComponents/ProcessSection";
import ServicesSection from "@/components/webComponents/ServicesSection";
import React from "react";

const Services = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"services"} title={"Our Services"} />
      <ProcessSection />
      <ServicesSection />
    </div>
  );
};

export default Services;

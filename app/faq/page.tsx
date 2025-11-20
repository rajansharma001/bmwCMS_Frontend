"use client";
import FaqSection from "@/components/webComponents/FaqSection";
import PageHeader from "@/components/webComponents/PageHeader";
import React from "react";

const Faq = () => {
  return (
    <div className="w-full">
      <PageHeader breadcrumb={"faq"} title={"FAQs"} />
      <FaqSection />
    </div>
  );
};

export default Faq;
